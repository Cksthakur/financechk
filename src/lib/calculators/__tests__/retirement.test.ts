import { describe, expect, it } from "vitest"
import { calculateRetirement } from "../retirement"

describe("Retirement Calculator - Comprehensive Tests", () => {
  it("calculates values across PPF, EPF, and NPS correctly", () => {
    const result = calculateRetirement({
      currentAge: 30,
      retirementAge: 60,
      monthlyInvestment: 10000,
    })

    expect(result.tenureYears).toBe(30)
    expect(result.totalInvested).toBe(3600000)
    expect(result.npsCorpus).toBeGreaterThan(result.epfCorpus)
    expect(result.epfCorpus).toBeGreaterThan(result.ppfCorpus)
  })

  it("accurately handles PPF maturity blocks (15-year floor)", () => {
    // 12 year horizon -> should round up to 15 for PPF
    const res12 = calculateRetirement({
      currentAge: 30,
      retirementAge: 42,
      monthlyInvestment: 10000,
    })
    expect(res12.ppfTotalInvested).toBe(10000 * 12 * 15)
  })

  it("handles edge case: 0 investment", () => {
    const result = calculateRetirement({
      currentAge: 30,
      retirementAge: 60,
      monthlyInvestment: 0,
    })
    expect(result.npsCorpus).toBe(0)
  })
})
