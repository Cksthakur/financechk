import { useState } from "react"
import { IconCheck, IconLink } from "@tabler/icons-react"

interface ShareResultProps {
  params: Record<string, string | number>
  className?: string
}

export function ShareResult({ params, className = "" }: ShareResultProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // 1. Build the new URL with search params
    const url = new URL(window.location.href)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString())
    })

    // 2. Update the address bar without triggering a reload or router event
    window.history.replaceState({}, "", url.toString())

    // 3. Copy to clipboard
    try {
      await navigator.clipboard.writeText(url.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Failed to copy URL to clipboard", e)
    }
  }

  return (
    <div className={`flex justify-end ${className}`}>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        {copied ? (
          <>
            <IconCheck className="size-3.5 text-fc-gain" />
            <span className="text-fc-gain-text">Link copied!</span>
          </>
        ) : (
          <>
            <IconLink className="size-3.5" />
            <span>Share this result</span>
          </>
        )}
      </button>
    </div>
  )
}
