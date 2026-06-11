export interface CompoundInterestInput {
  principal: number
  annualRate: number
  years: number
  compoundingFrequency: "yearly" | "half-yearly" | "quarterly" | "monthly"
}

export interface CompoundInterestResult {
  totalAmount: number
  totalInterest: number
  yearlyBreakdown: Array<{
    year: number
    principal: number
    interest: number
    total: number
  }>
}

export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const { principal, annualRate, years, compoundingFrequency } = input

  let n: number
  switch (compoundingFrequency) {
    case "yearly":
      n = 1
      break
    case "half-yearly":
      n = 2
      break
    case "quarterly":
      n = 4
      break
    case "monthly":
      n = 12
      break
  }

  const r = annualRate / 100
  const totalAmount = principal * Math.pow(1 + r / n, n * years)
  const totalInterest = totalAmount - principal

  const yearlyBreakdown = []
  for (let year = 1; year <= years; year++) {
    const amount = principal * Math.pow(1 + r / n, n * year)
    const yearlyInterest = amount - principal
    yearlyBreakdown.push({
      year,
      principal,
      interest: yearlyInterest,
      total: amount,
    })
  }

  return {
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    yearlyBreakdown,
  }
}
