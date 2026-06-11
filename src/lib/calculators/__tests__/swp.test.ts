import { describe, expect, it } from "vitest"
import { calculateSWP } from "../swp"

describe("SWP Calculator - Comprehensive Tests", () => {
  it("calculates SWP where corpus grows (Safe Withdrawal Rate)", () => {
    const result = calculateSWP({
      initialCorpus: 10000000, // 1 Cr
      monthlyWithdrawal: 50000, // 50k (6% annual withdrawal)
      expectedReturnRate: 10, // 10% return > 6% withdrawal
      tenureYears: 20,
    })

    expect(result.totalWithdrawn).toBe(50000 * 12 * 20)
    expect(result.depletedAtMonth).toBeNull()
    expect(result.finalCorpus).toBeGreaterThan(10000000)
  })

  it("calculates SWP where corpus depletes (Aggressive Withdrawal)", () => {
    const result = calculateSWP({
      initialCorpus: 5000000,
      monthlyWithdrawal: 100000, // 1.2L annual withdrawal
      expectedReturnRate: 8,
      tenureYears: 15,
    })

    expect(result.depletedAtMonth).toBeGreaterThan(0)
    expect(result.finalCorpus).toBe(0)
    expect(result.totalWithdrawn).toBeLessThan(100000 * 12 * 15)
  })

  it("handles zero return rate", () => {
    const result = calculateSWP({
      initialCorpus: 1200000,
      monthlyWithdrawal: 10000,
      expectedReturnRate: 0,
      tenureYears: 10,
    })
    // Should deplete exactly in 120 months
    expect(result.depletedAtMonth).toBe(120)
    expect(result.finalCorpus).toBe(0)
  })

  it("handles edge case: 0 starting corpus", () => {
    const result = calculateSWP({
      initialCorpus: 0,
      monthlyWithdrawal: 10000,
      expectedReturnRate: 10,
      tenureYears: 20,
    })
    expect(result.finalCorpus).toBe(0)
    expect(result.totalWithdrawn).toBe(0)
    expect(result.depletedAtMonth).toBe(0)
  })
})
