export interface Section87aMarginalReliefInput {
  grossTotalIncome: number
  specialRateIncome: number
  taxRegime: "new" | "old"
}

export interface Section87aMarginalReliefResult {
  regularIncome: number
  regularTax: number
  specialRateTax: number
  baseTaxBeforeRebate: number
  rebateAmount: number
  marginalReliefAmount: number
  taxAfterRelief: number
  cess: number
  finalTaxPayable: number
  rebateThreshold: number
}

const NEW_SLABS = [
  { threshold: 400000, rate: 0 },
  { threshold: 800000, rate: 5 },
  { threshold: 1200000, rate: 10 },
  { threshold: 1600000, rate: 15 },
  { threshold: 2000000, rate: 20 },
  { threshold: 2400000, rate: 25 },
  { threshold: Infinity, rate: 30 },
]

const OLD_SLABS = [
  { threshold: 250000, rate: 0 },
  { threshold: 500000, rate: 5 },
  { threshold: 1000000, rate: 20 },
  { threshold: Infinity, rate: 30 },
]

function round(value: number): number {
  return Math.round(value)
}

function calculateTaxFromSlabs(
  taxableIncome: number,
  slabs: Array<{ threshold: number; rate: number }>
): number {
  let tax = 0
  let previousThreshold = 0

  for (const slab of slabs) {
    if (taxableIncome <= previousThreshold) break
    const taxableInSlab =
      Math.min(taxableIncome, slab.threshold) - previousThreshold
    tax += taxableInSlab * (slab.rate / 100)
    previousThreshold = slab.threshold
  }

  return tax
}

/**
 * Computes Section 87A rebate and marginal relief around the rebate threshold.
 */
export function calculateSection87aMarginalRelief(
  input: Section87aMarginalReliefInput
): Section87aMarginalReliefResult {
  const grossTotalIncome = Math.max(0, input.grossTotalIncome)
  const specialRateIncome = Math.max(
    0,
    Math.min(grossTotalIncome, input.specialRateIncome)
  )

  const regularIncome = Math.max(0, grossTotalIncome - specialRateIncome)

  const slabs = input.taxRegime === "new" ? NEW_SLABS : OLD_SLABS
  const regularTax = calculateTaxFromSlabs(regularIncome, slabs)
  const specialRateTax = specialRateIncome * 0.2

  const baseTaxBeforeRebate = regularTax + specialRateTax

  const rebateThreshold = input.taxRegime === "new" ? 1200000 : 500000

  let rebateAmount = 0
  if (regularIncome <= rebateThreshold) {
    rebateAmount = Math.min(
      regularTax,
      input.taxRegime === "new" ? 60000 : 12500
    )
  }

  let taxAfterRebate = Math.max(0, baseTaxBeforeRebate - rebateAmount)

  let marginalReliefAmount = 0
  if (regularIncome > rebateThreshold) {
    const excessIncome = regularIncome - rebateThreshold
    const maxTaxOnRegular = excessIncome

    if (taxAfterRebate > maxTaxOnRegular + specialRateTax) {
      marginalReliefAmount = taxAfterRebate - (maxTaxOnRegular + specialRateTax)
      taxAfterRebate = maxTaxOnRegular + specialRateTax
    }
  }

  const cess = taxAfterRebate * 0.04
  const finalTaxPayable = taxAfterRebate + cess

  return {
    regularIncome: round(regularIncome),
    regularTax: round(regularTax),
    specialRateTax: round(specialRateTax),
    baseTaxBeforeRebate: round(baseTaxBeforeRebate),
    rebateAmount: round(rebateAmount),
    marginalReliefAmount: round(marginalReliefAmount),
    taxAfterRelief: round(taxAfterRebate),
    cess: round(cess),
    finalTaxPayable: round(finalTaxPayable),
    rebateThreshold,
  }
}
