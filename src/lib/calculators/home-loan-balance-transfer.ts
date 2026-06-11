export interface HomeLoanBalanceTransferInput {
  outstandingPrincipal: number
  currentInterestRate: number
  remainingTenureYears: number
  newInterestRate: number
  processingFeePercent: number
  processingFeeFlat: number
  otherTransferCosts: number
}

export interface HomeLoanBalanceTransferResult {
  currentEmi: number
  newEmi: number
  monthlyEmiSaving: number
  currentTotalInterest: number
  newTotalInterest: number
  grossInterestSaved: number
  transferCost: number
  netSavings: number
  breakEvenMonths: number | null
  recommendation: "recommended" | "not_recommended"
}

function round(value: number): number {
  return Math.round(value)
}

function toMonthlyRate(annualRate: number): number {
  return Math.max(0, annualRate) / 12 / 100
}

function calculateEmi(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0
  if (monthlyRate === 0) return principal / months

  const growth = Math.pow(1 + monthlyRate, months)
  return (principal * monthlyRate * growth) / (growth - 1)
}

/**
 * Evaluate home-loan balance transfer economics with net savings and break-even.
 */
export function calculateHomeLoanBalanceTransfer(
  input: HomeLoanBalanceTransferInput
): HomeLoanBalanceTransferResult {
  const outstandingPrincipal = Math.max(0, input.outstandingPrincipal)
  const currentInterestRate = Math.max(0, input.currentInterestRate)
  const remainingTenureYears = Math.max(0, input.remainingTenureYears)
  const newInterestRate = Math.max(0, input.newInterestRate)
  const processingFeePercent = Math.max(0, input.processingFeePercent)
  const processingFeeFlat = Math.max(0, input.processingFeeFlat)
  const otherTransferCosts = Math.max(0, input.otherTransferCosts)

  const months = Math.max(1, Math.round(remainingTenureYears * 12))

  if (outstandingPrincipal <= 0) {
    return {
      currentEmi: 0,
      newEmi: 0,
      monthlyEmiSaving: 0,
      currentTotalInterest: 0,
      newTotalInterest: 0,
      grossInterestSaved: 0,
      transferCost: 0,
      netSavings: 0,
      breakEvenMonths: null,
      recommendation: "not_recommended",
    }
  }

  const currentMonthlyRate = toMonthlyRate(currentInterestRate)
  const newMonthlyRate = toMonthlyRate(newInterestRate)

  const currentEmi = calculateEmi(
    outstandingPrincipal,
    currentMonthlyRate,
    months
  )
  const newEmi = calculateEmi(outstandingPrincipal, newMonthlyRate, months)

  const currentTotalPayment = currentEmi * months
  const newTotalPayment = newEmi * months

  const currentTotalInterest = Math.max(
    0,
    currentTotalPayment - outstandingPrincipal
  )
  const newTotalInterest = Math.max(0, newTotalPayment - outstandingPrincipal)

  const grossInterestSaved = Math.max(
    0,
    currentTotalInterest - newTotalInterest
  )

  const processingFeeFromPercent =
    outstandingPrincipal * (processingFeePercent / 100)
  const transferCost =
    processingFeeFromPercent + processingFeeFlat + otherTransferCosts

  const netSavings = grossInterestSaved - transferCost
  const monthlyEmiSaving = currentEmi - newEmi

  let breakEvenMonths: number | null = null
  if (monthlyEmiSaving > 0 && transferCost > 0) {
    breakEvenMonths = Math.ceil(transferCost / monthlyEmiSaving)
  }

  const recommendation =
    netSavings > 0 && (breakEvenMonths === null || breakEvenMonths <= months)
      ? "recommended"
      : "not_recommended"

  return {
    currentEmi: round(currentEmi),
    newEmi: round(newEmi),
    monthlyEmiSaving: round(monthlyEmiSaving),
    currentTotalInterest: round(currentTotalInterest),
    newTotalInterest: round(newTotalInterest),
    grossInterestSaved: round(grossInterestSaved),
    transferCost: round(transferCost),
    netSavings: round(netSavings),
    breakEvenMonths,
    recommendation,
  }
}
