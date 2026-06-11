import { describe, expect, it } from "vitest"
import { calculateBrokerageComparison } from "../brokerage-comparison"

describe("Brokerage Comparison - Comprehensive Tests", () => {
  it("compares Equity Delivery correctly (₹0 vs % based)", () => {
    const result = calculateBrokerageComparison({
      segment: "delivery",
      tradesPerMonth: 10,
      avgTradeValue: 200000, // 2 Lakhs
    })

    // Discount: ₹0 per trade
    expect(result.discountBrokerMonthly).toBe(0)
    expect(result.discountBrokerYearly).toBe(0)

    // Full Service: 0.55% of 2L = ₹1100 per leg. Buy + Sell = ₹2200 per trade.
    // ₹2200 * 10 trades = ₹22,000 per month.
    expect(result.fullServiceMonthly).toBe(22000)
    expect(result.fullServiceYearly).toBe(264000)

    expect(result.yearlySavings).toBe(264000)
    // 10-year compounding @ 12% on 2.64L/year is huge
    expect(result.opportunityCost10Years).toBeGreaterThan(4500000)
  })

  it("compares Intraday correctly with ₹20 cap (₹40 vs % based)", () => {
    const result = calculateBrokerageComparison({
      segment: "intraday",
      tradesPerMonth: 100, // Heavy trader
      avgTradeValue: 500000, // 5 Lakhs
    })

    // Discount: 0.03% of 5L = ₹150. Caps at ₹20. Total ₹40 per trade.
    // ₹40 * 100 trades = ₹4,000 per month.
    expect(result.discountBrokerMonthly).toBe(4000)

    // Full Service: 0.05% of 5L = ₹250 per leg. Total ₹500 per trade.
    // ₹500 * 100 trades = ₹50,000 per month.
    expect(result.fullServiceMonthly).toBe(50000)

    expect(result.yearlySavings).toBe((50000 - 4000) * 12)
  })

  it("compares Options correctly (Flat ₹20 vs Flat ₹50)", () => {
    const result = calculateBrokerageComparison({
      segment: "options",
      tradesPerMonth: 40,
      avgTradeValue: 10000, // turnover doesn't matter for options flat rate
    })

    // Discount: ₹20 * 2 (per trade) * 40 = ₹1600/mo
    expect(result.discountBrokerMonthly).toBe(1600)
    // Full Service: ₹50 * 2 (per trade) * 40 = ₹4000/mo
    expect(result.fullServiceMonthly).toBe(4000)
  })

  it("handles low volume traders correctly", () => {
    const result = calculateBrokerageComparison({
      segment: "delivery",
      tradesPerMonth: 1,
      avgTradeValue: 10000,
    })
    // Savings should still be calculated
    expect(result.yearlySavings).toBeGreaterThan(0)
  })

  it("handles edge case: 0 trades", () => {
    const result = calculateBrokerageComparison({
      segment: "intraday",
      tradesPerMonth: 0,
      avgTradeValue: 100000,
    })
    expect(result.discountBrokerMonthly).toBe(0)
    expect(result.fullServiceMonthly).toBe(0)
    expect(result.yearlySavings).toBe(0)
    expect(result.opportunityCost10Years).toBe(0)
  })
})
