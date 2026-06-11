export type TaxRegimeType = "old" | "new"

interface TaxSlab {
  threshold: number
  rate: number
}

export interface AnnualTaxEstimate {
  taxableIncome: number
  baseTax: number
  cess: number
  totalTax: number
  regime: TaxRegimeType
}

const OLD_REGIME_SLABS: Array<TaxSlab> = [
  { threshold: 250000, rate: 0 },
  { threshold: 500000, rate: 5 },
  { threshold: 1000000, rate: 20 },
  { threshold: Infinity, rate: 30 },
]

const NEW_REGIME_SLABS: Array<TaxSlab> = [
  { threshold: 400000, rate: 0 },
  { threshold: 800000, rate: 5 },
  { threshold: 1200000, rate: 10 },
  { threshold: 1600000, rate: 15 },
  { threshold: 2000000, rate: 20 },
  { threshold: 2400000, rate: 25 },
  { threshold: Infinity, rate: 30 },
]

function calculateTaxFromSlabs(
  taxableIncome: number,
  slabs: Array<TaxSlab>
): number {
  let tax = 0
  let previousThreshold = 0

  for (const slab of slabs) {
    if (taxableIncome <= previousThreshold) {
      break
    }

    const taxableInSlab =
      Math.min(taxableIncome, slab.threshold) - previousThreshold
    tax += taxableInSlab * (slab.rate / 100)
    previousThreshold = slab.threshold
  }

  return tax
}

function applyRebate(
  taxableIncome: number,
  tax: number,
  regime: TaxRegimeType
) {
  if (regime === "old") {
    if (taxableIncome <= 500000) {
      return 0
    }
    return tax
  }

  if (taxableIncome <= 1200000) {
    return 0
  }

  return tax
}

export function estimateAnnualTax(
  taxableIncomeInput: number,
  regime: TaxRegimeType
): AnnualTaxEstimate {
  const taxableIncome = Math.max(0, Math.round(taxableIncomeInput))
  const slabs = regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS
  const taxBeforeRebate = calculateTaxFromSlabs(taxableIncome, slabs)
  const baseTax = applyRebate(taxableIncome, taxBeforeRebate, regime)
  const cess = baseTax * 0.04
  const totalTax = baseTax + cess

  return {
    taxableIncome,
    baseTax: Math.round(baseTax),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax),
    regime,
  }
}
