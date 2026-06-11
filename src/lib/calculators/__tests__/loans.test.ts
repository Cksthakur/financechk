import { describe, expect, it } from "vitest"
import { calculateLoan } from "../loans"

describe("Standard Loan (Car/Personal) Calculator - Comprehensive Tests", () => {
  it("calculates simple loan with years and months", () => {
    const result = calculateLoan({
      principalAmount: 100000,
      interestRate: 10,
      tenureYears: 1,
      tenureMonths: 6,
    })

    expect(result.schedule.length).toBe(18)
    expect(result.emi).toBe(6006)
    expect(result.totalPayment).toBe(108103)
  })

  it("handles standard 5-year car loan (60 months)", () => {
    const result = calculateLoan({
      principalAmount: 1000000,
      interestRate: 9,
      tenureYears: 5,
      tenureMonths: 0,
    })

    expect(result.schedule.length).toBe(60)
    expect(result.emi).toBe(20758)
    expect(result.totalInterest).toBe(245501)
  })

  it("handles edge case: 0 principal", () => {
    const result = calculateLoan({
      principalAmount: 0,
      interestRate: 10,
      tenureYears: 5,
      tenureMonths: 0,
    })
    expect(result.emi).toBe(0)
    expect(result.schedule).toEqual([])
  })

  it("handles very small loan amount", () => {
    const result = calculateLoan({
      principalAmount: 1000,
      interestRate: 12,
      tenureYears: 1,
      tenureMonths: 0,
    })
    expect(result.emi).toBeGreaterThan(80)
    expect(result.emi).toBeLessThan(90)
  })

  it("handles long tenure (10 years)", () => {
    const result = calculateLoan({
      principalAmount: 500000,
      interestRate: 8,
      tenureYears: 10,
      tenureMonths: 0,
    })
    expect(result.schedule.length).toBe(120)
    expect(result.totalPayment).toBeGreaterThan(500000)
  })

  it("handles 0% interest rate", () => {
    const result = calculateLoan({
      principalAmount: 120000,
      interestRate: 0,
      tenureYears: 1,
      tenureMonths: 0,
    })
    expect(result.emi).toBe(10000)
    expect(result.totalInterest).toBe(0)
  })

  it("handles only months (no years)", () => {
    const result = calculateLoan({
      principalAmount: 50000,
      interestRate: 10,
      tenureYears: 0,
      tenureMonths: 6,
    })
    expect(result.schedule.length).toBe(6)
  })
})
