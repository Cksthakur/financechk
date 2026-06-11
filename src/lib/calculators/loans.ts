export interface LoanInput {
  principalAmount: number
  interestRate: number
  tenureYears: number
  tenureMonths: number
}

export interface LoanAmortizationRow {
  month: number
  year: number
  principal: number
  interest: number
  balance: number
}

export interface LoanResult {
  emi: number
  totalInterest: number
  totalPayment: number
  schedule: Array<LoanAmortizationRow>
}

/**
 * Calculates standard EMI and amortization schedule (applicable for Car Loans, Personal Loans, etc.)
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const { principalAmount, interestRate, tenureYears, tenureMonths } = input
  const totalMonths = tenureYears * 12 + tenureMonths
  const monthlyRate = interestRate / 12 / 100

  let emi = 0
  if (monthlyRate > 0) {
    emi =
      (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  } else {
    emi = principalAmount / totalMonths
  }

  let balance = principalAmount
  let totalInterest = 0
  const schedule: Array<LoanAmortizationRow> = []

  if (principalAmount <= 0) {
    return {
      emi: 0,
      totalInterest: 0,
      totalPayment: 0,
      schedule: [],
    }
  }

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate
    let principalPaid = emi - interest

    // Final month adjustment
    if (principalPaid >= balance || month === totalMonths) {
      principalPaid = balance
    }

    balance -= principalPaid
    totalInterest += interest

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      principal: principalPaid,
      interest,
      balance: Math.max(0, balance),
    })

    if (balance <= 0) break
  }

  const totalPayment = principalAmount + totalInterest

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    schedule: schedule.map((s) => ({
      ...s,
      principal: Math.round(s.principal),
      interest: Math.round(s.interest),
      balance: Math.round(s.balance),
    })),
  }
}
