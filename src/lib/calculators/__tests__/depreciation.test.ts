import { describe, expect, it } from "vitest"
import { calculateDepreciation } from "../depreciation"

describe("Depreciation Calculator", () => {
  it("calculates straight-line depreciation schedule correctly", () => {
    const result = calculateDepreciation({
      assetCost: 1000000,
      salvageValue: 100000,
      usefulLifeYears: 9,
      depreciationRate: 15,
      method: "straight-line",
    })

    expect(result.schedule.length).toBe(9)
    expect(result.endBookValue).toBe(100000)
    expect(result.totalDepreciation).toBe(900000)
  })

  it("calculates wdv depreciation with declining balance", () => {
    const result = calculateDepreciation({
      assetCost: 500000,
      salvageValue: 50000,
      usefulLifeYears: 5,
      depreciationRate: 20,
      method: "written-down-value",
    })

    expect(result.schedule.length).toBe(5)
    expect(result.schedule[1].depreciation).toBeLessThanOrEqual(
      result.schedule[0].depreciation
    )
  })

  it("handles zero asset cost safely", () => {
    const result = calculateDepreciation({
      assetCost: 0,
      salvageValue: 0,
      usefulLifeYears: 5,
      depreciationRate: 10,
      method: "straight-line",
    })

    expect(result.schedule).toEqual([])
    expect(result.totalDepreciation).toBe(0)
  })
})
