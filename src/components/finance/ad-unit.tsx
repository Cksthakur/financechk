import { useEffect, useRef, useState } from "react"

type AdSlot = "leaderboard" | "rectangle" | "mid-sticky"

const adConfig: Record<AdSlot, { slotId: string; minHeight: number }> = {
  leaderboard: { slotId: "3259240965", minHeight: 90 },
  rectangle: { slotId: "1420516543", minHeight: 250 },
  "mid-sticky": { slotId: "3095172479", minHeight: 600 },
}

interface AdUnitProps {
  slot: AdSlot
  className?: string
}

export function AdUnit({ slot, className = "" }: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)
  const { slotId, minHeight } = adConfig[slot]

  const isDev = import.meta.env.DEV

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible && !isDev && !adLoaded) {
      try {
        // @ts-ignore - Google AdSense injection
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setAdLoaded(true)
      } catch (e) {
        console.error("AdSense error", e)
      }
    }
  }, [isVisible, isDev, adLoaded])

  return (
    <div
      ref={ref}
      className={`flex items-stretch justify-center overflow-hidden bg-secondary ${className}`}
      style={{ minHeight, width: "100%" }}
      aria-hidden="true"
    >
      {isVisible ? (
        isDev ? (
          <div className="flex size-full w-full flex-1 items-center justify-center border border-dashed border-muted-foreground/20">
            <p className="font-mono text-xs text-muted-foreground/40">
              Ad: {slot}
            </p>
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client="ca-pub-3851765751027929"
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )
      ) : null}
    </div>
  )
}
