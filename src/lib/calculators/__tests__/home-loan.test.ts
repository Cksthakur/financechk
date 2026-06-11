import { describe, expect, it } from "vitest"
import { calculateHomeLoan } from "../home-loan"

describe("Home Loan Calculator - Comprehensive Tests", () => {
  it("calculates basic eligibility for private salaried (FOIR 0.55)", () => {
    const result = calculateHomeLoan({
      monthlySalary: 100000,
      existingEMI: 0,
      interestRate: 9,
      tenureYears: 20,
      employerType: "salaried-private",
    })

    // FOIR = 0.55 * 1,00,000 = 55,000
    expect(result.recommendedEMI).toBe(55000)

    // Using toBeCloseTo with a tolerance for rounding across different formula implementations
    expect(result.maxLoanAmount).toBeGreaterThan(6100000)
    expect(result.maxLoanAmount).toBeLessThan(6120000)
    expect(result.schedule.length).toBe(240)
  })

  it("handles gov employees (FOIR 0.60)", () => {
    const result = calculateHomeLoan({
      monthlySalary: 100000,
      existingEMI: 0,
      interestRate: 9,
      tenureYears: 20,
      employerType: "salaried-govt",
    })
    expect(result.recommendedEMI).toBe(60000)
  })

  it("handles self-employed (FOIR 0.50)", () => {
    const result = calculateHomeLoan({
      monthlySalary: 100000,
      existingEMI: 0,
      interestRate: 9,
      tenureYears: 20,
      employerType: "self-employed",
    })
    expect(result.recommendedEMI).toBe(50000)
  })

  it("handles large existing EMIs that wipe out eligibility", () => {
    const result = calculateHomeLoan({
      monthlySalary: 50000,
      existingEMI: 30000,
      interestRate: 9,
      tenureYears: 20,
      employerType: "salaried-private",
    })
    // 55% of 50k = 27500. Existing 30k exceeds capacity.
    expect(result.recommendedEMI).toBe(0)
    expect(result.maxLoanAmount).toBe(0)
    expect(result.schedule).toEqual([])
  })

  it("accuracy of amortization schedule (Final balance is zero)", () => {
    const result = calculateHomeLoan({
      monthlySalary: 50000,
      existingEMI: 0,
      interestRate: 10,
      tenureYears: 10,
      employerType: "salaried-private",
    })

    const firstMonth = result.schedule[0]
    expect(Math.round(firstMonth.principal + firstMonth.interest)).toBe(
      result.recommendedEMI
    )

    const lastMonth = result.schedule[result.schedule.length - 1]
    expect(lastMonth.balance).toBeLessThanOrEqual(5) // Allow small rounding margin
  })

  it("edge case: Zero interest rate", () => {
    const result = calculateHomeLoan({
      monthlySalary: 100000,
      existingEMI: 0,
      interestRate: 0,
      tenureYears: 10,
      employerType: "salaried-private",
    })
    expect(result.maxLoanAmount).toBe(6600000)
    expect(result.totalInterest).toBe(0)
  })

  it("handles minimum salary scenario", () => {
    const result = calculateHomeLoan({
      monthlySalary: 15000,
      existingEMI: 0,
      interestRate: 9,
      tenureYears: 20,
      employerType: "salaried-private",
    })
    expect(result.maxLoanAmount).toBeGreaterThan(600000)
  })

  it("handles different tenures correctly", () => {
    const shortTenure = calculateHomeLoan({
      monthlySalary: 50000,
      existingEMI: 0,
      interestRate: 8,
      tenureYears: 10,
      employerType: "salaried-private",
    })
    const longTenure = calculateHomeLoan({
      monthlySalary: 50000,
      existingEMI: 0,
      interestRate: 8,
      tenureYears: 30,
      employerType: "salaried-private",
    })
    expect(longTenure.maxLoanAmount).toBeGreaterThan(shortTenure.maxLoanAmount)
  })

  it("handles partial existing EMI", () => {
    const result = calculateHomeLoan({
      monthlySalary: 100000,
      existingEMI: 10000,
      interestRate: 9,
      tenureYears: 20,
      employerType: "salaried-private",
    })
    expect(result.recommendedEMI).toBe(45000)
    expect(result.maxLoanAmount).toBeGreaterThan(5000000)
  })
})
