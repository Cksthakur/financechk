export interface HomeLoanInput {
  monthlySalary: number
  existingEMI: number
  interestRate: number
  tenureYears: number
  employerType: "salaried-private" | "salaried-govt" | "self-employed"
}

export interface AmortizationRow {
  month: number
  year: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface HomeLoanResult {
  maxLoanAmount: number
  recommendedEMI: number
  totalInterest: number
  totalPayment: number
  emiPerLakh: number
  schedule: Array<AmortizationRow>
}

/**
 * Calculate EMI per lakh for given rate and tenure
 */
function emiPerLakh(annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100
  if (r === 0) return 100000 / tenureMonths
  return (
    (100000 * r * Math.pow(1 + r, tenureMonths)) /
    (Math.pow(1 + r, tenureMonths) - 1)
  )
}

/**
 * Generate the full amortization schedule for the loan
 */
function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  emi: number
): Array<AmortizationRow> {
  if (principal <= 0) return []

  const schedule: Array<AmortizationRow> = []
  let balance = principal
  const monthlyRate = annualRate / 12 / 100

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate
    let principalPaid = emi - interest

    // Adjust final payment to exactly zero out the balance
    if (month === tenureMonths || balance - principalPaid < 0) {
      principalPaid = balance
    }

    balance -= principalPaid

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment: principalPaid + interest,
      principal: principalPaid,
      interest,
      balance: Math.max(0, balance),
    })

    if (balance <= 0) break
  }

  return schedule
}

/**
 * FOIR (Fixed Obligation to Income Ratio) by employer type
 */
function getFOIR(employerType: HomeLoanInput["employerType"]): number {
  switch (employerType) {
    case "salaried-govt":
      return 0.6
    case "salaried-private":
      return 0.55
    case "self-employed":
      return 0.5
    default:
      return 0.5
  }
}

/**
 * Calculate home loan eligibility based on salary
 */
export function calculateHomeLoan(input: HomeLoanInput): HomeLoanResult {
  const {
    monthlySalary,
    existingEMI,
    interestRate,
    tenureYears,
    employerType,
  } = input
  const tenureMonths = tenureYears * 12
  const foir = getFOIR(employerType)

  // Max EMI the person can afford
  const maxEMI = monthlySalary * foir - existingEMI
  const recommendedEMI = Math.max(0, maxEMI)

  // EMI per lakh at given rate and tenure
  const emiPL = emiPerLakh(interestRate, tenureMonths)

  // Max loan = (affordable EMI / EMI per lakh) * 1 lakh
  // Use higher precision before rounding for the final object
  const maxLoanAmountRaw = (recommendedEMI / emiPL) * 100000
  const maxLoanAmount = Math.max(0, Math.round(maxLoanAmountRaw))

  // Total payment and interest
  const totalPayment = Math.round(recommendedEMI * tenureMonths)
  const totalInterest = Math.max(0, totalPayment - maxLoanAmount)

  // Generate schedule
  const schedule = generateAmortizationSchedule(
    maxLoanAmountRaw, // Use raw for higher precision schedule
    interestRate,
    tenureMonths,
    recommendedEMI
  )

  return {
    maxLoanAmount,
    recommendedEMI: Math.round(recommendedEMI),
    totalInterest,
    totalPayment,
    emiPerLakh: Math.round(emiPL),
    schedule,
  }
}
