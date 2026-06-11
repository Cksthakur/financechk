import { describe, expect, it } from "vitest"
import { calculatePPF } from "../ppf"

describe("PPF Calculator - Comprehensive Tests", () => {
  it("calculates basic PPF correctly (15 years)", () => {
    const result = calculatePPF({
      monthlyContribution: 1000,
      currentBalance: 0,
      annualRate: 7.1,
      years: 15,
    })

    // Total contribution: 1000 * 12 * 15 = 180000
    expect(result.totalContributions).toBe(180000)
    expect(result.yearlyBreakdown.length).toBe(15)
    // Should be significant returns
    expect(result.maturityAmount).toBeGreaterThan(250000)
  })

  it("calculates PPF with existing balance", () => {
    const result = calculatePPF({
      monthlyContribution: 5000,
      currentBalance: 50000,
      annualRate: 7.1,
      years: 10,
    })

    expect(result.totalContributions).toBe(650000) // 50000 + 5000*12*10
    expect(result.maturityAmount).toBeGreaterThan(750000)
  })

  it("handles 15-year minimum tenure correctly", () => {
    const result = calculatePPF({
      monthlyContribution: 10000,
      currentBalance: 0,
      annualRate: 7.1,
      years: 15,
    })

    expect(result.yearlyBreakdown.length).toBe(15)
    // Monthly 10k for 15 years should give ~25+ lakhs
    expect(result.maturityAmount).toBeGreaterThan(2500000)
  })

  it("handles extended tenure (20 years)", () => {
    const result = calculatePPF({
      monthlyContribution: 5000,
      currentBalance: 0,
      annualRate: 7.1,
      years: 20,
    })

    // 5000*12*20 = 12 lakhs contribution
    expect(result.totalContributions).toBe(1200000)
    expect(result.maturityAmount).toBeGreaterThan(2000000)
    expect(result.yearlyBreakdown.length).toBe(20)
  })

  it("handles edge case: 0 contribution", () => {
    const result = calculatePPF({
      monthlyContribution: 0,
      currentBalance: 100000,
      annualRate: 7.1,
      years: 10,
    })

    expect(result.maturityAmount).toBeGreaterThan(140000) // Just interest on 1L
  })

  it("handles edge case: 0% interest rate", () => {
    const result = calculatePPF({
      monthlyContribution: 5000,
      currentBalance: 0,
      annualRate: 0,
      years: 10,
    })

    expect(result.totalContributions).toBe(600000)
    expect(result.totalInterest).toBe(0)
    expect(result.maturityAmount).toBe(600000)
  })

  it("handles small contribution (minimum ₹500)", () => {
    const result = calculatePPF({
      monthlyContribution: 500, // Minimum
      currentBalance: 0,
      annualRate: 7.1,
      years: 15,
    })

    expect(result.totalContributions).toBe(90000) // 500 * 12 * 15
    expect(result.maturityAmount).toBeGreaterThan(125000)
  })

  it("handles max contribution (₹1.5 lakh/year)", () => {
    const result = calculatePPF({
      monthlyContribution: 12500, // Max monthly to reach 1.5L/year
      currentBalance: 0,
      annualRate: 7.1,
      years: 15,
    })

    expect(result.totalContributions).toBe(2250000) // 1.5L * 15
    expect(result.maturityAmount).toBeGreaterThan(3500000)
  })

  it("verifies yearly breakdown accuracy", () => {
    const result = calculatePPF({
      monthlyContribution: 1000,
      currentBalance: 0,
      annualRate: 7.1,
      years: 3,
    })

    // Each year should have increasing balance
    expect(result.yearlyBreakdown[0].balance).toBeGreaterThan(12000)
    expect(result.yearlyBreakdown[1].balance).toBeGreaterThan(
      result.yearlyBreakdown[0].balance
    )
    expect(result.yearlyBreakdown[2].balance).toBeGreaterThan(
      result.yearlyBreakdown[1].balance
    )
  })

  it("handles interest calculation correctly", () => {
    const result = calculatePPF({
      monthlyContribution: 10000,
      currentBalance: 0,
      annualRate: 7.1,
      years: 1,
    })

    // 120000 * 1.071 = 128520
    expect(result.maturityAmount).toBe(128520)
    expect(result.totalInterest).toBe(8520)
  })

  it("handles various rates", () => {
    const lower = calculatePPF({
      monthlyContribution: 5000,
      currentBalance: 0,
      annualRate: 6,
      years: 15,
    })

    const higher = calculatePPF({
      monthlyContribution: 5000,
      currentBalance: 0,
      annualRate: 8,
      years: 15,
    })

    // Higher rate should give more returns
    expect(higher.maturityAmount).toBeGreaterThan(lower.maturityAmount)
    expect(higher.totalInterest).toBeGreaterThan(lower.totalInterest)
  })

  it("handles 1 year tenure", () => {
    const result = calculatePPF({
      monthlyContribution: 10000,
      currentBalance: 0,
      annualRate: 7.1,
      years: 1,
    })

    expect(result.maturityAmount).toBe(128520)
    expect(result.yearlyBreakdown.length).toBe(1)
  })
})
