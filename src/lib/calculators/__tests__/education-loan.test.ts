import { describe, expect, it } from "vitest"
import { calculateEducationLoan } from "../education-loan"

describe("Education Loan Calculator", () => {
  it("accrues moratorium interest and computes EMI", () => {
    const result = calculateEducationLoan({
      loanAmount: 1500000,
      annualInterestRate: 10,
      moratoriumMonths: 24,
      repaymentTenureYears: 10,
      annualIncome: 1200000,
      taxRegime: "old",
    })

    expect(result.principalAtRepaymentStart).toBeGreaterThan(1500000)
    expect(result.emi).toBeGreaterThan(0)
    expect(result.totalInterestPaid).toBeGreaterThan(0)
    expect(result.schedule.length).toBe(10)
  })

  it("limits 80E deduction to first 8 years", () => {
    const result = calculateEducationLoan({
      loanAmount: 800000,
      annualInterestRate: 9,
      moratoriumMonths: 12,
      repaymentTenureYears: 12,
      annualIncome: 1800000,
      taxRegime: "old",
    })

    expect(result.schedule[7]?.section80eEligibleInterest).toBeGreaterThan(0)
    expect(result.schedule[8]?.section80eEligibleInterest).toBe(0)
  })

  it("returns zero tax saved in new regime mode", () => {
    const result = calculateEducationLoan({
      loanAmount: 1000000,
      annualInterestRate: 11,
      moratoriumMonths: 6,
      repaymentTenureYears: 8,
      annualIncome: 900000,
      taxRegime: "new",
    })

    expect(result.totalTaxSaved).toBe(0)
  })
})
