export interface SsyInput {
  daughterAgeYears: number
  annualDeposit: number
  annualInterestRate: number
  taxRatePercent: number
}

export interface SsyYearRow {
  yearNumber: number
  daughterAge: number
  deposit: number
  interest: number
  balance: number
}

export interface SsyResult {
  depositYears: number
  maturityAge: number
  maturityYearsRemaining: number
  totalDeposits: number
  totalInterest: number
  maturityAmount: number
  annual80cDeduction: number
  annualTaxSaved: number
  schedule: Array<SsyYearRow>
}

function round(value: number): number {
  return Math.round(value)
}

/**
 * Calculate Sukanya Samriddhi Yojana maturity projection (deposit for 15 years, maturity at age 21).
 */
export function calculateSsy(input: SsyInput): SsyResult {
  const daughterAgeYears = Math.max(0, Math.floor(input.daughterAgeYears))
  const annualDeposit = Math.max(0, Math.min(input.annualDeposit, 150000))
  const annualInterestRate = Math.max(0, input.annualInterestRate)
  const taxRatePercent = Math.max(0, Math.min(input.taxRatePercent, 30))

  const maturityAge = 21
  const maturityYearsRemaining = Math.max(0, maturityAge - daughterAgeYears)
  const depositYears = Math.min(15, maturityYearsRemaining)

  const rate = annualInterestRate / 100

  let balance = 0
  let totalDeposits = 0
  const schedule: Array<SsyYearRow> = []

  for (
    let yearNumber = 1;
    yearNumber <= maturityYearsRemaining;
    yearNumber += 1
  ) {
    const daughterAge = daughterAgeYears + yearNumber
    const deposit = yearNumber <= depositYears ? annualDeposit : 0
    totalDeposits += deposit
    balance += deposit

    const interest = balance * rate
    balance += interest

    schedule.push({
      yearNumber,
      daughterAge,
      deposit: round(deposit),
      interest: round(interest),
      balance: round(balance),
    })
  }

  const maturityAmount = round(balance)
  const totalInterest = Math.max(0, maturityAmount - round(totalDeposits))
  const annual80cDeduction = round(Math.min(annualDeposit, 150000))
  const annualTaxSaved = round(annual80cDeduction * (taxRatePercent / 100))

  return {
    depositYears,
    maturityAge,
    maturityYearsRemaining,
    totalDeposits: round(totalDeposits),
    totalInterest,
    maturityAmount,
    annual80cDeduction,
    annualTaxSaved,
    schedule,
  }
}
