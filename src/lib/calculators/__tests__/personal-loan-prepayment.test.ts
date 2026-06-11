import { describe, expect, it } from "vitest"
import { calculatePersonalLoanPrepayment } from "../personal-loan-prepayment"

describe("Personal Loan Prepayment Calculator", () => {
  it("reduces tenure and interest with prepayment strategy", () => {
    const result = calculatePersonalLoanPrepayment({
      principalAmount: 800000,
      interestRate: 14,
      tenureYears: 5,
      tenureMonths: 0,
      extraMonthlyPrepayment: 5000,
      oneTimePrepayment: 100000,
      oneTimePrepaymentMonth: 12,
    })

    expect(result.tenureSavedMonths).toBeGreaterThan(0)
    expect(result.interestSaved).toBeGreaterThan(0)
  })

  it("keeps base and prepayment outcomes same when no prepayment provided", () => {
    const result = calculatePersonalLoanPrepayment({
      principalAmount: 500000,
      interestRate: 12,
      tenureYears: 4,
      tenureMonths: 0,
      extraMonthlyPrepayment: 0,
      oneTimePrepayment: 0,
      oneTimePrepaymentMonth: 10,
    })

    expect(result.tenureSavedMonths).toBe(0)
    expect(result.interestSaved).toBe(0)
  })

  it("handles zero principal safely", () => {
    const result = calculatePersonalLoanPrepayment({
      principalAmount: 0,
      interestRate: 14,
      tenureYears: 5,
      tenureMonths: 0,
      extraMonthlyPrepayment: 1000,
      oneTimePrepayment: 10000,
      oneTimePrepaymentMonth: 1,
    })

    expect(result.schedule).toEqual([])
    expect(result.emi).toBe(0)
  })
})
