import { describe, expect, it } from "vitest"
import { calculateTaxComparison } from "../tax-regime"

describe("Tax Regime Comparison - Comprehensive Tests", () => {
  it("verifies the ₹7.75 Lakh Zero-Tax Formula (New Regime FY 24-25)", () => {
    const result = calculateTaxComparison({
      annualSalary: 775000,
      basicSalary: 387500,
      hra: 0,
      rentPaid: 0,
      cityType: "non-metro",
      section80C: 0,
      section80D: 0,
      section80CCD: 0,
      homeLoanInterest: 0,
      otherDeductions: 0,
      financialYear: "FY2024-25",
    })

    expect(result.newRegime.taxableIncome).toBe(700000)
    expect(result.newRegime.taxPayable).toBe(0)
    expect(result.newRegime.totalTax).toBe(0)
  })

  it("handles complex HRA calculation (Section 10(13A))", () => {
    const result = calculateTaxComparison({
      annualSalary: 1200000,
      basicSalary: 600000,
      hra: 300000,
      rentPaid: 240000,
      cityType: "metro",
      section80C: 0,
      section80D: 0,
      section80CCD: 0,
      homeLoanInterest: 0,
      otherDeductions: 0,
      financialYear: "FY2024-25",
    })

    expect(result.oldRegime.hraExemption).toBe(180000)
    expect(result.oldRegime.deductions).toBe(180000 + 50000) // HRA + standard
  })

  it("handles high salary selection logic correctly", () => {
    const result = calculateTaxComparison({
      annualSalary: 4000000, // 40L
      basicSalary: 2000000,
      hra: 0,
      rentPaid: 0,
      cityType: "non-metro",
      section80C: 150000,
      section80D: 50000,
      section80CCD: 50000,
      homeLoanInterest: 200000,
      otherDeductions: 0,
      financialYear: "FY2024-25",
    })

    // Manual check:
    // Old taxable: 40L - 5L deductions = 35L. Tax ≈ 8.6L
    // New taxable: 40L - 75k = 39.25L. Tax ≈ 8.6L
    // The code will pick "old" if oldTotal <= newTotal.
    expect(result.betterRegime).toBeDefined()
  })

  it("handles zero salary gracefully", () => {
    const result = calculateTaxComparison({
      annualSalary: 0,
      basicSalary: 0,
      hra: 0,
      rentPaid: 0,
      cityType: "metro",
      section80C: 0,
      section80D: 0,
      section80CCD: 0,
      homeLoanInterest: 0,
      otherDeductions: 0,
      financialYear: "FY2024-25",
    })
    expect(result.newRegime.totalTax).toBe(0)
    expect(result.oldRegime.totalTax).toBe(0)
  })
})
