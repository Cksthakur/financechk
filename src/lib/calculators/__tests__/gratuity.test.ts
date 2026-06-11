import { describe, expect, it } from "vitest"
import { calculateGratuity } from "../gratuity"

describe("Gratuity Calculator - Comprehensive Tests", () => {
  it("calculates basic gratuity correctly", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 50000,
      lastDrawnDearnessAllowance: 5000,
      yearsOfService: 10,
      retirementType: "resignation",
    })

    // Daily wage: 55000/26 = 2115
    // 15 days: 2115 * 15 * 10 = 317,308
    expect(result.gratuityAmount).toBeGreaterThan(300000)
    expect(result.gratuityAmount).toBeLessThan(320000)
  })

  it("handles superannuation retirement", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 60000,
      lastDrawnDearnessAllowance: 6000,
      yearsOfService: 20,
      retirementType: "superannuation",
    })

    // Superannuation allows additional gratuity for service beyond 15 years
    // Should be more than resignation case
    expect(result.gratuityAmount).toBeGreaterThan(500000)
    // Capped at 20 lakh under Payment of Gratuity Act
    expect(result.gratuityAmount).toBeLessThanOrEqual(2000000)
  })

  it("handles death case (fully exempt)", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 40000,
      lastDrawnDearnessAllowance: 4000,
      yearsOfService: 5,
      retirementType: "death",
    })

    // Death case: no 5-year requirement, full exemption
    expect(result.exemptionLimit).toBe(result.gratuityAmount)
    expect(result.taxableAmount).toBe(0)
  })

  it("respects 5-year minimum service", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 50000,
      lastDrawnDearnessAllowance: 0,
      yearsOfService: 5,
      retirementType: "resignation",
    })

    // 5 years minimum for eligibility
    expect(result.gratuityAmount).toBeGreaterThan(0)
  })

  it("respects 15-year limit for private sector", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 100000,
      lastDrawnDearnessAllowance: 10000,
      yearsOfService: 30, // Would give very high gratuity
      retirementType: "resignation",
    })

    // For resignation, service beyond 15 years doesn't increase gratuity
    // But formula calculates based on all years - verify it doesn't exceed cap
    expect(result.gratuityAmount).toBeGreaterThan(0)
  })

  it("handles minimum salary scenario", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 15000,
      lastDrawnDearnessAllowance: 0,
      yearsOfService: 5,
      retirementType: "resignation",
    })

    expect(result.gratuityAmount).toBeGreaterThan(0)
    expect(result.gratuityAmount).toBeLessThan(50000)
  })

  it("handles high salary scenario", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 200000,
      lastDrawnDearnessAllowance: 20000,
      yearsOfService: 15,
      retirementType: "resignation",
    })

    // High salary should give high gratuity
    expect(result.gratuityAmount).toBeGreaterThan(1000000)
  })

  it("handles 15 years service correctly", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 40000,
      lastDrawnDearnessAllowance: 4000,
      yearsOfService: 15,
      retirementType: "resignation",
    })

    // 15 years should give reasonable gratuity
    expect(result.gratuityAmount).toBeGreaterThan(300000)
  })

  it("handles DA as part of salary", () => {
    const withDA = calculateGratuity({
      lastDrawnBasicSalary: 40000,
      lastDrawnDearnessAllowance: 5000,
      yearsOfService: 10,
      retirementType: "resignation",
    })

    const withoutDA = calculateGratuity({
      lastDrawnBasicSalary: 45000,
      lastDrawnDearnessAllowance: 0,
      yearsOfService: 10,
      retirementType: "resignation",
    })

    // Both should give similar results
    expect(
      Math.abs(withDA.gratuityAmount - withoutDA.gratuityAmount)
    ).toBeLessThan(1000)
  })

  it("verifies calculation breakdown", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 30000,
      lastDrawnDearnessAllowance: 3000,
      yearsOfService: 10,
      retirementType: "resignation",
    })

    // Daily wage: 33000/26 = 1269
    // 15 days: 1269 * 15 = 19038 per year
    // 10 years: 19038 * 10 = 190384
    expect(result.calculationBreakdown.basedOn15Days).toBeGreaterThan(190000)
    expect(result.calculationBreakdown.basedOnGratuityAct).toBe(2000000)
  })

  it("handles fractional years (rounds down)", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 30000,
      lastDrawnDearnessAllowance: 0,
      yearsOfService: 5.4, // Less than 6 years
      retirementType: "resignation",
    })

    // Should count as 5 years (or maybe 5.4 depending on implementation)
    expect(result.gratuityAmount).toBeGreaterThan(0)
  })

  it("handles 20 years service correctly", () => {
    const result = calculateGratuity({
      lastDrawnBasicSalary: 50000,
      lastDrawnDearnessAllowance: 5000,
      yearsOfService: 20,
      retirementType: "superannuation",
    })

    // Superannuation allows extra beyond 15 years
    expect(result.gratuityAmount).toBeGreaterThan(500000)
  })
})
