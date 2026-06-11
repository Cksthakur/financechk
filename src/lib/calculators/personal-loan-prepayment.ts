import { calculateLoan } from "./loans"

export interface PersonalLoanPrepaymentInput {
  principalAmount: number
  interestRate: number
  tenureYears: number
  tenureMonths: number
  extraMonthlyPrepayment: number
  oneTimePrepayment: number
  oneTimePrepaymentMonth: number
}

export interface PersonalLoanPrepaymentResult {
  emi: number
  baseTenureMonths: number
  newTenureMonths: number
  tenureSavedMonths: number
  baseTotalInterest: number
  prepaymentTotalInterest: number
  interestSaved: number
  baseTotalPayment: number
  prepaymentTotalPayment: number
  totalPrepaymentAmount: number
  schedule: Array<{
    month: number
    year: number
    payment: number
    principal: number
    interest: number
    balance: number
  }>
}

function calculateEmi(
  principal: number,
  annualRate: number,
  totalMonths: number
): number {
  if (principal <= 0 || totalMonths <= 0) return 0
  const monthlyRate = annualRate / 12 / 100
  if (monthlyRate === 0) return principal / totalMonths
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  )
}

/**
 * Compare regular personal loan repayment vs prepayment strategy.
 */
export function calculatePersonalLoanPrepayment(
  input: PersonalLoanPrepaymentInput
): PersonalLoanPrepaymentResult {
  const principalAmount = Math.max(0, input.principalAmount)
  const interestRate = Math.max(0, input.interestRate)
  const tenureYears = Math.max(0, Math.round(input.tenureYears))
  const tenureMonths = Math.max(0, Math.round(input.tenureMonths))
  const extraMonthlyPrepayment = Math.max(0, input.extraMonthlyPrepayment)
  const oneTimePrepayment = Math.max(0, input.oneTimePrepayment)

  const baseTenureMonths = tenureYears * 12 + tenureMonths
  const boundedOneTimeMonth = Math.max(
    1,
    Math.min(
      baseTenureMonths || 1,
      Math.round(input.oneTimePrepaymentMonth || 1)
    )
  )

  if (principalAmount <= 0 || baseTenureMonths <= 0) {
    return {
      emi: 0,
      baseTenureMonths,
      newTenureMonths: 0,
      tenureSavedMonths: 0,
      baseTotalInterest: 0,
      prepaymentTotalInterest: 0,
      interestSaved: 0,
      baseTotalPayment: 0,
      prepaymentTotalPayment: 0,
      totalPrepaymentAmount: 0,
      schedule: [],
    }
  }

  const baseResult = calculateLoan({
    principalAmount,
    interestRate,
    tenureYears,
    tenureMonths,
  })

  const emi = calculateEmi(principalAmount, interestRate, baseTenureMonths)
  const monthlyRate = interestRate / 12 / 100

  let balance = principalAmount
  let month = 0
  let prepaymentTotalInterest = 0
  let prepaymentTotalPayment = 0
  let totalPrepaymentAmount = 0
  const schedule: PersonalLoanPrepaymentResult["schedule"] = []

  while (balance > 0 && month < baseTenureMonths * 2) {
    month += 1
    const interest = balance * monthlyRate
    const oneTime = month === boundedOneTimeMonth ? oneTimePrepayment : 0
    const plannedPayment = emi + extraMonthlyPrepayment + oneTime
    let principalPaid = plannedPayment - interest

    if (principalPaid <= 0) {
      principalPaid = 0
    }

    if (principalPaid >= balance) {
      principalPaid = balance
    }

    const totalPaymentThisMonth = interest + principalPaid
    balance = Math.max(0, balance - principalPaid)

    const actualPrepayment = Math.max(0, totalPaymentThisMonth - emi)
    totalPrepaymentAmount += actualPrepayment
    prepaymentTotalInterest += interest
    prepaymentTotalPayment += totalPaymentThisMonth

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment: Math.round(totalPaymentThisMonth),
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      balance: Math.round(balance),
    })
  }

  const newTenureMonths = schedule.length
  const interestSaved = Math.max(
    0,
    baseResult.totalInterest - prepaymentTotalInterest
  )

  return {
    emi: Math.round(emi),
    baseTenureMonths,
    newTenureMonths,
    tenureSavedMonths: Math.max(0, baseTenureMonths - newTenureMonths),
    baseTotalInterest: baseResult.totalInterest,
    prepaymentTotalInterest: Math.round(prepaymentTotalInterest),
    interestSaved: Math.round(interestSaved),
    baseTotalPayment: baseResult.totalPayment,
    prepaymentTotalPayment: Math.round(prepaymentTotalPayment),
    totalPrepaymentAmount: Math.round(totalPrepaymentAmount),
    schedule,
  }
}
