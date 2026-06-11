import { describe, expect, it } from "vitest"
import { calculateMcxCommodityMargin } from "../mcx-commodity-margin"

describe("MCX Commodity Margin Calculator", () => {
  it("calculates margin and charges with realized P&L", () => {
    const result = calculateMcxCommodityMargin({
      commodity: "crudeoilm",
      lots: 2,
      lotSize: 10,
      tickValuePerLot: 10,
      entryPrice: 6500,
      exitPrice: 6550,
      tradeType: "intraday",
      spanMarginPercent: 8,
      exposureMarginPercent: 5,
      brokeragePerOrder: 20,
      otherCharges: 25,
    })

    expect(result.contractValue).toBe(130000)
    expect(result.totalMarginRequired).toBe(16900)
    expect(result.realizedPnl).toBe(1000)
    expect(result.totalCharges).toBeGreaterThan(0)
  })

  it("handles no-exit scenario", () => {
    const result = calculateMcxCommodityMargin({
      commodity: "gold-mini",
      lots: 1,
      lotSize: 100,
      tickValuePerLot: 100,
      entryPrice: 7200,
      tradeType: "overnight",
      spanMarginPercent: 10,
      exposureMarginPercent: 5,
      brokeragePerOrder: 20,
      otherCharges: 0,
    })

    expect(result.realizedPnl).toBeNull()
    expect(result.netPnlAfterCharges).toBeNull()
    expect(result.totalMarginRequired).toBeGreaterThan(0)
  })
})
