export interface ElssInput {
  monthlyInvestment: number
  expectedReturnRate: number
  tenureYears: number
  taxBracket: number
}

export interface ElssScheduleRow {
  year: number
  invested: number
  marketGain: number
  corpus: number
  taxSaved: number
}

export interface ElssResult {
  totalInvested: number
  totalCorpus: number
  marketGains: number
  annualTaxSaved: number
  totalTaxSaved: number
  effectiveNetInvestment: number
  wealthOverEffectiveCost: number
  schedule: Array<ElssScheduleRow>
}

/**
 * ELSS calculator with SIP growth and Section 80C tax savings.
 */
export function calculateElss(input: ElssInput): ElssResult {
  const monthlyInvestment = Math.max(0, input.monthlyInvestment)
  const expectedReturnRate = Math.max(0, input.expectedReturnRate)
  const tenureYears = Math.max(1, Math.round(input.tenureYears))
  const taxBracket = Math.max(0, Math.min(30, input.taxBracket))

  const totalMonths = tenureYears * 12
  const monthlyRate = expectedReturnRate / 12 / 100

  const annualInvested = monthlyInvestment * 12
  const annualTaxSaved = Math.round(
    Math.min(150000, annualInvested) * (taxBracket / 100)
  )

  let invested = 0
  let corpus = 0
  const schedule: Array<ElssScheduleRow> = []

  for (let month = 1; month <= totalMonths; month++) {
    invested += monthlyInvestment
    if (monthlyRate === 0) {
      corpus += monthlyInvestment
    } else {
      corpus = (corpus + monthlyInvestment) * (1 + monthlyRate)
    }

    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.ceil(month / 12)
      schedule.push({
        year,
        invested: Math.round(invested),
        marketGain: Math.round(Math.max(0, corpus - invested)),
        corpus: Math.round(corpus),
        taxSaved: annualTaxSaved * year,
      })
    }
  }

  const totalInvested = monthlyInvestment * totalMonths
  const totalCorpus = Math.round(corpus)
  const marketGains = Math.max(0, totalCorpus - totalInvested)
  const totalTaxSaved = annualTaxSaved * tenureYears
  const effectiveNetInvestment = Math.max(0, totalInvested - totalTaxSaved)

  return {
    totalInvested,
    totalCorpus,
    marketGains,
    annualTaxSaved,
    totalTaxSaved,
    effectiveNetInvestment,
    wealthOverEffectiveCost: Math.round(totalCorpus - effectiveNetInvestment),
    schedule,
  }
}
