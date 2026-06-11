import { describe, expect, it } from "vitest"
import {
  calculateFD,
  calculateLumpSum,
  calculateRD,
  calculateStepUpSip,
} from "../investments"

describe("Investments Calculators - Comprehensive Tests", () => {
  describe("Fixed Deposit (FD) Calculator", () => {
    it("calculates FD with standard quarterly compounding", () => {
      const result = calculateFD({
        principal: 100000,
        interestRate: 7,
        tenureYears: 5,
        compoundingFrequency: 4, // Quarterly
      })

      expect(result.totalInvested).toBe(100000)
      // A = P(1 + r/n)^(nt)
      // 100000 * (1 + 0.07/4)^(4*5) = 100000 * (1.0175)^20 ≈ 141477.82
      expect(result.totalCorpus).toBe(141478)
      expect(result.estimatedReturns).toBe(41478)
      expect(result.schedule.length).toBe(5) // Yearly snapshots
    })

    it("handles monthly compounding accurately", () => {
      const result = calculateFD({
        principal: 50000,
        interestRate: 9,
        tenureYears: 1,
        compoundingFrequency: 12, // Monthly
      })
      // 50000 * (1 + 0.09/12)^12 = 50000 * (1.0075)^12 ≈ 54690.34
      expect(result.totalCorpus).toBe(54690)
    })

    it("handles yearly compounding correctly", () => {
      const result = calculateFD({
        principal: 100000,
        interestRate: 10,
        tenureYears: 2,
        compoundingFrequency: 1, // Yearly
      })
      // 100000 * (1.1)^2 = 121000
      expect(result.totalCorpus).toBe(121000)
    })
  })

  describe("Recurring Deposit (RD) Calculator", () => {
    it("calculates RD correctly (Indian Banking Standard)", () => {
      const result = calculateRD({
        monthlyDeposit: 5000,
        interestRate: 7,
        tenureYears: 3,
      })

      // Total invested = 5000 * 12 * 3 = 1,80,000
      expect(result.totalInvested).toBe(180000)
      // RD at 7% for 3 yrs should be ~₹2.01 Lakhs
      expect(result.totalCorpus).toBeGreaterThan(200000)
      expect(result.totalCorpus).toBeLessThan(205000)
      expect(result.schedule.length).toBe(3) // Yearly snapshots
    })

    it("handles low interest RD", () => {
      const result = calculateRD({
        monthlyDeposit: 10000,
        interestRate: 3.5, // Typical savings rate
        tenureYears: 1,
      })
      expect(result.totalCorpus).toBeGreaterThan(120000)
      expect(result.totalCorpus).toBeLessThan(125000)
    })
  })

  describe("Step-Up SIP Calculator", () => {
    it("calculates step-up accurately (The Wealth Accelerator)", () => {
      const result = calculateStepUpSip({
        initialMonthlyInvestment: 10000,
        expectedReturnRate: 12,
        stepUpPercentage: 10, // 10% annual hike
        tenureYears: 10,
      })

      // Regular SIP total invested = 12,00,000.
      // Step-up invested should be significantly higher.
      // Year 1: 1.2L. Y2: 1.32L. Y3: 1.452L etc.
      expect(result.totalInvested).toBeGreaterThan(1800000)

      // Final corpus should be much larger than the ~23L of a regular SIP.
      expect(result.totalCorpus).toBeGreaterThan(3300000)
      expect(result.schedule.length).toBe(10)
    })

    it("handles 0% step-up (Behaves like normal SIP)", () => {
      const result = calculateStepUpSip({
        initialMonthlyInvestment: 10000,
        expectedReturnRate: 12,
        stepUpPercentage: 0,
        tenureYears: 10,
      })
      expect(result.totalInvested).toBe(1200000)
      expect(result.totalCorpus).toBeGreaterThan(2300000)
    })
  })

  describe("Lump Sum Calculator", () => {
    it("calculates compounding for a large single investment", () => {
      const result = calculateLumpSum({
        principal: 1000000, // 10 Lakhs
        expectedReturnRate: 15,
        tenureYears: 10,
      })

      // 10L * (1.15)^10 ≈ 40,45,557
      expect(result.totalCorpus).toBe(4045558)
      expect(result.totalInvested).toBe(1000000)
    })

    it("verifies the Rule of 72 (Doubling time)", () => {
      const result = calculateLumpSum({
        principal: 1000,
        expectedReturnRate: 12,
        tenureYears: 6, // 72 / 12 = 6 years to double
      })
      // Should be roughly 2000
      expect(result.totalCorpus).toBeGreaterThan(1950)
      expect(result.totalCorpus).toBeLessThan(2050)
    })
  })
})
