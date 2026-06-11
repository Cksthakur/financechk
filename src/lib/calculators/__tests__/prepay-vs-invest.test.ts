import { describe, expect, it } from "vitest"
import { calculatePrepayVsInvest } from "../prepay-vs-invest"

describe("Prepay vs Invest Calculator - Comprehensive Tests", () => {
  it("shows Investing is better when return rate is high (12% vs 8.5%)", () => {
    const result = calculatePrepayVsInvest({
      outstandingLoan: 5000000,
      remainingTenureYears: 15,
      loanInterestRate: 8.5,
      extraMonthlyAmount: 20000,
      expectedReturnRate: 12,
    })

    expect(result.betterOption).toBe("invest")
    expect(result.netBenefit).toBeGreaterThan(0)
  })

  it("handles large extra payments (Hyper-prepayment)", () => {
    const result = calculatePrepayVsInvest({
      outstandingLoan: 5000000,
      remainingTenureYears: 20,
      loanInterestRate: 9,
      extraMonthlyAmount: 500000,
      expectedReturnRate: 12,
    })

    expect(result.newTenureMonths).toBeLessThan(12)
    expect(result.interestSaved).toBeGreaterThan(4000000)
  })

  it("handles zero loan balance scenario", () => {
    const result = calculatePrepayVsInvest({
      outstandingLoan: 0,
      remainingTenureYears: 10,
      loanInterestRate: 9,
      extraMonthlyAmount: 10000,
      expectedReturnRate: 12,
    })
    expect(result.regularEMI).toBe(0)
    expect(result.betterOption).toBe("invest")
  })
})
