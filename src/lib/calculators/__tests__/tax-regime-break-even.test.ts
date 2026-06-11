import { describe, expect, it } from "vitest"
import { calculateTaxRegimeBreakEven } from "../tax-regime-break-even"

describe("Tax Regime Break-Even Calculator", () => {
  it("returns a section 80C break-even value in range", () => {
    const result = calculateTaxRegimeBreakEven({
      annualSalary: 1800000,
      basicSalary: 900000,
      hra: 300000,
      rentPaid: 360000,
      cityType: "metro",
      section80D: 25000,
      section80CCD: 50000,
      homeLoanInterest: 200000,
      otherDeductions: 0,
      financialYear: "FY2025-26",
    })

    expect(result.breakEvenSection80C).toBeGreaterThanOrEqual(0)
    expect(result.breakEvenSection80C).toBeLessThanOrEqual(150000)
  })

  it("shows old regime tax reduces as 80C moves to break-even", () => {
    const result = calculateTaxRegimeBreakEven({
      annualSalary: 1200000,
      basicSalary: 600000,
      hra: 180000,
      rentPaid: 240000,
      cityType: "non-metro",
      section80D: 0,
      section80CCD: 0,
      homeLoanInterest: 0,
      otherDeductions: 0,
      financialYear: "FY2025-26",
    })

    expect(result.oldTaxAtBreakEven).toBeLessThanOrEqual(
      result.taxIfSection80CZeroOld
    )
  })
})
