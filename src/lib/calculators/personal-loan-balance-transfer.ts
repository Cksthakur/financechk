export interface PersonalLoanBalanceTransferInput {
  outstandingPrincipal: number
  currentInterestRate: number
  remainingTenureMonths: number
  newInterestRate: number
  newTenureMonths: number
  processingFeePercent: number
  foreclosureChargePercent: number
  otherCharges: number
}

export interface PersonalLoanBalanceTransferResult {
  currentEmi: number
  newEmi: number
  currentTotalInterest: number
  newTotalInterest: number
  transferCharges: number
  currentTotalCost: number
  newTotalCost: number
  netSavings: number
  monthlyEmiReduction: number
  breakEvenMonths: number | null
}

function calculateEmi(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0
  const monthlyRate = annualRate / 12 / 100
  if (monthlyRate === 0) return principal / tenureMonths
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  )
}

/**
 * Evaluate whether moving a personal loan to a lower rate is beneficial.
 */
export function calculatePersonalLoanBalanceTransfer(
  input: PersonalLoanBalanceTransferInput
): PersonalLoanBalanceTransferResult {
  const outstandingPrincipal = Math.max(0, input.outstandingPrincipal)
  const currentInterestRate = Math.max(0, input.currentInterestRate)
  const remainingTenureMonths = Math.max(
    1,
    Math.round(input.remainingTenureMonths)
  )
  const newInterestRate = Math.max(0, input.newInterestRate)
  const newTenureMonths = Math.max(1, Math.round(input.newTenureMonths))
  const processingFeePercent = Math.max(0, input.processingFeePercent)
  const foreclosureChargePercent = Math.max(0, input.foreclosureChargePercent)
  const otherCharges = Math.max(0, input.otherCharges)

  if (outstandingPrincipal <= 0) {
    return {
      currentEmi: 0,
      newEmi: 0,
      currentTotalInterest: 0,
      newTotalInterest: 0,
      transferCharges: 0,
      currentTotalCost: 0,
      newTotalCost: 0,
      netSavings: 0,
      monthlyEmiReduction: 0,
      breakEvenMonths: null,
    }
  }

  const currentEmi = calculateEmi(
    outstandingPrincipal,
    currentInterestRate,
    remainingTenureMonths
  )
  const currentTotalCost = currentEmi * remainingTenureMonths
  const currentTotalInterest = Math.max(
    0,
    currentTotalCost - outstandingPrincipal
  )

  const processingFee = outstandingPrincipal * (processingFeePercent / 100)
  const foreclosureCharge =
    outstandingPrincipal * (foreclosureChargePercent / 100)
  const transferCharges = processingFee + foreclosureCharge + otherCharges

  const newPrincipal = outstandingPrincipal + transferCharges
  const newEmi = calculateEmi(newPrincipal, newInterestRate, newTenureMonths)
  const newTotalCost = newEmi * newTenureMonths
  const newTotalInterest = Math.max(0, newTotalCost - newPrincipal)

  const netSavings = currentTotalCost - newTotalCost
  const monthlyEmiReduction = currentEmi - newEmi

  let breakEvenMonths: number | null = null
  if (monthlyEmiReduction > 0 && transferCharges > 0) {
    breakEvenMonths = Math.ceil(transferCharges / monthlyEmiReduction)
  }

  return {
    currentEmi: Math.round(currentEmi),
    newEmi: Math.round(newEmi),
    currentTotalInterest: Math.round(currentTotalInterest),
    newTotalInterest: Math.round(newTotalInterest),
    transferCharges: Math.round(transferCharges),
    currentTotalCost: Math.round(currentTotalCost),
    newTotalCost: Math.round(newTotalCost),
    netSavings: Math.round(netSavings),
    monthlyEmiReduction: Math.round(monthlyEmiReduction),
    breakEvenMonths,
  }
}
