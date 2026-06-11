export interface Prepayment {
  id: string
  type: "monthly" | "yearly" | "quarterly" | "one-time"
  amount: number
  startMonthIndex: number // 1 to totalMonths
}

export interface AdvancedHomeLoanInput {
  homeValue: number
  downPayment: number
  loanInsurance: number
  loanFeesPercent: number
  interestRate: number
  tenureYears: number
  tenureMonths: number
  propertyTaxYearly: number
  homeInsuranceYearly: number
  maintenanceMonthly: number
  taxBracket: number // e.g., 30 for 30%
  startMonth: number // 1-12 (1 = Jan, 4 = Apr)
  startYear: number
  prepayments: Array<Prepayment>
}

export interface YearlyAmortization {
  year: number
  principal: number
  interest: number
  prepayments: number
  taxesAndInsurance: number
  totalPayment: number
  balance: number
  loanPaidPercent: number
  taxSaved: number
}

export interface AdvancedHomeLoanResult {
  loanAmount: number
  downPaymentAndFees: number
  baseEMI: number
  totalPrincipal: number
  totalInterest: number
  totalPrepayments: number
  totalTaxesInsuranceMaintenance: number
  totalTaxSaved: number
  totalPayment: number
  originalTenureMonths: number
  newTenureMonths: number
  yearlySchedule: Array<YearlyAmortization>
}

export function calculateAdvancedHomeLoan(
  input: AdvancedHomeLoanInput
): AdvancedHomeLoanResult {
  const {
    homeValue,
    downPayment,
    loanInsurance,
    loanFeesPercent,
    interestRate,
    tenureYears,
    tenureMonths,
    propertyTaxYearly,
    homeInsuranceYearly,
    maintenanceMonthly,
    taxBracket,
    startMonth,
    startYear,
    prepayments,
  } = input

  const loanAmount = homeValue - downPayment + loanInsurance
  const totalMonths = tenureYears * 12 + tenureMonths
  const monthlyRate = interestRate / 12 / 100

  const feesAmount = loanAmount * (loanFeesPercent / 100)
  const downPaymentAndFees = downPayment + feesAmount + loanInsurance // Total out-of-pocket costs at start

  // Base EMI
  let baseEMI = 0
  if (monthlyRate > 0) {
    baseEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  } else {
    baseEMI = loanAmount / totalMonths
  }

  let balance = loanAmount
  let totalInterest = 0
  let totalPrepayments = 0
  let totalTaxesInsuranceMaintenance = 0
  let totalTaxSavedAccumulated = 0

  let currentMonth = startMonth
  let currentYear = startYear

  const yearlyData = new Map<number, YearlyAmortization>()

  // Tax calculation variables
  // Indian FY is April (4) to March (3)
  let currentFyInterest = 0

  let monthIndex = 0
  while (balance >= 0.01 && monthIndex < totalMonths * 2) {
    monthIndex++
    // 1. Regular Interest & EMI
    const interest = balance * monthlyRate
    let principalPaid = baseEMI - interest

    // 2. Prepayments
    let currentPrepayment = 0
    for (const prepay of prepayments) {
      if (monthIndex >= prepay.startMonthIndex) {
        const monthsSinceStart = monthIndex - prepay.startMonthIndex
        if (prepay.type === "one-time" && monthsSinceStart === 0) {
          currentPrepayment += prepay.amount
        } else if (prepay.type === "monthly") {
          currentPrepayment += prepay.amount
        } else if (prepay.type === "quarterly" && monthsSinceStart % 3 === 0) {
          currentPrepayment += prepay.amount
        } else if (prepay.type === "yearly" && monthsSinceStart % 12 === 0) {
          currentPrepayment += prepay.amount
        }
      }
    }

    principalPaid += currentPrepayment

    // Adjust final month
    if (principalPaid > balance) {
      principalPaid = balance
      currentPrepayment = Math.max(0, balance - (baseEMI - interest))
    }

    balance -= principalPaid
    totalInterest += interest
    totalPrepayments += currentPrepayment

    // Taxes & Insurance
    const monthlyTaxes = propertyTaxYearly / 12
    const monthlyIns = homeInsuranceYearly / 12
    const tim = monthlyTaxes + monthlyIns + maintenanceMonthly
    totalTaxesInsuranceMaintenance += tim

    // Aggregate Yearly Data
    if (!yearlyData.has(currentYear)) {
      yearlyData.set(currentYear, {
        year: currentYear,
        principal: 0,
        interest: 0,
        prepayments: 0,
        taxesAndInsurance: 0,
        totalPayment: 0,
        balance: 0,
        loanPaidPercent: 0,
        taxSaved: 0,
      })
    }
    const yearObj = yearlyData.get(currentYear)!
    yearObj.principal += principalPaid - currentPrepayment
    yearObj.interest += interest
    yearObj.prepayments += currentPrepayment
    yearObj.taxesAndInsurance += tim
    yearObj.totalPayment += principalPaid + interest + tim
    yearObj.balance = balance
    yearObj.loanPaidPercent = ((loanAmount - balance) / loanAmount) * 100

    currentFyInterest += interest

    // End of FY Tax calculation (March is month 3)
    if (currentMonth === 3 || balance < 0.01) {
      const deductibleInterest = Math.min(currentFyInterest, 200000)
      const taxSaved = deductibleInterest * (taxBracket / 100)

      yearObj.taxSaved += taxSaved
      totalTaxSavedAccumulated += taxSaved

      currentFyInterest = 0
    }

    // Advance dates
    currentMonth++
    if (currentMonth > 12) {
      currentMonth = 1
      currentYear++
    }
  }

  const yearlySchedule = Array.from(yearlyData.values()).map((y) => ({
    ...y,
    principal: Math.round(y.principal),
    interest: Math.round(y.interest),
    prepayments: Math.round(y.prepayments),
    taxesAndInsurance: Math.round(y.taxesAndInsurance),
    totalPayment: Math.round(y.totalPayment),
    balance: Math.round(y.balance),
    loanPaidPercent: Number(y.loanPaidPercent.toFixed(2)),
    taxSaved: Math.round(y.taxSaved),
  }))

  return {
    loanAmount: Math.round(loanAmount),
    downPaymentAndFees: Math.round(downPaymentAndFees),
    baseEMI: Math.round(baseEMI),
    totalPrincipal: Math.round(loanAmount),
    totalInterest: Math.round(totalInterest),
    totalPrepayments: Math.round(totalPrepayments),
    totalTaxesInsuranceMaintenance: Math.round(totalTaxesInsuranceMaintenance),
    totalTaxSaved: Math.round(totalTaxSavedAccumulated),
    totalPayment: Math.round(
      loanAmount + totalInterest + totalTaxesInsuranceMaintenance
    ),
    originalTenureMonths: totalMonths,
    newTenureMonths: monthIndex,
    yearlySchedule,
  }
}
