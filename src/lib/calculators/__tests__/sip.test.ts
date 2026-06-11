import { describe, expect, it } from "vitest"
import { calculateSIP } from "../sip"

describe("SIP Calculator - Comprehensive Tests", () => {
  it("calculates basic SIP correctly", () => {
    const result = calculateSIP({
      monthlyInvestment: 10000,
      expectedReturnRate: 12,
      tenureYears: 10,
    })

    // Expected values: total invested = 10,000 * 12 * 10 = 12,00,000
    expect(result.totalInvested).toBe(1200000)

    // Corpus should be ~23.23 Lakhs
    expect(result.totalCorpus).toBeGreaterThan(2300000)
    expect(result.totalCorpus).toBeLessThan(2350000)

    expect(result.schedule.length).toBe(120)
  })

  it("handles low return rate (Fixed Income scenario)", () => {
    const result = calculateSIP({
      monthlyInvestment: 5000,
      expectedReturnRate: 6,
      tenureYears: 5,
    })

    // total invested = 3,00,000
    expect(result.totalCorpus).toBeGreaterThan(340000)
    expect(result.estimatedReturns).toBeGreaterThan(40000)
  })

  it("handles high return rate (Wealth creation scenario)", () => {
    const result = calculateSIP({
      monthlyInvestment: 15000,
      expectedReturnRate: 15,
      tenureYears: 15, // The 15-15-15 rule
    })

    // 15k for 15yr @ 15% should be ~1 Crore
    expect(result.totalCorpus).toBeGreaterThan(9900000)
    expect(result.totalCorpus).toBeLessThan(10200000)
  })

  it("handles long-term compounding (25 years)", () => {
    const result = calculateSIP({
      monthlyInvestment: 5000,
      expectedReturnRate: 15,
      tenureYears: 25,
    })

    expect(result.totalInvested).toBe(1500000)
    // 5000/month at 15% for 25 yrs is approx ₹1.64 Crores
    expect(result.totalCorpus).toBeGreaterThan(16000000)
    expect(result.totalCorpus).toBeLessThan(17000000)
  })

  it("handles edge case: 0 investment", () => {
    const result = calculateSIP({
      monthlyInvestment: 0,
      expectedReturnRate: 12,
      tenureYears: 10,
    })
    expect(result.totalCorpus).toBe(0)
    expect(result.totalInvested).toBe(0)
  })

  it("handles edge case: 0 return rate", () => {
    const result = calculateSIP({
      monthlyInvestment: 10000,
      expectedReturnRate: 0,
      tenureYears: 5,
    })
    expect(result.totalCorpus).toBe(600000)
    expect(result.estimatedReturns).toBe(0)
  })

  it("handles 1 month duration (1/12 years)", () => {
    const result = calculateSIP({
      monthlyInvestment: 10000,
      expectedReturnRate: 12,
      tenureYears: 1 / 12,
    })

    expect(result.totalInvested).toBe(10000)
    // 1 month at 12% annual = 1%. (10000) * 1.01 = 10100
    expect(result.totalCorpus).toBe(10100)
  })

  it("accuracy of monthly compounding (Sum of interest = total interest)", () => {
    const result = calculateSIP({
      monthlyInvestment: 10000,
      expectedReturnRate: 12,
      tenureYears: 2,
    })

    const totalGrowthFromSchedule =
      result.schedule[result.schedule.length - 1].returns
    expect(result.estimatedReturns).toBe(Math.round(totalGrowthFromSchedule))
  })
})
