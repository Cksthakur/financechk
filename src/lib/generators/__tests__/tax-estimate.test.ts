import { describe, expect, it } from "vitest"
import { estimateAnnualTax } from "../tax-estimate"

describe("Tax estimate helper", () => {
  it("applies new regime rebate below threshold", () => {
    const result = estimateAnnualTax(1100000, "new")
    expect(result.totalTax).toBe(0)
  })

  it("computes tax for old regime above threshold", () => {
    const result = estimateAnnualTax(1500000, "old")
    expect(result.totalTax).toBeGreaterThan(0)
  })
})
