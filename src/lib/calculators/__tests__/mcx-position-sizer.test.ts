import { describe, expect, it } from "vitest"
import { calculateMcxPosition } from "../mcx-position-sizer"

describe("MCX Position Sizer - Comprehensive Tests", () => {
  it("calculates lot sizes correctly based on risk and margin", () => {
    const result = calculateMcxPosition({
      accountCapital: 1000000, // 10L
      riskPercentage: 2, // 20k max risk
      entryPrice: 6500,
      stopLossPrice: 6450, // 50 points risk
    })

    expect(result.maxRiskAmount).toBe(20000)
    expect(result.pointsRisk).toBe(50)

    // Mega lot: 100 bbl. Risk per lot = 50 * 100 = 5000.
    // Max 4 lots allowed by risk (20000 / 5000).
    // Margin for 1 mega lot at 6500 is approx 1,30,000 (20%).
    // 10L capital allows ~7.6 lots by margin.
    // Final mega lots = min(4, 7) = 4.
    expect(result.megaLotsAllowed).toBe(4)
    expect(result.megaActualRisk).toBe(20000)
    expect(result.megaMarginRequired).toBeGreaterThan(500000)

    // Mini lot: 10 bbl. Risk per lot = 50 * 10 = 500.
    // Max 40 lots allowed by risk (20000 / 500).
    // Margin for 1 mini lot is approx 13,000.
    // 10L capital allows ~76 lots by margin.
    // Final mini lots = min(40, 76) = 40.
    expect(result.miniLotsAllowed).toBe(40)
    expect(result.miniActualRisk).toBe(20000)
  })

  it("handles margin constraint correctly (Small Capital)", () => {
    const result = calculateMcxPosition({
      accountCapital: 50000, // 50k
      riskPercentage: 10, // 5k risk (High risk for small cap)
      entryPrice: 6500,
      stopLossPrice: 6490, // 10 points risk
    })

    // Risk allows 5 Mega lots (10 * 100 * 5 = 5000 risk).
    // BUT margin for 1 Mega lot is ~1.3L. Capital is only 50k.
    expect(result.megaLotsAllowed).toBe(0)
    expect(result.megaMarginSufficient).toBe(false)

    // Margin for 1 Mini lot is ~13k. Capital allows ~3.8 lots.
    // Risk allows 50 Mini lots (10 * 10 * 50 = 5000 risk).
    // Final mini lots = min(50, 3) = 3.
    expect(result.miniLotsAllowed).toBe(3)
  })

  it("handles stop loss being 'above' entry (Short selling scenario)", () => {
    const result = calculateMcxPosition({
      accountCapital: 100000,
      riskPercentage: 2,
      entryPrice: 6500,
      stopLossPrice: 6520, // 20 points risk
    })
    expect(result.pointsRisk).toBe(20)
    expect(result.miniLotsAllowed).toBeGreaterThan(0)
  })

  it("handles edge case: 0 point risk (Same price)", () => {
    const result = calculateMcxPosition({
      accountCapital: 100000,
      riskPercentage: 2,
      entryPrice: 6500,
      stopLossPrice: 6500,
    })
    expect(result.pointsRisk).toBe(0)
    expect(result.megaLotsAllowed).toBe(0)
    expect(result.miniLotsAllowed).toBe(0)
  })

  it("handles very large capital (Institution scale)", () => {
    const result = calculateMcxPosition({
      accountCapital: 100000000, // 10 Cr
      riskPercentage: 1, // 10L risk
      entryPrice: 6500,
      stopLossPrice: 6490, // 10 points
    })
    // 10 pts risk * 100 = ₹1000 per mega lot.
    // 10L risk / 1k = 1000 Mega lots allowed by risk.
    // Margin for 1000 mega lots ≈ 13 Cr.
    // Capital is 10 Cr. Margin allowed ≈ 769 lots.
    // Final ≈ 769.
    expect(result.megaLotsAllowed).toBeGreaterThan(500)
    expect(result.megaLotsAllowed).toBeLessThan(1000)
  })
})
