export type DepreciationMethod = "straight-line" | "written-down-value"

export interface DepreciationInput {
  assetCost: number
  salvageValue: number
  usefulLifeYears: number
  depreciationRate: number
  method: DepreciationMethod
}

export interface DepreciationRow {
  year: number
  openingValue: number
  depreciation: number
  closingValue: number
}

export interface DepreciationResult {
  totalDepreciation: number
  endBookValue: number
  schedule: Array<DepreciationRow>
}

/**
 * Calculate annual depreciation using SLM or WDV methods.
 */
export function calculateDepreciation(
  input: DepreciationInput
): DepreciationResult {
  const assetCost = Math.max(0, input.assetCost)
  const salvageValue = Math.max(0, Math.min(input.salvageValue, assetCost))
  const usefulLifeYears = Math.max(1, Math.round(input.usefulLifeYears))
  const depreciationRate = Math.max(0, input.depreciationRate)

  if (assetCost === 0) {
    return { totalDepreciation: 0, endBookValue: 0, schedule: [] }
  }

  const schedule: Array<DepreciationRow> = []
  let openingValue = assetCost

  if (input.method === "straight-line") {
    const annualDep = (assetCost - salvageValue) / usefulLifeYears

    for (let year = 1; year <= usefulLifeYears; year++) {
      const depreciation = Math.max(
        0,
        Math.min(annualDep, openingValue - salvageValue)
      )
      const closingValue = Math.max(salvageValue, openingValue - depreciation)

      schedule.push({
        year,
        openingValue: Math.round(openingValue),
        depreciation: Math.round(depreciation),
        closingValue: Math.round(closingValue),
      })

      openingValue = closingValue
    }
  } else {
    for (let year = 1; year <= usefulLifeYears; year++) {
      let depreciation = openingValue * (depreciationRate / 100)
      if (openingValue - depreciation < salvageValue) {
        depreciation = Math.max(0, openingValue - salvageValue)
      }

      const closingValue = Math.max(salvageValue, openingValue - depreciation)

      schedule.push({
        year,
        openingValue: Math.round(openingValue),
        depreciation: Math.round(depreciation),
        closingValue: Math.round(closingValue),
      })

      openingValue = closingValue
    }
  }

  const endBookValue = schedule.length
    ? schedule[schedule.length - 1].closingValue
    : Math.round(assetCost)

  return {
    totalDepreciation: Math.round(assetCost - endBookValue),
    endBookValue,
    schedule,
  }
}
