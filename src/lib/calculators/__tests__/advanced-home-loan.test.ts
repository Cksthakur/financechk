import { describe, expect, it } from "vitest"
import { calculateAdvancedHomeLoan } from "../advanced-home-loan"

describe("Advanced Home Loan Calculator - Comprehensive Tests", () => {
  it("calculates base loan correctly without prepayments/expenses", () => {
    const result = calculateAdvancedHomeLoan({
      homeValue: 5000000,
      downPayment: 1000000,
      loanInsurance: 0,
      loanFeesPercent: 0,
      interestRate: 9,
      tenureYears: 20,
      tenureMonths: 0,
      propertyTaxYearly: 0,
      homeInsuranceYearly: 0,
      maintenanceMonthly: 0,
      taxBracket: 0,
      startMonth: 4,
      startYear: 2024,
      prepayments: [],
    })

    expect(result.loanAmount).toBe(4000000)
    // Month count after exactly 20 years (240 months) should be 240
    expect(result.newTenureMonths).toBe(240)
    expect(result.totalPrepayments).toBe(0)
  })

  it("handles multiple random one-time prepayments correctly", () => {
    const result = calculateAdvancedHomeLoan({
      homeValue: 5000000,
      downPayment: 1000000,
      loanInsurance: 0,
      loanFeesPercent: 0,
      interestRate: 10,
      tenureYears: 20,
      tenureMonths: 0,
      propertyTaxYearly: 0,
      homeInsuranceYearly: 0,
      maintenanceMonthly: 0,
      taxBracket: 0,
      startMonth: 1,
      startYear: 2024,
      prepayments: [
        { id: "1", type: "one-time", amount: 500000, startMonthIndex: 12 },
        { id: "2", type: "one-time", amount: 500000, startMonthIndex: 24 },
      ],
    })

    // Tenure should reduce significantly from 240 months
    expect(result.newTenureMonths).toBeLessThan(150)
    expect(result.totalPrepayments).toBe(1000000)
  })

  it("calculates Section 24b tax savings accurately", () => {
    const result = calculateAdvancedHomeLoan({
      homeValue: 10000000, // 1 Cr
      downPayment: 2000000, // 20L
      loanInsurance: 0,
      loanFeesPercent: 0,
      interestRate: 10,
      tenureYears: 20,
      tenureMonths: 0,
      propertyTaxYearly: 0,
      homeInsuranceYearly: 0,
      maintenanceMonthly: 0,
      taxBracket: 30, // 30% tax bracket
      startMonth: 4, // Start of FY (April)
      startYear: 2024,
      prepayments: [],
    })

    // Interest in year 1 is approx 8L. Capped at 2L. 30% of 2L = 60,000 saved.
    // The first year (2024) ends in March 2025. The schedule will show this in the second entry (index 1)
    // or we check the total.
    expect(result.totalTaxSaved).toBeGreaterThan(500000)
    // Check the entry that includes March
    const fyTarget = result.yearlySchedule.find((y) => y.taxSaved > 0)
    expect(fyTarget?.taxSaved).toBe(60000)
  })

  it("handles loan insurance and fees", () => {
    const result = calculateAdvancedHomeLoan({
      homeValue: 5000000,
      downPayment: 1000000,
      loanInsurance: 100000, // Added to loan
      loanFeesPercent: 1, // 1% of 41L = 41000
      interestRate: 9,
      tenureYears: 20,
      tenureMonths: 0,
      propertyTaxYearly: 0,
      homeInsuranceYearly: 0,
      maintenanceMonthly: 0,
      taxBracket: 0,
      startMonth: 1,
      startYear: 2024,
      prepayments: [],
    })

    expect(result.loanAmount).toBe(4100000)
    // DP 10L + 1% Fees (41k) + Insurance 100k (Initial payment + fees)
    // Note: implementation says feesAmount = loanAmount * percent
    // downPaymentAndFees = downPayment + feesAmount + loanInsurance
    expect(result.downPaymentAndFees).toBe(1000000 + 41000 + 100000)
  })
})
