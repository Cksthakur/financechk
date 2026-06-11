import { calculateTaxComparison } from "./tax-regime"
import type { TaxInput } from "./tax-regime"

export interface TaxRegimeBreakEvenInput {
  annualSalary: number
  basicSalary: number
  hra: number
  rentPaid: number
  cityType: "metro" | "non-metro"
  section80D: number
  section80CCD: number
  homeLoanInterest: number
  otherDeductions: number
  financialYear: string
}

export interface TaxRegimeBreakEvenResult {
  breakEvenSection80C: number
  oldTaxAtBreakEven: number
  newTaxAtBreakEven: number
  taxIfSection80CZeroOld: number
  taxIfSection80CZeroNew: number
  recommendedRegimeAtCurrent80C: "old" | "new"
}

function buildTaxInput(
  input: TaxRegimeBreakEvenInput,
  section80C: number
): TaxInput {
  return {
    annualSalary: Math.max(0, input.annualSalary),
    basicSalary: Math.max(0, input.basicSalary),
    hra: Math.max(0, input.hra),
    rentPaid: Math.max(0, input.rentPaid),
    cityType: input.cityType,
    section80C: Math.max(0, section80C),
    section80D: Math.max(0, input.section80D),
    section80CCD: Math.max(0, input.section80CCD),
    homeLoanInterest: Math.max(0, input.homeLoanInterest),
    otherDeductions: Math.max(0, input.otherDeductions),
    financialYear: input.financialYear,
  }
}

/**
 * Finds section 80C value where old and new regime taxes are closest.
 */
export function calculateTaxRegimeBreakEven(
  input: TaxRegimeBreakEvenInput
): TaxRegimeBreakEvenResult {
  const baseAtZero = calculateTaxComparison(buildTaxInput(input, 0))

  let breakEvenSection80C = 0
  let bestGap = Number.POSITIVE_INFINITY
  let oldTaxAtBreakEven = baseAtZero.oldRegime.totalTax
  let newTaxAtBreakEven = baseAtZero.newRegime.totalTax

  for (let section80C = 0; section80C <= 150000; section80C += 1000) {
    const comparison = calculateTaxComparison(buildTaxInput(input, section80C))
    const gap = Math.abs(
      comparison.oldRegime.totalTax - comparison.newRegime.totalTax
    )

    if (gap < bestGap) {
      bestGap = gap
      breakEvenSection80C = section80C
      oldTaxAtBreakEven = comparison.oldRegime.totalTax
      newTaxAtBreakEven = comparison.newRegime.totalTax
    }
  }

  const atCurrent = calculateTaxComparison(
    buildTaxInput(input, breakEvenSection80C)
  )

  return {
    breakEvenSection80C,
    oldTaxAtBreakEven,
    newTaxAtBreakEven,
    taxIfSection80CZeroOld: baseAtZero.oldRegime.totalTax,
    taxIfSection80CZeroNew: baseAtZero.newRegime.totalTax,
    recommendedRegimeAtCurrent80C: atCurrent.betterRegime,
  }
}
