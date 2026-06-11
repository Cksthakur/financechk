export interface PPFInput {
  monthlyContribution: number
  currentBalance: number
  annualRate: number
  years: number
}

export interface PPFResult {
  totalContributions: number
  totalInterest: number
  maturityAmount: number
  yearlyBreakdown: Array<{
    year: number
    contributions: number
    interest: number
    balance: number
  }>
}

export function calculatePPF(input: PPFInput): PPFResult {
  const { monthlyContribution, currentBalance, annualRate, years } = input
  const yearlyContribution = monthlyContribution * 12
  const yearlyRate = annualRate / 100

  const yearlyBreakdown = []
  let balance = currentBalance

  for (let year = 1; year <= years; year++) {
    balance += yearlyContribution
    const interest = balance * yearlyRate
    balance += interest

    yearlyBreakdown.push({
      year,
      contributions: yearlyContribution * year,
      interest: Math.round(
        balance - currentBalance - yearlyContribution * year
      ),
      balance: Math.round(balance),
    })
  }

  const totalContributions = currentBalance + yearlyContribution * years
  const totalInterest = balance - totalContributions

  return {
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    yearlyBreakdown,
  }
}
