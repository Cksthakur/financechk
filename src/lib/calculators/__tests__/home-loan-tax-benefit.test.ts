import { describe, expect, it } from "vitest"
import { calculateHomeLoanTaxBenefit } from "../home-loan-tax-benefit"

describe("Home Loan Tax Benefit Calculator", () => {
  it("applies old-regime caps for Section 24(b) and 80C", () => {
    const result = calculateHomeLoanTaxBenefit({
      annualInterestPaid: 260000,
      annualPrincipalPaid: 120000,
      section80cUsedElsewhere: 60000,
      annualGrossIncome: 1800000,
      taxRegime: "old",
    })

    expect(result.deductibleInterest).toBe(200000)
    expect(result.deductiblePrincipal).toBe(90000)
    expect(result.totalDeduction).toBe(290000)
  })

  it("returns no home-loan deduction in new-regime mode", () => {
    const result = calculateHomeLoanTaxBenefit({
      annualInterestPaid: 180000,
      annualPrincipalPaid: 100000,
      section80cUsedElsewhere: 0,
      annualGrossIncome: 1200000,
      taxRegime: "new",
    })

    expect(result.totalDeduction).toBe(0)
    expect(result.estimatedTaxSaved).toBe(0)
  })

  it("limits principal deduction when 80C bucket is fully used", () => {
    const result = calculateHomeLoanTaxBenefit({
      annualInterestPaid: 100000,
      annualPrincipalPaid: 100000,
      section80cUsedElsewhere: 150000,
      annualGrossIncome: 900000,
      taxRegime: "old",
    })

    expect(result.deductiblePrincipal).toBe(0)
  })
})
