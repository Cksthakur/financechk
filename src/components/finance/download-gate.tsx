import { useEffect, useMemo, useState } from "react"
import { useLocation } from "@tanstack/react-router"
import {
  DOWNLOAD_COOKIE_NAME,
  DOWNLOAD_UNLOCK_QUERY_KEY,
  DOWNLOAD_UNLOCK_QUERY_VALUE,
  DOWNLOAD_WAIT_SECONDS,
  buildFallbackSearchUrl,
  decodeEncryptedDownloadValue,
  getCookieValue,
  getToolNameFromPath,
} from "@/lib/download-redirect"
import { AdUnit } from "@/components/finance/ad-unit"

const TIMER_INTERVAL_MS = 1000

type GateStage = "ready" | "countdown" | "scroll"

interface DownloadGateProps {
  children: React.ReactNode
}

function readDownloadCookie(): string | null {
  if (typeof document === "undefined") {
    return null
  }

  return getCookieValue(document.cookie, DOWNLOAD_COOKIE_NAME)
}

function parseEncryptedCookieValue(rawCookieValue: string): string | null {
  try {
    return decodeURIComponent(rawCookieValue)
  } catch {
    return rawCookieValue
  }
}

export function DownloadGate({ children }: DownloadGateProps) {
  const { pathname, href } = useLocation()

  const [stage, setStage] = useState<GateStage>("ready")
  const [remainingSeconds, setRemainingSeconds] = useState(
    DOWNLOAD_WAIT_SECONDS
  )
  const [decodedDownloadUrl, setDecodedDownloadUrl] = useState<string | null>(
    null
  )

  const unlockEnabled = useMemo(() => {
    if (typeof window === "undefined") {
      return false
    }

    const params = new URLSearchParams(window.location.search)
    return params.get(DOWNLOAD_UNLOCK_QUERY_KEY) === DOWNLOAD_UNLOCK_QUERY_VALUE
  }, [href, pathname])

  const fallbackSearchUrl = useMemo(
    () => buildFallbackSearchUrl(getToolNameFromPath(pathname)),
    [pathname]
  )

  useEffect(() => {
    if (!unlockEnabled) {
      setStage("ready")
      setRemainingSeconds(DOWNLOAD_WAIT_SECONDS)
      setDecodedDownloadUrl(null)
      return
    }

    const encryptedCookieValue = readDownloadCookie()

    if (!encryptedCookieValue) {
      window.location.replace(fallbackSearchUrl)
      setDecodedDownloadUrl(null)
      return
    }

    const encryptedValue = parseEncryptedCookieValue(encryptedCookieValue)

    if (!encryptedValue) {
      window.location.replace(fallbackSearchUrl)
      setDecodedDownloadUrl(null)
      return
    }

    const decoded = decodeEncryptedDownloadValue(encryptedValue)

    if (!decoded) {
      window.location.replace(fallbackSearchUrl)
      setDecodedDownloadUrl(null)
      return
    }

    setDecodedDownloadUrl(decoded)
  }, [fallbackSearchUrl, unlockEnabled])

  useEffect(() => {
    if (stage !== "countdown") {
      return
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(interval)
          setStage("scroll")
          return 0
        }

        return previous - 1
      })
    }, TIMER_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [stage])

  const handleContinue = () => {
    if (stage !== "ready") {
      return
    }

    setRemainingSeconds(DOWNLOAD_WAIT_SECONDS)
    setStage("countdown")
  }

  const handleDownload = () => {
    const encryptedCookieValue = readDownloadCookie()

    if (!encryptedCookieValue) {
      window.location.href = fallbackSearchUrl
      return
    }

    const encryptedValue = parseEncryptedCookieValue(encryptedCookieValue)
    if (!encryptedValue) {
      window.location.href = fallbackSearchUrl
      return
    }

    const decoded = decodeEncryptedDownloadValue(encryptedValue)

    if (!decoded) {
      window.location.href = fallbackSearchUrl
      return
    }

    window.open(decoded, "_blank", "noopener,noreferrer")
  }

  if (!unlockEnabled || !decodedDownloadUrl) {
    return <>{children}</>
  }

  let topButtonLabel = "Click here to Continue"
  if (stage === "countdown") {
    topButtonLabel = `Please wait ${remainingSeconds}s`
  } else if (stage === "scroll") {
    topButtonLabel = "Scroll at the bottom"
  }

  return (
    <>
      <div className="mb-4 overflow-hidden rounded-xl border border-border">
        <AdUnit slot="rectangle" />
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-secondary/40">
        <button
          type="button"
          onClick={handleContinue}
          disabled={stage !== "ready"}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-75"
        >
          {topButtonLabel}
        </button>
      </div>

      {children}

      <div className="mt-12 overflow-hidden rounded-xl border border-border">
        <AdUnit slot="rectangle" />
      </div>
      <div
        className="mt-4 overflow-hidden"
        id="download-now"
      >
        <p className="px-4 pt-4 pb-2 text-center text-sm font-medium text-emerald-800 md:text-base">
          Your secure link is ready once the timer completes.
        </p>
        <button
          type="button"
          onClick={handleDownload}
          disabled={stage !== "scroll"}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download Now
        </button>
      </div>
    </>
  )
}
