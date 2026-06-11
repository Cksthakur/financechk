import { describe, expect, it } from "vitest"
import { calculateSection87aMarginalRelief } from "../section-87a-marginal-relief"

describe("Section 87A Marginal Relief Calculator", () => {
  it("gives full rebate under threshold in new regime", () => {
    const result = calculateSection87aMarginalRelief({
      grossTotalIncome: 1200000,
      specialRateIncome: 0,
      taxRegime: "new",
    })

    expect(result.rebateAmount).toBeGreaterThan(0)
    expect(result.finalTaxPayable).toBe(0)
  })

  it("applies relief near threshold crossing", () => {
    const result = calculateSection87aMarginalRelief({
      grossTotalIncome: 1200500,
      specialRateIncome: 0,
      taxRegime: "new",
    })

    expect(result.marginalReliefAmount).toBeGreaterThanOrEqual(0)
    expect(result.taxAfterRelief).toBeLessThanOrEqual(500)
  })

  it("does not rebate special-rate tax portion", () => {
    const result = calculateSection87aMarginalRelief({
      grossTotalIncome: 1200000,
      specialRateIncome: 100000,
      taxRegime: "new",
    })

    expect(result.specialRateTax).toBe(20000)
    expect(result.finalTaxPayable).toBeGreaterThan(0)
  })
})
