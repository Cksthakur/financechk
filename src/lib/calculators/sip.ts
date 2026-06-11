export interface SIPInput {
  monthlyInvestment: number
  expectedReturnRate: number
  tenureYears: number
}

export interface SIPRow {
  month: number
  year: number
  invested: number
  returns: number
  corpus: number
}

export interface SIPResult {
  totalInvested: number
  estimatedReturns: number
  totalCorpus: number
  schedule: Array<SIPRow>
}

/**
 * Calculate SIP maturity using compound interest formula
 * FV = P * [(1+r)^n - 1] / r * (1+r)
 */
export function calculateSIP(input: SIPInput): SIPResult {
  const { monthlyInvestment, expectedReturnRate, tenureYears } = input
  const months = tenureYears * 12
  const monthlyRate = expectedReturnRate / 12 / 100
  const totalInvested = monthlyInvestment * months

  const schedule: Array<SIPRow> = []
  let currentCorpus = 0
  let currentInvested = 0

  for (let month = 1; month <= months; month++) {
    currentInvested += monthlyInvestment
    if (monthlyRate === 0) {
      currentCorpus += monthlyInvestment
    } else {
      currentCorpus = (currentCorpus + monthlyInvestment) * (1 + monthlyRate)
    }

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      invested: currentInvested,
      returns: Math.max(0, currentCorpus - currentInvested),
      corpus: currentCorpus,
    })
  }

  const totalCorpus = Math.round(currentCorpus)
  const estimatedReturns = totalCorpus - totalInvested

  return {
    totalInvested,
    estimatedReturns,
    totalCorpus,
    schedule,
  }
}
