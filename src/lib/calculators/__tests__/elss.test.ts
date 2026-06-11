import { describe, expect, it } from "vitest"
import { calculateElss } from "../elss"

describe("ELSS Calculator", () => {
  it("caps annual tax saving at Section 80C limit", () => {
    const result = calculateElss({
      monthlyInvestment: 20000,
      expectedReturnRate: 12,
      tenureYears: 10,
      taxBracket: 30,
    })

    expect(result.annualTaxSaved).toBe(45000)
  })

  it("matches invested corpus when expected return is zero", () => {
    const result = calculateElss({
      monthlyInvestment: 10000,
      expectedReturnRate: 0,
      tenureYears: 5,
      taxBracket: 20,
    })

    expect(result.totalInvested).toBe(600000)
    expect(result.totalCorpus).toBe(600000)
    expect(result.marketGains).toBe(0)
  })

  it("creates yearly schedule for full tenure", () => {
    const result = calculateElss({
      monthlyInvestment: 5000,
      expectedReturnRate: 10,
      tenureYears: 7,
      taxBracket: 10,
    })

    expect(result.schedule.length).toBe(7)
    expect(result.schedule[0].year).toBe(1)
    expect(result.schedule[6].year).toBe(7)
  })
})
