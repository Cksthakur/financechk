import { describe, expect, it } from "vitest"
import { calculatePersonalLoanBalanceTransfer } from "../personal-loan-balance-transfer"

describe("Personal Loan Balance Transfer Calculator", () => {
  it("shows positive savings when new rate is lower and fees are reasonable", () => {
    const result = calculatePersonalLoanBalanceTransfer({
      outstandingPrincipal: 700000,
      currentInterestRate: 17,
      remainingTenureMonths: 36,
      newInterestRate: 12,
      newTenureMonths: 36,
      processingFeePercent: 1,
      foreclosureChargePercent: 1,
      otherCharges: 1500,
    })

    expect(result.netSavings).toBeGreaterThan(0)
  })

  it("can show negative savings when new tenure is extended significantly", () => {
    const result = calculatePersonalLoanBalanceTransfer({
      outstandingPrincipal: 500000,
      currentInterestRate: 15,
      remainingTenureMonths: 24,
      newInterestRate: 13,
      newTenureMonths: 60,
      processingFeePercent: 2,
      foreclosureChargePercent: 2,
      otherCharges: 3000,
    })

    expect(result.netSavings).toBeLessThan(0)
  })

  it("returns zeroed output for zero principal", () => {
    const result = calculatePersonalLoanBalanceTransfer({
      outstandingPrincipal: 0,
      currentInterestRate: 14,
      remainingTenureMonths: 24,
      newInterestRate: 12,
      newTenureMonths: 24,
      processingFeePercent: 1,
      foreclosureChargePercent: 1,
      otherCharges: 0,
    })

    expect(result.currentEmi).toBe(0)
    expect(result.newEmi).toBe(0)
    expect(result.netSavings).toBe(0)
  })
})
