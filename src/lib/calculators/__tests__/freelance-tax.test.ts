import { describe, expect, it } from "vitest"
import { calculateFreelanceTax } from "../freelance-tax"

describe("Freelance Tax Calculator - Comprehensive Tests", () => {
  it("calculates Section 44ADA tax accurately for New Regime (FY 2024-25)", () => {
    // Gross: 30L, Profit: 50% = 15L
    const result = calculateFreelanceTax({
      grossReceipts: 3000000,
      profitPercentage: 50,
      otherIncome: 0,
      financialYear: "FY2024-25",
    })

    expect(result.presumptiveIncome).toBe(1500000)
    expect(result.totalTaxableIncome).toBe(1500000)

    // Tax calculation for 15L (New Regime FY2024-25):
    // 0-3L: Nil
    // 3-7L: 20,000 (5%)
    // 7-10L: 30,000 (10%)
    // 10-12L: 30,000 (15%)
    // 12-15L: 60,000 (20%)
    // Total Tax: 1,40,000
    // Cess: 5,600 (4%)
    // Total Liability: 1,45,600
    expect(result.taxAmount).toBe(140000)
    expect(result.totalTaxLiability).toBe(145600)
    expect(result.isEligibleFor44ADA).toBe(true)
  })

  it("verifies the zero-tax scenario (₹14 Lakh Gross)", () => {
    // Gross: 14L, Profit: 50% = 7L
    const result = calculateFreelanceTax({
      grossReceipts: 1400000,
      profitPercentage: 50,
      otherIncome: 0,
      financialYear: "FY2024-25",
    })

    // Up to 7L, Section 87A rebate wipes out the tax
    expect(result.totalTaxableIncome).toBe(700000)
    expect(result.totalTaxLiability).toBe(0)
  })

  it("handles other income (FD Interest, Rent, etc.)", () => {
    const result = calculateFreelanceTax({
      grossReceipts: 1000000, // 10L Gross
      profitPercentage: 50, // 5L Profit
      otherIncome: 300000, // 3L Other
      financialYear: "FY2024-25",
    })

    // Total taxable = 8L
    expect(result.totalTaxableIncome).toBe(800000)
    expect(result.totalTaxLiability).toBeGreaterThan(0)
  })

  it("applies marginal relief for income slightly above ₹7 Lakhs", () => {
    // Total taxable: 7,05,000
    const result = calculateFreelanceTax({
      grossReceipts: 1410000,
      profitPercentage: 50,
      otherIncome: 0,
      financialYear: "FY2024-25",
    })

    // Income above 7L is 5000.
    // Tax on 7.05L is (4L@5%) + (5k@10%) = 20500.
    // Marginal relief: Tax cannot exceed 5000.
    expect(result.taxAmount).toBe(5000)
  })

  it("flags ineligibility for gross receipts > ₹75 Lakhs", () => {
    const result = calculateFreelanceTax({
      grossReceipts: 8000000,
      profitPercentage: 50,
      otherIncome: 0,
      financialYear: "FY2024-25",
    })
    expect(result.isEligibleFor44ADA).toBe(false)
  })

  it("handles high profit declaration (>50%)", () => {
    const result = calculateFreelanceTax({
      grossReceipts: 2000000,
      profitPercentage: 90, // Declaring 90% as profit
      otherIncome: 0,
      financialYear: "FY2024-25",
    })
    expect(result.presumptiveIncome).toBe(1800000)
  })

  it("prevents declaration below 50% (Logical floor)", () => {
    const result = calculateFreelanceTax({
      grossReceipts: 2000000,
      profitPercentage: 20, // Inputting 20%
      otherIncome: 0,
      financialYear: "FY2024-25",
    })
    // Calculator logic should floor it to 50%
    expect(result.presumptiveIncome).toBe(1000000)
  })

  it("handles zero receipts gracefully", () => {
    const result = calculateFreelanceTax({
      grossReceipts: 0,
      profitPercentage: 50,
      otherIncome: 0,
      financialYear: "FY2024-25",
    })
    expect(result.totalTaxLiability).toBe(0)
    expect(result.effectiveTaxRate).toBe(0)
  })
})
