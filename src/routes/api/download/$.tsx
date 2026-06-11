import { createFileRoute } from "@tanstack/react-router"
import {
  DOWNLOAD_COOKIE_MAX_AGE_SECONDS,
  DOWNLOAD_COOKIE_NAME,
  DOWNLOAD_UNLOCK_QUERY_KEY,
  DOWNLOAD_UNLOCK_QUERY_VALUE,
  buildFallbackSearchUrl,
  decodeEncryptedDownloadValue,
  getToolNameFromPath,
  pickDownloadLandingToolPath,
} from "@/lib/download-redirect"

function buildDownloadCookieHeader(encryptedValue: string): string {
  return `${DOWNLOAD_COOKIE_NAME}=${encodeURIComponent(encryptedValue)}; Max-Age=${DOWNLOAD_COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`
}

function redirectTo(url: string, cookieHeader?: string): Response {
  const headers = new Headers({
    Location: url,
    "Cache-Control": "no-store",
  })

  if (cookieHeader) {
    headers.append("Set-Cookie", cookieHeader)
  }

  return new Response(null, {
    status: 302,
    headers,
  })
}

export const Route = createFileRoute("/api/download/$")({
  server: {
    handlers: {
      GET: ({ request, params }) => {
        const encryptedValue = params._splat?.trim() || ""
        const toolPathSeed = encryptedValue || request.url
        const fallbackToolPath = pickDownloadLandingToolPath(toolPathSeed)
        const fallbackSearchUrl = buildFallbackSearchUrl(
          getToolNameFromPath(fallbackToolPath)
        )

        if (!encryptedValue) {
          return redirectTo(fallbackSearchUrl)
        }

        const decodedUrl = decodeEncryptedDownloadValue(encryptedValue)

        if (!decodedUrl) {
          return redirectTo(fallbackSearchUrl)
        }

        const landingToolPath = pickDownloadLandingToolPath(decodedUrl)
        const landingUrl = new URL(landingToolPath, request.url)
        landingUrl.searchParams.set(
          DOWNLOAD_UNLOCK_QUERY_KEY,
          DOWNLOAD_UNLOCK_QUERY_VALUE
        )

        return redirectTo(
          landingUrl.toString(),
          buildDownloadCookieHeader(encryptedValue)
        )
      },
    },
  },
})
