export interface SwpInput {
  initialCorpus: number
  monthlyWithdrawal: number
  expectedReturnRate: number
  tenureYears: number
  inflationRate?: number
}

export interface SwpRow {
  month: number
  year: number
  balance: number
  totalWithdrawn: number
  interestEarned: number
  withdrawn: number
}

export interface SwpResult {
  totalWithdrawn: number
  finalCorpus: number
  depletedAtMonth: number | null
  schedule: Array<SwpRow>
  breakEvenAnnualReturnRate: number
  inflationAdjustedFinalMonthlyWithdrawal: number
  estimatedLtcgTaxOnWithdrawals: number
}

/**
 * Calculates a Systematic Withdrawal Plan (SWP) projection
 */
export function calculateSWP(input: SwpInput): SwpResult {
  const {
    initialCorpus,
    monthlyWithdrawal,
    expectedReturnRate,
    tenureYears,
    inflationRate = 0,
  } = input
  const totalMonths = tenureYears * 12
  const monthlyRate = expectedReturnRate / 12 / 100

  let currentBalance = initialCorpus
  let totalWithdrawn = 0
  let depletedAtMonth: number | null = null
  const schedule: Array<SwpRow> = []

  // Always push year 0 (starting point)
  schedule.push({
    month: 0,
    year: 0,
    balance: currentBalance,
    totalWithdrawn: 0,
    interestEarned: 0,
    withdrawn: 0,
  })

  if (initialCorpus === 0) {
    return {
      totalWithdrawn: 0,
      finalCorpus: 0,
      depletedAtMonth: 0,
      breakEvenAnnualReturnRate: 0,
      inflationAdjustedFinalMonthlyWithdrawal: 0,
      estimatedLtcgTaxOnWithdrawals: 0,
      schedule: [
        {
          month: 0,
          year: 0,
          balance: 0,
          totalWithdrawn: 0,
          interestEarned: 0,
          withdrawn: 0,
        },
      ],
    }
  }

  let runningYearInterest = 0
  let runningYearWithdrawn = 0

  for (let month = 1; month <= totalMonths; month++) {
    // 1. Earn returns on current balance
    const returns = currentBalance * monthlyRate
    currentBalance += returns
    runningYearInterest += returns

    // 2. Process withdrawal
    if (currentBalance >= monthlyWithdrawal) {
      currentBalance -= monthlyWithdrawal
      totalWithdrawn += monthlyWithdrawal
      runningYearWithdrawn += monthlyWithdrawal
    } else {
      // Balance is depleted
      totalWithdrawn += currentBalance // Withdraw whatever is left
      runningYearWithdrawn += currentBalance
      currentBalance = 0
    }

    if (currentBalance <= 0 && depletedAtMonth === null) {
      depletedAtMonth = month
    }

    // Save snapshot every year or at depletion
    if (month % 12 === 0 || currentBalance === 0) {
      schedule.push({
        month,
        year: Math.ceil(month / 12),
        balance: Math.round(currentBalance),
        totalWithdrawn: Math.round(totalWithdrawn),
        interestEarned: Math.round(runningYearInterest),
        withdrawn: Math.round(runningYearWithdrawn),
      })

      runningYearInterest = 0
      runningYearWithdrawn = 0
    }

    if (currentBalance === 0) {
      break
    }
  }

  // If the loop finished without depletion but not exactly on a year boundary, ensure the last month is in the schedule
  if (currentBalance > 0 && totalMonths % 12 !== 0) {
    schedule.push({
      month: totalMonths,
      year: Math.ceil(totalMonths / 12),
      balance: Math.round(currentBalance),
      totalWithdrawn: Math.round(totalWithdrawn),
      interestEarned: Math.round(runningYearInterest),
      withdrawn: Math.round(runningYearWithdrawn),
    })
  }

  const breakEvenAnnualReturnRate =
    initialCorpus > 0 ? (monthlyWithdrawal * 12 * 100) / initialCorpus : 0

  const totalValueGenerated = totalWithdrawn + currentBalance
  const grossGain = Math.max(0, totalValueGenerated - initialCorpus)
  const realizedGainApprox =
    totalValueGenerated > 0
      ? grossGain * (totalWithdrawn / totalValueGenerated)
      : 0
  const annualLtcgExemption = 125000
  const exemptionTotal =
    annualLtcgExemption * Math.max(1, Math.ceil(totalMonths / 12))
  const estimatedLtcgTaxOnWithdrawals = Math.max(
    0,
    (realizedGainApprox - exemptionTotal) * 0.125
  )

  const inflationAdjustedFinalMonthlyWithdrawal =
    inflationRate > 0
      ? Math.round(
          monthlyWithdrawal / Math.pow(1 + inflationRate / 100, tenureYears)
        )
      : Math.round(monthlyWithdrawal)

  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    finalCorpus: Math.round(currentBalance),
    depletedAtMonth,
    schedule,
    breakEvenAnnualReturnRate: Number(breakEvenAnnualReturnRate.toFixed(2)),
    inflationAdjustedFinalMonthlyWithdrawal,
    estimatedLtcgTaxOnWithdrawals: Math.round(estimatedLtcgTaxOnWithdrawals),
  }
}
