import { describe, expect, it } from "vitest"
import { calculateEmergencyFund } from "../emergency-fund"

describe("Emergency Fund Calculator", () => {
  it("recommends higher cover for freelancer with dependants", () => {
    const result = calculateEmergencyFund({
      monthlyEssentialExpenses: 60000,
      employmentType: "freelancer",
      dependants: 2,
      jobStability: "low",
      hasHealthInsurance: false,
      hasLifeInsurance: false,
      targetBuildMonths: 18,
      taxRatePercent: 30,
    })

    expect(result.recommendedMonths).toBeGreaterThanOrEqual(10)
    expect(result.targetAmount).toBe(result.recommendedMonths * 60000)
    expect(result.monthlySavingsRequired).toBeGreaterThan(0)
  })

  it("keeps recommendation moderate for stable salaried profile", () => {
    const result = calculateEmergencyFund({
      monthlyEssentialExpenses: 40000,
      employmentType: "salaried",
      dependants: 0,
      jobStability: "high",
      hasHealthInsurance: true,
      hasLifeInsurance: true,
      targetBuildMonths: 12,
      taxRatePercent: 20,
    })

    expect(result.recommendedMonths).toBeGreaterThanOrEqual(3)
    expect(result.recommendedMonths).toBeLessThanOrEqual(6)
  })

  it("provides parking options with post-tax return", () => {
    const result = calculateEmergencyFund({
      monthlyEssentialExpenses: 25000,
      employmentType: "salaried",
      dependants: 1,
      jobStability: "medium",
      hasHealthInsurance: true,
      hasLifeInsurance: true,
      targetBuildMonths: 10,
      taxRatePercent: 10,
    })

    expect(result.parkingOptions.length).toBe(3)
    expect(result.parkingOptions[0]?.expectedPostTaxReturn).toBeLessThan(
      result.parkingOptions[2]?.expectedPreTaxReturn ?? 100
    )
  })
})
