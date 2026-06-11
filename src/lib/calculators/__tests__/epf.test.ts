import { describe, expect, it } from "vitest"
import { calculateEPF } from "../epf"

describe("EPF Calculator - Comprehensive Tests", () => {
  it("calculates basic EPF correctly (employee + employer)", () => {
    const result = calculateEPF({
      monthlySalary: 30000,
      employeeContribution: 3600,
      employerContribution: 3600,
      currentBalance: 0,
      annualRate: 8.25,
      years: 10,
    })

    // Total annual contribution: 7200 * 12 = 86400
    expect(result.totalEmployeeContributions).toBe(432000)
    expect(result.totalEmployerContributions).toBe(432000)
    expect(result.totalBalance).toBeGreaterThan(1100000)
  })

  it("handles existing EPF balance", () => {
    const result = calculateEPF({
      monthlySalary: 50000,
      employeeContribution: 6000,
      employerContribution: 6000,
      currentBalance: 500000,
      annualRate: 8.25,
      years: 15,
    })

    // Should include existing balance in final amount
    expect(result.totalBalance).toBeGreaterThan(2500000)
  })

  it("handles standard 12% contribution", () => {
    const result = calculateEPF({
      monthlySalary: 25000,
      employeeContribution: 3000,
      employerContribution: 3000,
      currentBalance: 0,
      annualRate: 8.25,
      years: 20,
    })

    // 3000*12*20 = 7.2L from employee, same from employer
    expect(result.totalEmployeeContributions).toBe(720000)
    expect(result.totalEmployerContributions).toBe(720000)
    expect(result.totalBalance).toBeGreaterThan(3000000)
  })

  it("handles VPF (voluntary contribution)", () => {
    const result = calculateEPF({
      monthlySalary: 50000,
      employeeContribution: 10000, // Higher than standard 12% (6000)
      employerContribution: 6000,
      currentBalance: 0,
      annualRate: 8.25,
      years: 10,
    })

    // VPF: extra 4000/month gets tax-free 8.25%
    expect(result.totalEmployeeContributions).toBe(1200000) // 10k * 12 * 10
    expect(result.totalBalance).toBeGreaterThan(1700000)
  })

  it("handles edge case: 0 contribution", () => {
    const result = calculateEPF({
      monthlySalary: 30000,
      employeeContribution: 0,
      employerContribution: 0,
      currentBalance: 100000,
      annualRate: 8.25,
      years: 5,
    })

    expect(result.totalBalance).toBeGreaterThan(140000) // Just interest
  })

  it("handles edge case: 0% interest", () => {
    const result = calculateEPF({
      monthlySalary: 30000,
      employeeContribution: 3600,
      employerContribution: 3600,
      currentBalance: 0,
      annualRate: 0,
      years: 10,
    })

    expect(result.totalBalance).toBe(864000)
    expect(result.totalInterest).toBe(0)
  })

  it("handles short tenure (1 year)", () => {
    const result = calculateEPF({
      monthlySalary: 40000,
      employeeContribution: 4800,
      employerContribution: 4800,
      currentBalance: 0,
      annualRate: 8.25,
      years: 1,
    })

    // Total: 9600*12 = 115200 + interest
    expect(result.totalBalance).toBeGreaterThan(120000)
    expect(result.totalBalance).toBeLessThan(130000)
  })

  it("handles long tenure (30 years)", () => {
    const result = calculateEPF({
      monthlySalary: 40000,
      employeeContribution: 4800,
      employerContribution: 4800,
      currentBalance: 0,
      annualRate: 8.25,
      years: 30,
    })

    expect(result.totalBalance).toBeGreaterThan(10000000) // Should be significant
  })

  it("verifies yearly breakdown accuracy", () => {
    const result = calculateEPF({
      monthlySalary: 30000,
      employeeContribution: 3600,
      employerContribution: 3600,
      currentBalance: 0,
      annualRate: 8.25,
      years: 2,
    })

    // Year 1: (3600+3600)*12 = 86400, interest on this
    // Year 2: 86400 + 86400 = 172800, then interest
    expect(result.yearlyBreakdown[0].balance).toBeGreaterThan(90000)
    expect(result.yearlyBreakdown[1].balance).toBeGreaterThan(180000)
  })

  it("compares different salary levels", () => {
    const low = calculateEPF({
      monthlySalary: 15000,
      employeeContribution: 1800,
      employerContribution: 1800,
      currentBalance: 0,
      annualRate: 8.25,
      years: 20,
    })

    const high = calculateEPF({
      monthlySalary: 100000,
      employeeContribution: 12000, // Capped at 12% of 15k = 1800 actually, but let's use full
      employerContribution: 12000,
      currentBalance: 0,
      annualRate: 8.25,
      years: 20,
    })

    // Note: EPF has salary cap, but test shows concept
    // Higher contributions should yield more
    expect(high.totalBalance).toBeGreaterThan(low.totalBalance)
  })

  it("handles employer-only contribution scenario", () => {
    const result = calculateEPF({
      monthlySalary: 30000,
      employeeContribution: 0,
      employerContribution: 3600,
      currentBalance: 0,
      annualRate: 8.25,
      years: 10,
    })

    // Only employer contribution
    expect(result.totalEmployerContributions).toBe(432000)
    expect(result.totalEmployeeContributions).toBe(0)
    expect(result.totalBalance).toBeGreaterThan(550000)
  })

  it("calculates interest correctly", () => {
    const result = calculateEPF({
      monthlySalary: 50000,
      employeeContribution: 6000,
      employerContribution: 6000,
      currentBalance: 0,
      annualRate: 8.25,
      years: 1,
    })

    // Total: 12000*12 = 144000
    // Interest at 8.25%: ~6000-12000 (depends on compounding timing)
    expect(result.totalInterest).toBeGreaterThan(5000)
    expect(result.totalInterest).toBeLessThan(15000)
  })
})
