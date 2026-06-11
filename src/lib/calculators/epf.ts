export interface EPFInput {
  monthlySalary: number
  employeeContribution: number
  employerContribution: number
  currentBalance: number
  annualRate: number
  years: number
  annualSalaryIncrement?: number
}

export interface EPFResult {
  totalEmployeeContributions: number
  totalEmployerContributions: number
  totalInterest: number
  totalBalance: number
  epsPensionContributionTotal: number
  yearlyBreakdown: Array<{
    year: number
    monthlySalary: number
    employeeContrib: number
    employerContrib: number
    epsContrib: number
    interest: number
    balance: number
  }>
}

export function calculateEPF(input: EPFInput): EPFResult {
  const {
    monthlySalary,
    employeeContribution,
    employerContribution,
    currentBalance,
    annualRate,
    years,
    annualSalaryIncrement = 0,
  } = input

  const safeMonthlySalary = Math.max(0, monthlySalary)
  const safeEmployeeContribution = Math.max(0, employeeContribution)
  const safeEmployerContribution = Math.max(0, employerContribution)
  const safeCurrentBalance = Math.max(0, currentBalance)
  const safeYears = Math.max(0, Math.round(years))

  const yearlyRate = annualRate / 100
  let balance = safeCurrentBalance
  let runningMonthlySalary = safeMonthlySalary
  let totalEmployeeContributions = 0
  let totalEmployerContributions = 0
  let epsPensionContributionTotal = 0

  const employeeContributionRatio =
    safeMonthlySalary > 0 ? safeEmployeeContribution / safeMonthlySalary : 0
  const employerContributionRatio =
    safeMonthlySalary > 0 ? safeEmployerContribution / safeMonthlySalary : 0

  const yearlyBreakdown = []
  for (let year = 1; year <= safeYears; year++) {
    const monthlyEmployeeContribution =
      safeMonthlySalary > 0
        ? runningMonthlySalary * employeeContributionRatio
        : safeEmployeeContribution

    const monthlyEmployerContribution =
      safeMonthlySalary > 0
        ? runningMonthlySalary * employerContributionRatio
        : safeEmployerContribution

    const epsMonthlyContribution =
      Math.min(runningMonthlySalary, 15000) * 0.0833

    const yearlyEmployeeContrib = monthlyEmployeeContribution * 12
    const yearlyEmployerContrib = monthlyEmployerContribution * 12
    const yearlyEpsContrib = epsMonthlyContribution * 12

    const yearlyContrib = yearlyEmployeeContrib + yearlyEmployerContrib

    balance += yearlyContrib
    const interest = balance * yearlyRate
    balance += interest

    totalEmployeeContributions += yearlyEmployeeContrib
    totalEmployerContributions += yearlyEmployerContrib
    epsPensionContributionTotal += yearlyEpsContrib

    yearlyBreakdown.push({
      year,
      monthlySalary: Math.round(runningMonthlySalary),
      employeeContrib: Math.round(yearlyEmployeeContrib),
      employerContrib: Math.round(yearlyEmployerContrib),
      epsContrib: Math.round(yearlyEpsContrib),
      interest: Math.round(interest),
      balance: Math.round(balance),
    })

    runningMonthlySalary *= 1 + annualSalaryIncrement / 100
  }

  return {
    totalEmployeeContributions: Math.round(totalEmployeeContributions),
    totalEmployerContributions: Math.round(totalEmployerContributions),
    totalInterest: Math.round(
      balance -
        safeCurrentBalance -
        totalEmployeeContributions -
        totalEmployerContributions
    ),
    totalBalance: Math.round(balance),
    epsPensionContributionTotal: Math.round(epsPensionContributionTotal),
    yearlyBreakdown,
  }
}
