import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { formatCurrency } from "@/lib/format"

interface AmortizationTableRow {
  month: number
  year: number
  principal: number
  interest: number
  balance: number
}

interface AmortizationTableProps {
  schedule: Array<AmortizationTableRow>
}

export function AmortizationTable({ schedule }: AmortizationTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: schedule.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  })

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_1px_2px]">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          Amortization Schedule
        </h3>
        <p className="text-xs text-muted-foreground">
          Scroll to view all {schedule.length} months
        </p>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-2 border-b border-border bg-secondary/50 px-5 py-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        <div>Month</div>
        <div className="text-right">Principal</div>
        <div className="text-right">Interest</div>
        <div className="text-right">Balance</div>
      </div>

      {/* Virtualized Body */}
      <div
        ref={parentRef}
        className="max-h-100 overflow-auto overflow-x-hidden"
      >
        <div
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = schedule[virtualRow.index]
            return (
              <div
                key={virtualRow.index}
                className={`absolute top-0 left-0 grid w-full grid-cols-4 gap-2 px-5 py-3 text-sm transition-colors hover:bg-muted/50 ${
                  virtualRow.index % 2 !== 0 ? "bg-secondary/20" : ""
                }`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="text-muted-foreground">
                  <span className="font-mono">{row.month}</span>
                  <span className="ml-2 text-xs text-muted-foreground/60">
                    (Yr {row.year})
                  </span>
                </div>
                <div className="text-right font-mono text-foreground">
                  {formatCurrency(Math.round(row.principal))}
                </div>
                <div className="text-right font-mono text-fc-amber">
                  {formatCurrency(Math.round(row.interest))}
                </div>
                <div className="text-right font-mono font-medium text-foreground">
                  {formatCurrency(Math.round(row.balance))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
