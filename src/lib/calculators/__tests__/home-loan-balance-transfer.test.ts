import { describe, expect, it } from "vitest"
import { calculateHomeLoanBalanceTransfer } from "../home-loan-balance-transfer"

describe("Home Loan Balance Transfer Calculator", () => {
  it("shows positive net savings when rate drop is meaningful", () => {
    const result = calculateHomeLoanBalanceTransfer({
      outstandingPrincipal: 4000000,
      currentInterestRate: 9.1,
      remainingTenureYears: 15,
      newInterestRate: 8.2,
      processingFeePercent: 0.35,
      processingFeeFlat: 5000,
      otherTransferCosts: 20000,
    })

    expect(result.grossInterestSaved).toBeGreaterThan(0)
    expect(result.netSavings).toBeGreaterThan(0)
    expect(result.recommendation).toBe("recommended")
  })

  it("can become not recommended when transfer cost is high", () => {
    const result = calculateHomeLoanBalanceTransfer({
      outstandingPrincipal: 3000000,
      currentInterestRate: 9,
      remainingTenureYears: 8,
      newInterestRate: 8.7,
      processingFeePercent: 1.5,
      processingFeeFlat: 25000,
      otherTransferCosts: 45000,
    })

    expect(result.netSavings).toBeLessThanOrEqual(0)
    expect(result.recommendation).toBe("not_recommended")
  })

  it("returns zero-like output for zero principal", () => {
    const result = calculateHomeLoanBalanceTransfer({
      outstandingPrincipal: 0,
      currentInterestRate: 9,
      remainingTenureYears: 10,
      newInterestRate: 8,
      processingFeePercent: 0.5,
      processingFeeFlat: 0,
      otherTransferCosts: 0,
    })

    expect(result.currentEmi).toBe(0)
    expect(result.newEmi).toBe(0)
    expect(result.netSavings).toBe(0)
  })
})
