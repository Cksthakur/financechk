import { Suspense, lazy, useEffect, useMemo, useState } from "react"
import { formatCompactCurrency } from "@/lib/format"

// Lazy load Recharts components to reduce initial bundle size (heavy library)
const ResponsiveContainer = lazy(() =>
  import("recharts").then((m) => ({ default: m.ResponsiveContainer }))
)
const AreaChart = lazy(() =>
  import("recharts").then((m) => ({ default: m.AreaChart }))
)
const Area = lazy(() => import("recharts").then((m) => ({ default: m.Area })))
const XAxis = lazy(() => import("recharts").then((m) => ({ default: m.XAxis })))
const YAxis = lazy(() => import("recharts").then((m) => ({ default: m.YAxis })))
const CartesianGrid = lazy(() =>
  import("recharts").then((m) => ({ default: m.CartesianGrid }))
)
const Tooltip = lazy(() =>
  import("recharts").then((m) => ({ default: m.Tooltip }))
)

interface PayoffChartProps {
  data: Array<{
    year: number
    baseAmount: number
    growthAmount: number
  }>
  baseLabel?: string
  growthLabel?: string
}

export function PayoffChart({
  data,
  baseLabel = "Principal",
  growthLabel = "Interest",
}: PayoffChartProps) {
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

  const chartData = useMemo(() => {
    return data.map((d) => ({
      year: `Year ${d.year}`,
      [baseLabel]: Math.round(d.baseAmount),
      [growthLabel]: Math.round(d.growthAmount),
    }))
  }, [data, baseLabel, growthLabel])

  if (!mounted) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-secondary/50">
        <p className="text-sm text-muted-foreground">Loading chart…</p>
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <Suspense
        fallback={
          <div className="flex h-64 w-full items-center justify-center rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground">
              Loading visualization…
            </p>
          </div>
        }
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={256}
          initialDimension={{ width: 400, height: 256 }}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--fc-gain)"
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor="var(--fc-gain)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--fc-amber)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--fc-amber)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(0,0,0,0.05)"
            />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              minTickGap={30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(value) => formatCompactCurrency(value)}
              width={60}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-background p-3 shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]">
                      <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                        {label}
                      </p>
                      <div className="flex flex-col gap-1">
                        {payload.map((entry) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <div
                                className="size-2.5 rounded-sm"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name}
                            </div>
                            <span className="font-mono text-sm font-semibold text-foreground">
                              {formatCompactCurrency(entry.value as number)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey={baseLabel}
              stackId="1"
              stroke="var(--fc-gain)"
              fill="url(#colorBase)"
              isAnimationActive={!prefersReducedMotion}
            />
            <Area
              type="monotone"
              dataKey={growthLabel}
              stackId="1"
              stroke="var(--fc-amber)"
              fill="url(#colorGrowth)"
              isAnimationActive={!prefersReducedMotion}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Suspense>
    </div>
  )
}
