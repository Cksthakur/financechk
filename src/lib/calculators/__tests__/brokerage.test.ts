import { describe, expect, it } from "vitest"
import { calculateBrokerage } from "../brokerage"

describe("Brokerage Calculator - Comprehensive Tests", () => {
  it("calculates delivery brokerage accurately (0 brokerage, 0.1% STT)", () => {
    const result = calculateBrokerage({
      buyPrice: 1000,
      sellPrice: 1100,
      quantity: 100,
      segment: "delivery",
    })

    expect(result.brokerage).toBe(0)
    // STT: 0.1% on buy & sell = 100 + 110 = 210
    expect(result.stt).toBe(210)
    // Stamp Duty: 0.015% on buy side = 15
    expect(result.stampDuty).toBe(15)

    expect(result.netPnL).toBeGreaterThan(0)
    expect(result.breakevenPoints).toBeGreaterThan(0)
  })

  it("calculates intraday brokerage correctly with Rs 20 cap", () => {
    // Large trade: 1000 * 1000 = 10 Lakhs. 0.03% is 300, should cap at 20.
    const resultLarge = calculateBrokerage({
      buyPrice: 1000,
      sellPrice: 1010,
      quantity: 1000,
      segment: "intraday",
    })

    expect(resultLarge.brokerage).toBe(40) // 20 buy + 20 sell
    // STT: 0.025% on sell side = 1010 * 1000 * 0.00025 = 252.5 -> 253
    expect(resultLarge.stt).toBe(253)
  })

  it("calculates futures brokerage accurately (0.02% STT on sell side)", () => {
    const result = calculateBrokerage({
      buyPrice: 20000,
      sellPrice: 20100,
      quantity: 50, // 1 lot Nifty approx
      segment: "futures",
    })

    expect(result.brokerage).toBe(40) // Capped at 20 per side
    // Sell Turnover = 20100 * 50 = 10,05,000
    // STT = 1005000 * 0.0002 = 201
    expect(result.stt).toBe(201)
  })

  it("calculates options brokerage accurately (0.1% STT on sell side premium)", () => {
    const result = calculateBrokerage({
      buyPrice: 100,
      sellPrice: 120,
      quantity: 500,
      segment: "options",
    })

    expect(result.brokerage).toBe(40) // Flat 20 each side
    // Sell Turnover (Premium) = 120 * 500 = 60,000
    // STT = 60000 * 0.001 = 60
    expect(result.stt).toBe(60)

    // Exchange txn charge for options is high (0.03503%)
    // Total turnover = (100+120)*500 = 1,10,000. 1.1L * 0.0003503 = 38.53
    expect(result.exchangeTxnCharge).toBe(38.53)
  })

  it("handles break-even calculation correctly", () => {
    const result = calculateBrokerage({
      buyPrice: 100,
      sellPrice: 100, // No price move
      quantity: 1000,
      segment: "intraday",
    })

    // Charges will be: 40 (brokerage) + 25 (stt) + 5.94 (exchange) + 8.28 (gst) + 0.2 (sebi) + 3 (stamp) ≈ 82.42
    // Breakeven ≈ 82.42 / 1000 = 0.08
    expect(result.breakevenPoints).toBeGreaterThan(0.05)
    expect(result.netPnL).toBeLessThan(0) // Should be negative due to charges
  })

  it("handles edge case: 0 quantity", () => {
    const result = calculateBrokerage({
      buyPrice: 100,
      sellPrice: 150,
      quantity: 0,
      segment: "delivery",
    })
    expect(result.turnover).toBe(0)
    expect(result.netPnL).toBe(0)
    expect(result.breakevenPoints).toBe(0)
  })

  it("handles very large turnover (HNI/Institutional scale)", () => {
    const result = calculateBrokerage({
      buyPrice: 1000,
      sellPrice: 1100,
      quantity: 100000, // 1 Lakh shares
      segment: "delivery",
    })
    // Turnover = 21 Crores
    expect(result.turnover).toBe(210000000)
    expect(result.stt).toBe(210000) // 0.1% of 21Cr is 2.1L
  })
})
