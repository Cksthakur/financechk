import { describe, expect, it } from "vitest"
import { calculateHRA } from "../hra"

describe("HRA Calculator - Comprehensive Tests", () => {
  it("calculates HRA exemption correctly (metro city)", () => {
    const result = calculateHRA({
      basicSalary: 30000,
      hraReceived: 10000,
      rentPaid: 15000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(120000)
    expect(result.taxableHRA).toBe(0)
  })

  it("calculates HRA correctly for non-metro city", () => {
    const result = calculateHRA({
      basicSalary: 30000,
      hraReceived: 8000,
      rentPaid: 12000,
      cityType: "non-metro",
    })

    expect(result.hraExemption).toBe(96000)
    expect(result.taxableHRA).toBe(0)
  })

  it("handles high rent scenario", () => {
    const result = calculateHRA({
      basicSalary: 50000,
      hraReceived: 15000,
      rentPaid: 25000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(180000)
    expect(result.taxableHRA).toBe(0)
  })

  it("handles partial rent coverage", () => {
    const result = calculateHRA({
      basicSalary: 40000,
      hraReceived: 8000,
      rentPaid: 6000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(24000)
    expect(result.taxableHRA).toBe(72000)
  })

  it("handles edge case: HRA less than exemption", () => {
    const result = calculateHRA({
      basicSalary: 30000,
      hraReceived: 5000,
      rentPaid: 15000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(60000)
    expect(result.taxableHRA).toBe(0)
  })

  it("handles edge case: no rent paid scenario", () => {
    const result = calculateHRA({
      basicSalary: 30000,
      hraReceived: 10000,
      rentPaid: 0,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(0)
    expect(result.taxableHRA).toBe(120000)
  })

  it("handles minimum salary scenario", () => {
    const result = calculateHRA({
      basicSalary: 10000,
      hraReceived: 2000,
      rentPaid: 5000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(24000)
    expect(result.taxableHRA).toBe(0)
  })

  it("handles exactly 10% rent scenario", () => {
    const result = calculateHRA({
      basicSalary: 30000,
      hraReceived: 10000,
      rentPaid: 3000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(0)
  })

  it("handles very high basic salary", () => {
    const result = calculateHRA({
      basicSalary: 100000,
      hraReceived: 30000,
      rentPaid: 40000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(360000)
    expect(result.taxableHRA).toBe(0)
  })

  it("handles salary below rent scenario", () => {
    const result = calculateHRA({
      basicSalary: 20000,
      hraReceived: 5000,
      rentPaid: 25000,
      cityType: "metro",
    })

    expect(result.hraExemption).toBe(60000)
    expect(result.taxableHRA).toBe(0)
  })
})
