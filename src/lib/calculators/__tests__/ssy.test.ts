import { describe, expect, it } from "vitest"
import { calculateSsy } from "../ssy"

describe("SSY Calculator", () => {
  it("projects maturity with 15-year contribution window", () => {
    const result = calculateSsy({
      daughterAgeYears: 1,
      annualDeposit: 150000,
      annualInterestRate: 8.2,
      taxRatePercent: 20,
    })

    expect(result.depositYears).toBe(15)
    expect(result.maturityYearsRemaining).toBe(20)
    expect(result.totalDeposits).toBe(2250000)
    expect(result.maturityAmount).toBeGreaterThan(result.totalDeposits)
  })

  it("reduces effective deposit years when child is older", () => {
    const result = calculateSsy({
      daughterAgeYears: 10,
      annualDeposit: 100000,
      annualInterestRate: 8.2,
      taxRatePercent: 30,
    })

    expect(result.depositYears).toBe(11)
    expect(result.maturityYearsRemaining).toBe(11)
    expect(result.schedule.length).toBe(11)
  })

  it("caps annual deposit at 1.5 lakh", () => {
    const result = calculateSsy({
      daughterAgeYears: 3,
      annualDeposit: 300000,
      annualInterestRate: 8.2,
      taxRatePercent: 10,
    })

    expect(result.annual80cDeduction).toBe(150000)
  })
})
