export const DOWNLOAD_COOKIE_NAME = "fc_download_payload"
export const DOWNLOAD_COOKIE_MAX_AGE_SECONDS = 5 * 60
export const DOWNLOAD_UNLOCK_QUERY_KEY = "unlock"
export const DOWNLOAD_UNLOCK_QUERY_VALUE = "1"
export const DOWNLOAD_WAIT_SECONDS = 15

const FALLBACK_TOOL_NAME = "sip calculator"

const DOWNLOAD_LANDING_TOOL_PATHS = [
  "/tools/sip-calculator",
  "/tools/home-loan-eligibility-calculator",
  "/tools/tax-regime-comparison",
  "/tools/stt-calculator",
]

export function pickDownloadLandingToolPath(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  const index = hash % DOWNLOAD_LANDING_TOOL_PATHS.length
  return DOWNLOAD_LANDING_TOOL_PATHS[index] ?? DOWNLOAD_LANDING_TOOL_PATHS[0]
}

export function getToolNameFromPath(pathname: string): string {
  if (!pathname.startsWith("/tools/")) {
    return FALLBACK_TOOL_NAME
  }

  const slug = pathname.replace("/tools/", "").split("/")[0]
  if (!slug) {
    return FALLBACK_TOOL_NAME
  }

  return slug.replace(/-/g, " ")
}

export function buildFallbackSearchUrl(toolName: string): string {
  const normalizedTool = toolName.trim() || FALLBACK_TOOL_NAME
  return `https://www.google.com/search?q=${encodeURIComponent(`financechk.com ${normalizedTool}`)}`
}

export function getCookieValue(
  cookieSource: string,
  cookieName: string
): string | null {
  const match = cookieSource
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`))

  if (!match) {
    return null
  }

  return match.slice(cookieName.length + 1)
}

function normalizeBase64(base64UrlValue: string): string {
  const base64Value = base64UrlValue.replace(/-/g, "+").replace(/_/g, "/")
  const remainder = base64Value.length % 4

  if (remainder === 0) {
    return base64Value
  }

  return `${base64Value}${"=".repeat(4 - remainder)}`
}

function decodeBase64ToUtf8(base64UrlValue: string): string | null {
  try {
    const normalized = normalizeBase64(base64UrlValue)

    if (typeof Buffer !== "undefined") {
      return Buffer.from(normalized, "base64").toString("utf-8")
    }

    if (typeof atob === "function") {
      const binary = atob(normalized)
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    }

    return null
  } catch {
    return null
  }
}

export function decodeEncryptedDownloadValue(
  encryptedValue: string
): string | null {
  const decoded = decodeBase64ToUtf8(encryptedValue)

  if (!decoded) {
    return null
  }

  try {
    const url = new URL(decoded)

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null
    }

    return url.toString()
  } catch {
    return null
  }
}
