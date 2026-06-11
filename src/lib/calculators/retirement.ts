export interface RetirementInput {
  currentAge: number
  retirementAge: number
  monthlyInvestment: number
}

export interface RetirementResult {
  totalInvested: number
  tenureYears: number

  // PPF
  ppfCorpus: number
  ppfTotalInvested: number

  // EPF
  epfCorpus: number

  // NPS
  npsCorpus: number
  npsLumpsum: number // 60%
  npsAnnuity: number // 40%
}

/**
 * Calculates compound interest for regular monthly contributions
 */
function calculateFutureValue(
  monthlyAmount: number,
  annualRate: number,
  tenureYears: number,
  compoundFrequency: "yearly" | "monthly"
): number {
  if (tenureYears <= 0) return 0

  if (compoundFrequency === "yearly") {
    // PPF compounds yearly but investments are made monthly.
    // We approximate by treating total yearly investment at an average mid-year compounding or just standard FV.
    // For simplicity, standard formula: FV = P * (((1 + r)^n - 1) / r)
    const yearlyAmount = monthlyAmount * 12
    const r = annualRate / 100
    let balance = 0
    for (let i = 0; i < tenureYears; i++) {
      balance = (balance + yearlyAmount) * (1 + r)
    }
    return balance
  } else {
    // Monthly compounding (EPF, NPS approx)
    const months = tenureYears * 12
    const r = annualRate / 12 / 100
    return monthlyAmount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
  }
}

/**
 * Compare NPS vs EPF vs PPF maturity values
 */
export function calculateRetirement(input: RetirementInput): RetirementResult {
  const { currentAge, retirementAge, monthlyInvestment } = input
  const tenureYears = Math.max(0, retirementAge - currentAge)
  const totalInvested = monthlyInvestment * 12 * tenureYears

  // PPF: 7.1% (capped at 1.5L/year)
  // Note: PPF has a strict 15-year maturity, extendable in blocks of 5 years.
  let ppfTenure = tenureYears
  if (tenureYears > 0 && tenureYears < 15) {
    ppfTenure = 15
  } else if (tenureYears > 15) {
    ppfTenure = 15 + Math.ceil((tenureYears - 15) / 5) * 5
  }

  const ppfMaxMonthly = 150000 / 12
  const actualPpfMonthly = Math.min(monthlyInvestment, ppfMaxMonthly)
  const ppfTotalInvested = actualPpfMonthly * 12 * ppfTenure
  const ppfCorpus = calculateFutureValue(
    actualPpfMonthly,
    7.1,
    ppfTenure,
    "yearly"
  )

  // EPF: 8.25% (assuming purely employee side for 1:1 comparison)
  const epfCorpus = calculateFutureValue(
    monthlyInvestment,
    8.25,
    tenureYears,
    "monthly"
  )

  // NPS: 10% expected return (Tier 1 equity/corporate blend)
  const npsCorpus = calculateFutureValue(
    monthlyInvestment,
    10.0,
    tenureYears,
    "monthly"
  )

  // NPS specific rules: 60% tax-free lumpsum, 40% mandatory annuity
  const npsLumpsum = npsCorpus * 0.6
  const npsAnnuity = npsCorpus * 0.4

  return {
    totalInvested: Math.round(totalInvested),
    tenureYears,
    ppfCorpus: Math.round(ppfCorpus),
    ppfTotalInvested: Math.round(ppfTotalInvested),
    epfCorpus: Math.round(epfCorpus),
    npsCorpus: Math.round(npsCorpus),
    npsLumpsum: Math.round(npsLumpsum),
    npsAnnuity: Math.round(npsAnnuity),
  }
}
