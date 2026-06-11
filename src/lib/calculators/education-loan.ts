export interface EducationLoanInput {
  loanAmount: number
  annualInterestRate: number
  moratoriumMonths: number
  repaymentTenureYears: number
  annualIncome: number
  taxRegime: "old" | "new"
}

export interface EducationLoanYearRow {
  year: number
  openingBalance: number
  principalPaid: number
  interestPaid: number
  closingBalance: number
  section80eEligibleInterest: number
  taxSaved: number
}

export interface EducationLoanResult {
  principalAtRepaymentStart: number
  emi: number
  totalInterestPaid: number
  totalPayment: number
  totalSection80eDeduction: number
  totalTaxSaved: number
  effectiveNetInterestRate: number
  schedule: Array<EducationLoanYearRow>
}

function getApproxMarginalRate(annualIncome: number): number {
  const income = Math.max(0, annualIncome)

  if (income <= 300000) return 0
  if (income <= 700000) return 5
  if (income <= 1000000) return 10
  if (income <= 1200000) return 15
  if (income <= 1500000) return 20
  return 30
}

function round(value: number): number {
  return Math.round(value)
}

function calculateEmi(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0
  if (monthlyRate === 0) return principal / months

  const growth = Math.pow(1 + monthlyRate, months)
  return (principal * monthlyRate * growth) / (growth - 1)
}

/**
 * Calculate education-loan EMI, moratorium accrual and Section 80E tax benefit.
 */
export function calculateEducationLoan(
  input: EducationLoanInput
): EducationLoanResult {
  const loanAmount = Math.max(0, input.loanAmount)
  const annualInterestRate = Math.max(0, input.annualInterestRate)
  const moratoriumMonths = Math.max(0, Math.round(input.moratoriumMonths))
  const repaymentTenureYears = Math.max(
    1,
    Math.round(input.repaymentTenureYears)
  )
  const annualIncome = Math.max(0, input.annualIncome)

  const monthlyRate = annualInterestRate / 12 / 100
  const repaymentMonths = repaymentTenureYears * 12

  const principalAtRepaymentStart =
    monthlyRate === 0
      ? loanAmount
      : loanAmount * Math.pow(1 + monthlyRate, moratoriumMonths)

  const emi = calculateEmi(
    principalAtRepaymentStart,
    monthlyRate,
    repaymentMonths
  )
  const marginalRate = getApproxMarginalRate(annualIncome)

  let balance = principalAtRepaymentStart
  let totalInterestPaid = 0
  const schedule: Array<EducationLoanYearRow> = []

  for (let year = 1; year <= repaymentTenureYears; year += 1) {
    const openingBalance = balance
    let yearlyInterest = 0
    let yearlyPrincipal = 0

    for (let month = 1; month <= 12; month += 1) {
      const globalMonth = (year - 1) * 12 + month
      if (globalMonth > repaymentMonths || balance <= 0) break

      const interest = balance * monthlyRate
      let principalPaid = emi - interest

      if (principalPaid < 0) principalPaid = 0
      if (principalPaid > balance) principalPaid = balance

      balance -= principalPaid
      yearlyInterest += interest
      yearlyPrincipal += principalPaid
      totalInterestPaid += interest
    }

    const section80eEligibleInterest = year <= 8 ? yearlyInterest : 0
    const taxSaved =
      input.taxRegime === "new"
        ? 0
        : section80eEligibleInterest * (marginalRate / 100)

    schedule.push({
      year,
      openingBalance: round(openingBalance),
      principalPaid: round(yearlyPrincipal),
      interestPaid: round(yearlyInterest),
      closingBalance: round(balance),
      section80eEligibleInterest: round(section80eEligibleInterest),
      taxSaved: round(taxSaved),
    })
  }

  const totalPayment = emi * repaymentMonths
  const totalSection80eDeduction = schedule.reduce(
    (sum, row) => sum + row.section80eEligibleInterest,
    0
  )
  const totalTaxSaved = schedule.reduce((sum, row) => sum + row.taxSaved, 0)

  const netInterestCost = Math.max(0, totalInterestPaid - totalTaxSaved)
  const effectiveNetInterestRate =
    principalAtRepaymentStart > 0 && repaymentTenureYears > 0
      ? (netInterestCost / (principalAtRepaymentStart * repaymentTenureYears)) *
        100
      : 0

  return {
    principalAtRepaymentStart: round(principalAtRepaymentStart),
    emi: round(emi),
    totalInterestPaid: round(totalInterestPaid),
    totalPayment: round(totalPayment),
    totalSection80eDeduction: round(totalSection80eDeduction),
    totalTaxSaved: round(totalTaxSaved),
    effectiveNetInterestRate: Number(effectiveNetInterestRate.toFixed(2)),
    schedule,
  }
}
