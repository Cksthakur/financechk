import { describe, expect, it } from "vitest"
import { calculateCompoundInterest } from "../compound-interest"

describe("Compound Interest Calculator - Comprehensive Tests", () => {
  it("calculates basic yearly compounding correctly", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 8,
      years: 1,
      compoundingFrequency: "yearly",
    })

    expect(result.totalAmount).toBe(108000)
    expect(result.totalInterest).toBe(8000)
  })

  it("calculates quarterly compounding correctly", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 8,
      years: 1,
      compoundingFrequency: "quarterly",
    })

    // Quarterly: 8% annual = 2% per quarter, 4 quarters
    expect(result.totalAmount).toBeGreaterThan(108000)
    expect(result.totalAmount).toBeLessThan(109000)
    expect(result.totalInterest).toBeGreaterThan(8000)
    expect(result.totalInterest).toBeLessThan(9000)
  })

  it("calculates monthly compounding correctly", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 12,
      years: 1,
      compoundingFrequency: "monthly",
    })

    // Monthly: 12% annual = 1% per month, 12 months
    expect(result.totalAmount).toBeGreaterThan(112000)
    expect(result.totalAmount).toBeLessThan(113000)
  })

  it("handles 5-year term correctly", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      years: 5,
      compoundingFrequency: "yearly",
    })

    // 100000 * (1.1)^5 = 161051
    expect(result.totalAmount).toBe(161051)
    expect(result.totalInterest).toBe(61051)
    expect(result.yearlyBreakdown.length).toBe(5)
  })

  it("handles half-yearly compounding correctly", () => {
    const result = calculateCompoundInterest({
      principal: 50000,
      annualRate: 8,
      years: 2,
      compoundingFrequency: "half-yearly",
    })

    // Half-yearly: 8% annual = 4% per half-year, 4 periods
    // A = 50000 * (1 + 0.08/2)^(2*2) = 50000 * 1.1699 = 58493
    expect(result.totalAmount).toBe(58493)
  })

  it("handles edge case: 0 principal", () => {
    const result = calculateCompoundInterest({
      principal: 0,
      annualRate: 10,
      years: 5,
      compoundingFrequency: "yearly",
    })

    expect(result.totalAmount).toBe(0)
    expect(result.totalInterest).toBe(0)
  })

  it("handles edge case: 0% interest rate", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 0,
      years: 10,
      compoundingFrequency: "yearly",
    })

    expect(result.totalAmount).toBe(100000)
    expect(result.totalInterest).toBe(0)
  })

  it("handles edge case: 1 year term", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 7,
      years: 1,
      compoundingFrequency: "yearly",
    })

    expect(result.totalAmount).toBe(107000)
    expect(result.yearlyBreakdown.length).toBe(1)
  })

  it("verifies yearly breakdown accuracy", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      years: 3,
      compoundingFrequency: "yearly",
    })

    // Year 1: 100000 * 1.1 = 110000
    expect(result.yearlyBreakdown[0].total).toBeCloseTo(110000, 0)
    expect(result.yearlyBreakdown[0].interest).toBeCloseTo(10000, 0)

    // Year 2: 110000 * 1.1 = 121000
    expect(result.yearlyBreakdown[1].total).toBeCloseTo(121000, 0)
    expect(result.yearlyBreakdown[1].interest).toBeCloseTo(21000, 0)
  })

  it("compares monthly vs yearly compounding difference", () => {
    const yearly = calculateCompoundInterest({
      principal: 100000,
      annualRate: 8,
      years: 5,
      compoundingFrequency: "yearly",
    })

    const monthly = calculateCompoundInterest({
      principal: 100000,
      annualRate: 8,
      years: 5,
      compoundingFrequency: "monthly",
    })

    // Monthly compounding should yield more
    expect(monthly.totalAmount).toBeGreaterThan(yearly.totalAmount)
    // Difference should be visible
    const diff = monthly.totalAmount - yearly.totalAmount
    expect(diff).toBeGreaterThan(1000)
  })

  it("handles very high interest rate (15%)", () => {
    const result = calculateCompoundInterest({
      principal: 50000,
      annualRate: 15,
      years: 10,
      compoundingFrequency: "yearly",
    })

    // Should give significant returns
    expect(result.totalAmount).toBeGreaterThan(200000)
    expect(result.totalInterest).toBeGreaterThan(150000)
  })

  it("handles 0 years (edge case)", () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 10,
      years: 0,
      compoundingFrequency: "yearly",
    })

    expect(result.totalAmount).toBe(100000)
    expect(result.yearlyBreakdown.length).toBe(0)
  })
})
