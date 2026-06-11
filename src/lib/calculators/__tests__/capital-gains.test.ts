import { describe, expect, it } from "vitest"
import { calculateCapitalGains } from "../capital-gains"

describe("Capital Gains Calculator - Comprehensive Tests", () => {
  it("calculates Equity LTCG with ₹1.25L exemption (Post Budget 2024)", () => {
    // Buy 10L, Sell 15L -> 5L profit
    const result = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 1500,
      quantity: 1000,
      holdingPeriodMonths: 24, // > 12 months
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })

    expect(result.gainType).toBe("LTCG")
    expect(result.grossGain).toBe(500000)
    // Exemption limit: ₹1.25L
    // Taxable amount: 5L - 1.25L = 3.75L
    expect(result.taxableAmount).toBe(375000)
    // Rate: 12.5%
    // Tax: 3,75,000 * 0.125 = 46,875
    expect(result.taxAmount).toBe(46875)
    // Cess: 4% of 46,875 = 1,875
    expect(result.cess).toBe(1875)
    expect(result.totalTaxLiability).toBe(48750)
  })

  it("calculates Equity STCG at 20% (Post Budget 2024)", () => {
    const result = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 1200,
      quantity: 500, // 1L profit
      holdingPeriodMonths: 6, // < 12 months
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })

    expect(result.gainType).toBe("STCG")
    expect(result.taxAmount).toBe(20000) // 20% of 1L
  })

  it("calculates Real Estate LTCG at 12.5% without indexation", () => {
    // Buy 50L, Sell 80L -> 30L profit
    const result = calculateCapitalGains({
      assetClass: "real-estate",
      buyPrice: 5000000,
      sellPrice: 8000000,
      quantity: 1,
      holdingPeriodMonths: 36, // > 24 months
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })

    expect(result.gainType).toBe("LTCG")
    // Budget 2024: Flat 12.5% on real estate profit
    expect(result.taxAmount).toBe(375000) // 30L * 0.125
  })

  it("calculates Gold LTCG at 12.5% without indexation", () => {
    const result = calculateCapitalGains({
      assetClass: "gold",
      buyPrice: 5000,
      sellPrice: 7000,
      quantity: 100, // 2L profit
      holdingPeriodMonths: 30, // > 24 months
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })

    expect(result.gainType).toBe("LTCG")
    expect(result.taxAmount).toBe(25000) // 2L * 0.125
  })

  it("calculates Debt Mutual Fund tax at slab rate (regardless of tenure)", () => {
    const result = calculateCapitalGains({
      assetClass: "debt",
      buyPrice: 100,
      sellPrice: 110,
      quantity: 1000, // 10k profit
      holdingPeriodMonths: 48, // 4 years
      taxSlabPercentage: 30, // 30% bracket
      financialYear: "FY2024-25",
    })

    expect(result.gainType).toBe("STCG") // Treated as short term per 2023 rules
    expect(result.taxAmount).toBe(3000) // 30% of 10k
  })

  it("handles capital losses without charging any tax", () => {
    const result = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 800, // Loss
      quantity: 100,
      holdingPeriodMonths: 24,
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })

    expect(result.grossGain).toBe(-20000)
    expect(result.totalTaxLiability).toBe(0)
    expect(result.netProfitAfterTax).toBe(-20000)
  })

  it("handles edge case: profit below exemption limit (Equity LTCG)", () => {
    const result = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 1100,
      quantity: 500, // 50k profit
      holdingPeriodMonths: 24,
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })

    // 50k < 1.25L exemption limit
    expect(result.taxableAmount).toBe(0)
    expect(result.totalTaxLiability).toBe(0)
  })

  it("handles zero quantity or same price", () => {
    const resZero = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 1500,
      quantity: 0,
      holdingPeriodMonths: 24,
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })
    expect(resZero.grossGain).toBe(0)

    const resSame = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 1000,
      quantity: 100,
      holdingPeriodMonths: 24,
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })
    expect(resSame.grossGain).toBe(0)
  })

  it("handles exactly at exemption boundary", () => {
    const result = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 1250,
      quantity: 1000, // 2.5L profit - exactly 2x exemption
      holdingPeriodMonths: 24,
      taxSlabPercentage: 30,
      financialYear: "FY2024-25",
    })
    expect(result.taxableAmount).toBe(125000) // 2.5L - 1.25L
  })

  it("verifies LTCG uses flat 12.5% rate regardless of income slab", () => {
    // LTCG has flat 12.5% rate, not based on income tax slab
    const result = calculateCapitalGains({
      assetClass: "equity",
      buyPrice: 1000,
      sellPrice: 1500,
      quantity: 1000,
      holdingPeriodMonths: 24,
      taxSlabPercentage: 30, // Should be ignored for LTCG
      financialYear: "FY2024-25",
    })
    // Taxable: 5L - 1.25L = 3.75L
    // 12.5% of 3.75L = 46,875
    expect(result.taxAmount).toBe(46875)
  })
})
