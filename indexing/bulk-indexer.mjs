#!/usr/bin/env node

import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { setTimeout as sleep } from "node:timers/promises"
import { GoogleAuth } from "google-auth-library"

const INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish"

function parseBoolean(value) {
  if (typeof value !== "string") return false
  const normalized = value.trim().toLowerCase()
  return normalized === "1" || normalized === "true" || normalized === "yes"
}

function parseNumber(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractUrlsFromSitemap(xmlContent) {
  const urls = []
  const seen = new Set()
  const locRegex = /<loc>([\s\S]*?)<\/loc>/gi

  for (const match of xmlContent.matchAll(locRegex)) {
    const loc = decodeXml(match[1].trim())
    if (!loc || seen.has(loc)) continue
    seen.add(loc)
    urls.push(loc)
  }

  return urls
}

function printHelp() {
  const message = `Bulk Indexing API requester

Usage:
  npm run index:bulk -- --key-file <path> [--sitemap <path-or-url>] [options]

Options:
  --key-file, -k   Service account JSON key path
  --sitemap, -s    Sitemap path or URL (default: public/sitemap.xml)
  --type, -t       URL notification type: URL_UPDATED or URL_DELETED (default: URL_UPDATED)
  --limit, -l      Max URLs to submit (default: all)
  --delay-ms, -d   Delay between requests in milliseconds (default: 400)
  --contains, -c   Submit only URLs containing this substring (repeatable)
  --dry-run        Print URLs without calling API
  --help, -h       Show this help

Environment variables:
  INDEXING_KEY_FILE, INDEXING_SITEMAP, INDEXING_TYPE, INDEXING_LIMIT,
  INDEXING_DELAY_MS, INDEXING_DRY_RUN, INDEXING_CONTAINS (comma-separated)
`

  console.log(message)
}

function parseArgs(argv) {
  const result = {
    keyFile: undefined,
    sitemap: undefined,
    type: undefined,
    limit: undefined,
    delayMs: undefined,
    dryRun: false,
    contains: [],
    help: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === "--help" || arg === "-h") {
      result.help = true
      continue
    }

    if (arg === "--dry-run") {
      result.dryRun = true
      continue
    }

    if (arg === "--key-file" || arg === "-k") {
      result.keyFile = argv[i + 1]
      i += 1
      continue
    }

    if (arg === "--sitemap" || arg === "-s") {
      result.sitemap = argv[i + 1]
      i += 1
      continue
    }

    if (arg === "--type" || arg === "-t") {
      result.type = argv[i + 1]
      i += 1
      continue
    }

    if (arg === "--limit" || arg === "-l") {
      result.limit = argv[i + 1]
      i += 1
      continue
    }

    if (arg === "--delay-ms" || arg === "-d") {
      result.delayMs = argv[i + 1]
      i += 1
      continue
    }

    if (arg === "--contains" || arg === "-c") {
      const value = argv[i + 1]
      if (value) result.contains.push(value)
      i += 1
      continue
    }

    if (!arg.startsWith("-")) {
      if (!result.keyFile) {
        result.keyFile = arg
      } else if (!result.sitemap) {
        result.sitemap = arg
      }
    }
  }

  return result
}

async function loadSitemapContent(input) {
  if (/^https?:\/\//i.test(input)) {
    const response = await fetch(input)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch sitemap: ${response.status} ${response.statusText}`
      )
    }
    return response.text()
  }

  return readFile(input, "utf8")
}

function normalizeContainsFilters(rawFilters) {
  return rawFilters
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.toLowerCase())
}

function buildErrorSummary(error) {
  const status = error?.response?.status
  const payload = error?.response?.data
  const message =
    payload?.error?.message ||
    payload?.error_description ||
    error?.message ||
    "Unknown error"

  return {
    status,
    message,
  }
}

async function main() {
  const cliArgs = parseArgs(process.argv.slice(2))

  if (cliArgs.help) {
    printHelp()
    return
  }

  const keyFile =
    cliArgs.keyFile ||
    process.env.INDEXING_KEY_FILE ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (!keyFile) {
    throw new Error(
      "Missing credentials path. Pass --key-file or set INDEXING_KEY_FILE."
    )
  }

  const defaultSitemapPath = path.resolve(process.cwd(), "public/sitemap.xml")
  const sitemap =
    cliArgs.sitemap || process.env.INDEXING_SITEMAP || defaultSitemapPath
  const type = (
    cliArgs.type ||
    process.env.INDEXING_TYPE ||
    "URL_UPDATED"
  ).toUpperCase()

  if (type !== "URL_UPDATED" && type !== "URL_DELETED") {
    throw new Error('Invalid --type. Use "URL_UPDATED" or "URL_DELETED".')
  }

  const limit = Math.max(
    0,
    Math.trunc(
      parseNumber(
        cliArgs.limit || process.env.INDEXING_LIMIT,
        Number.MAX_SAFE_INTEGER
      )
    )
  )
  const delayMs = Math.max(
    0,
    Math.trunc(
      parseNumber(cliArgs.delayMs || process.env.INDEXING_DELAY_MS, 400)
    )
  )
  const dryRun =
    cliArgs.dryRun || parseBoolean(process.env.INDEXING_DRY_RUN || "false")

  const containsFromEnv = (process.env.INDEXING_CONTAINS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
  const containsFilters = normalizeContainsFilters([
    ...cliArgs.contains,
    ...containsFromEnv,
  ])

  const sitemapContent = await loadSitemapContent(sitemap)
  let urls = extractUrlsFromSitemap(sitemapContent)

  if (containsFilters.length > 0) {
    urls = urls.filter((url) => {
      const normalizedUrl = url.toLowerCase()
      return containsFilters.some((filterValue) =>
        normalizedUrl.includes(filterValue)
      )
    })
  }

  if (limit > 0) {
    urls = urls.slice(0, limit)
  }

  if (urls.length === 0) {
    console.log("No URLs matched the current filters.")
    return
  }

  console.log(`Loaded ${urls.length} URLs from ${sitemap}`)
  console.log(`Notification type: ${type}`)
  console.log(`Credentials file: ${keyFile}`)
  if (containsFilters.length > 0) {
    console.log(`URL filters: ${containsFilters.join(", ")}`)
  }

  if (dryRun) {
    console.log("Dry run mode enabled. URLs that would be submitted:")
    urls.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`)
    })
    return
  }

  const auth = new GoogleAuth({
    keyFile,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  })
  const client = await auth.getClient()

  let successCount = 0
  const failures = []

  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i]
    const progress = `[${i + 1}/${urls.length}]`

    try {
      await client.request({
        url: INDEXING_ENDPOINT,
        method: "POST",
        data: {
          url,
          type,
        },
      })

      successCount += 1
      console.log(`${progress} OK ${url}`)
    } catch (error) {
      const summary = buildErrorSummary(error)
      failures.push({ url, ...summary })
      console.error(
        `${progress} FAIL ${url} -> ${summary.status || "ERR"} ${summary.message}`
      )

      const quotaHit =
        summary.status === 429 ||
        (summary.status === 403 && /quota|rate|limit/i.test(summary.message))

      if (quotaHit) {
        console.error("Quota or rate limit detected. Stopping early.")
        break
      }
    }

    if (i < urls.length - 1 && delayMs > 0) {
      await sleep(delayMs)
    }
  }

  console.log("\nSummary")
  console.log(`- Submitted: ${successCount + failures.length}`)
  console.log(`- Success: ${successCount}`)
  console.log(`- Failed: ${failures.length}`)

  if (failures.length > 0) {
    console.log("\nFailure details:")
    for (const failure of failures) {
      console.log(
        `- ${failure.url} -> ${failure.status || "ERR"} ${failure.message}`
      )
    }
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(`Bulk indexing failed: ${error.message}`)
  process.exitCode = 1
})
