export interface HomeLoanTaxBenefitInput {
  annualInterestPaid: number
  annualPrincipalPaid: number
  section80cUsedElsewhere: number
  annualGrossIncome: number
  taxRegime: "old" | "new"
}

export interface HomeLoanTaxBenefitResult {
  deductibleInterest: number
  deductiblePrincipal: number
  totalDeduction: number
  marginalTaxRate: number
  estimatedTaxSaved: number
  effectiveInterestCost: number
  notes: Array<string>
}

function getApproxMarginalRate(annualIncome: number): number {
  const income = Math.max(0, annualIncome)
  if (income <= 300000) return 0
  if (income <= 700000) return 5
  if (income <= 1000000) return 10
  if (income <= 1200000) return 15
  if (income <= 1500000) return 20
  return 30
}

/**
 * Estimate tax savings from Section 24(b) and 80C home-loan deductions.
 */
export function calculateHomeLoanTaxBenefit(
  input: HomeLoanTaxBenefitInput
): HomeLoanTaxBenefitResult {
  const annualInterestPaid = Math.max(0, input.annualInterestPaid)
  const annualPrincipalPaid = Math.max(0, input.annualPrincipalPaid)
  const section80cUsedElsewhere = Math.max(0, input.section80cUsedElsewhere)
  const annualGrossIncome = Math.max(0, input.annualGrossIncome)

  const notes: Array<string> = []

  if (input.taxRegime === "new") {
    notes.push(
      "New regime generally disallows Section 24(b) and 80C home-loan deductions for self-occupied property."
    )
    return {
      deductibleInterest: 0,
      deductiblePrincipal: 0,
      totalDeduction: 0,
      marginalTaxRate: getApproxMarginalRate(annualGrossIncome),
      estimatedTaxSaved: 0,
      effectiveInterestCost: annualInterestPaid,
      notes,
    }
  }

  const deductibleInterest = Math.min(annualInterestPaid, 200000)
  const available80CLimit = Math.max(0, 150000 - section80cUsedElsewhere)
  const deductiblePrincipal = Math.min(annualPrincipalPaid, available80CLimit)
  const totalDeduction = deductibleInterest + deductiblePrincipal

  const marginalTaxRate = getApproxMarginalRate(annualGrossIncome)
  const estimatedTaxSaved = Math.round(totalDeduction * (marginalTaxRate / 100))
  const effectiveInterestCost = Math.max(
    0,
    annualInterestPaid - estimatedTaxSaved
  )

  if (annualInterestPaid > 200000) {
    notes.push("Section 24(b) deduction capped at Rs 2,00,000 per year.")
  }
  if (section80cUsedElsewhere >= 150000) {
    notes.push("Section 80C limit already exhausted by other investments.")
  }

  notes.push("Education cess and surcharge are not included in this estimate.")

  return {
    deductibleInterest: Math.round(deductibleInterest),
    deductiblePrincipal: Math.round(deductiblePrincipal),
    totalDeduction: Math.round(totalDeduction),
    marginalTaxRate,
    estimatedTaxSaved,
    effectiveInterestCost: Math.round(effectiveInterestCost),
    notes,
  }
}
