export interface YearlyProjection {
  year: number
  invested: number
  returns: number
  corpus: number
}

// --- Step-Up SIP ---
export interface StepUpSipInput {
  initialMonthlyInvestment: number
  expectedReturnRate: number
  stepUpPercentage: number
  tenureYears: number
}

export interface StepUpSipResult {
  totalInvested: number
  estimatedReturns: number
  totalCorpus: number
  schedule: Array<YearlyProjection>
}

export function calculateStepUpSip(input: StepUpSipInput): StepUpSipResult {
  const {
    initialMonthlyInvestment,
    expectedReturnRate,
    stepUpPercentage,
    tenureYears,
  } = input
  const monthlyRate = expectedReturnRate / 12 / 100

  let currentMonthly = initialMonthlyInvestment
  let totalInvested = 0
  let currentCorpus = 0
  const schedule: Array<YearlyProjection> = []

  for (let year = 1; year <= tenureYears; year++) {
    for (let month = 1; month <= 12; month++) {
      totalInvested += currentMonthly
      if (monthlyRate === 0) {
        currentCorpus += currentMonthly
      } else {
        currentCorpus = (currentCorpus + currentMonthly) * (1 + monthlyRate)
      }
    }

    schedule.push({
      year,
      invested: Math.round(totalInvested),
      returns: Math.round(Math.max(0, currentCorpus - totalInvested)),
      corpus: Math.round(currentCorpus),
    })

    currentMonthly += currentMonthly * (stepUpPercentage / 100)
  }

  const totalCorpus = Math.round(currentCorpus)
  const estimatedReturns = Math.max(0, totalCorpus - totalInvested)

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(estimatedReturns),
    totalCorpus,
    schedule,
  }
}

// --- Lump Sum ---
export interface LumpSumInput {
  principal: number
  expectedReturnRate: number
  tenureYears: number
}

export function calculateLumpSum(input: LumpSumInput): StepUpSipResult {
  const { principal, expectedReturnRate, tenureYears } = input
  const r = expectedReturnRate / 100

  const schedule: Array<YearlyProjection> = []
  for (let year = 1; year <= tenureYears; year++) {
    const corpus = principal * Math.pow(1 + r, year)
    schedule.push({
      year,
      invested: principal,
      returns: Math.round(Math.max(0, corpus - principal)),
      corpus: Math.round(corpus),
    })
  }

  const totalCorpus = Math.round(principal * Math.pow(1 + r, tenureYears))
  return {
    totalInvested: principal,
    estimatedReturns: Math.max(0, totalCorpus - principal),
    totalCorpus,
    schedule,
  }
}

// --- Fixed Deposit (FD) ---
export interface FdInput {
  principal: number
  interestRate: number
  tenureYears: number
  compoundingFrequency: 1 | 2 | 4 | 12 // Yearly, Half-Yearly, Quarterly, Monthly
}

export function calculateFD(input: FdInput): StepUpSipResult {
  const { principal, interestRate, tenureYears, compoundingFrequency } = input
  const r = interestRate / 100
  const n = compoundingFrequency

  const schedule: Array<YearlyProjection> = []
  for (let year = 1; year <= tenureYears; year++) {
    const corpus = principal * Math.pow(1 + r / n, n * year)
    schedule.push({
      year,
      invested: principal,
      returns: Math.round(Math.max(0, corpus - principal)),
      corpus: Math.round(corpus),
    })
  }

  const totalCorpus = Math.round(
    principal * Math.pow(1 + r / n, n * tenureYears)
  )
  return {
    totalInvested: principal,
    estimatedReturns: Math.max(0, totalCorpus - principal),
    totalCorpus,
    schedule,
  }
}

// --- Recurring Deposit (RD) ---
export interface RdInput {
  monthlyDeposit: number
  interestRate: number
  tenureYears: number
}

export function calculateRD(input: RdInput): StepUpSipResult {
  const { monthlyDeposit, interestRate, tenureYears } = input
  const r = interestRate / 100
  const totalMonths = tenureYears * 12

  let totalInvested = 0
  let totalCorpus = 0
  const schedule: Array<YearlyProjection> = []

  // RD formula: M = R * [(1+i)^n - 1] / [1 - (1+i)^(-1/3)] where i = r/400 (quarterly rate)
  // But a simple loop simulating quarterly compounding on monthly deposits is more accurate for schedule.

  let currentBalance = 0
  let quarterlyInterest = 0

  for (let month = 1; month <= totalMonths; month++) {
    currentBalance += monthlyDeposit
    totalInvested += monthlyDeposit

    // Accrue interest monthly, compound quarterly
    quarterlyInterest += currentBalance * (r / 12)

    if (month % 3 === 0) {
      currentBalance += quarterlyInterest
      quarterlyInterest = 0
    }

    if (month % 12 === 0) {
      schedule.push({
        year: month / 12,
        invested: Math.round(totalInvested),
        returns: Math.round(
          Math.max(0, currentBalance + quarterlyInterest - totalInvested)
        ),
        corpus: Math.round(currentBalance + quarterlyInterest),
      })
    }
  }

  totalCorpus = Math.round(currentBalance + quarterlyInterest)

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.max(0, totalCorpus - totalInvested),
    totalCorpus,
    schedule,
  }
}
