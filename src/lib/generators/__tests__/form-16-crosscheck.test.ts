import { describe, expect, it } from "vitest"
import { generateForm16Crosscheck } from "../form-16-crosscheck"

describe("Form 16 crosscheck generator", () => {
  it("calculates difference between estimated tax and form16 tds", () => {
    const result = generateForm16Crosscheck({
      employeeName: "Rajat Das",
      pan: "abcde1234f",
      employerName: "FinanceChk Labs",
      financialYear: "2026-27",
      regime: "new",
      grossSalaryAsPerForm16: 1800000,
      taxableIncomeAsPerForm16: 1600000,
      tdsDeductedAsPerForm16: 170000,
      section80cClaimed: 150000,
      section80dClaimed: 25000,
      npsClaimed: 50000,
      homeLoanInterestClaimed: 180000,
      otherDeductionsClaimed: 0,
    })

    expect(result.estimatedTax.totalTax).toBeGreaterThan(0)
    expect(result.summary).toContain("Difference")
    expect(result.payrollFollowUpQuestions.length).toBe(5)
  })
})
