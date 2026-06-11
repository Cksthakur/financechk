import { describe, expect, it } from "vitest"
import { generateSalaryHikeTaxImpact } from "../salary-hike-tax-impact"

describe("Salary hike tax impact generator", () => {
  it("returns projected salary and monthly net increase", () => {
    const result = generateSalaryHikeTaxImpact({
      currentAnnualSalary: 1500000,
      hikePercent: 10,
      bonus: 100000,
      oldRegimeDeductions: 200000,
      oldRegimeHomeLoanInterest: 150000,
      preferredRegime: "new",
    })

    expect(result.projectedGrossAnnual).toBe(1750000)
    expect(result.incrementalGross).toBe(250000)
    expect(result.actionPlan90Days.length).toBe(5)
  })
})
