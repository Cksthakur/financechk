export interface TaxInput {
  annualSalary: number
  basicSalary: number
  hra: number
  rentPaid: number
  cityType: "metro" | "non-metro"
  section80C: number
  section80D: number
  section80CCD: number
  homeLoanInterest: number
  otherDeductions: number
  financialYear: string
}

export interface TaxResult {
  taxableIncome: number
  taxPayable: number
  cess: number
  totalTax: number
  effectiveRate: number
  deductions: number
  hraExemption?: number
}

export interface TaxComparison {
  oldRegime: TaxResult
  newRegime: TaxResult
  savings: number
  betterRegime: "old" | "new"
  financialYear: string
}

export const AVAILABLE_FYS = [
  "FY2020-21",
  "FY2021-22",
  "FY2022-23",
  "FY2023-24",
  "FY2024-25",
  "FY2025-26",
  "FY2026-27",
]

const FY_CONFIGS: Record<
  string,
  {
    oldSlabs: Array<{ threshold: number; rate: number }>
    newSlabs: Array<{ threshold: number; rate: number }>
    oldStandardDeduction: number
    newStandardDeduction: number
    oldRebateLimit: number
    newRebateLimit: number
    maxRebate: number
  }
> = {
  "FY2020-21": {
    oldSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 1000000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    newSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 750000, rate: 10 },
      { threshold: 1000000, rate: 15 },
      { threshold: 1250000, rate: 20 },
      { threshold: 1500000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    oldStandardDeduction: 50000,
    newStandardDeduction: 0,
    oldRebateLimit: 500000,
    newRebateLimit: 500000,
    maxRebate: 12500,
  },
  "FY2021-22": {
    oldSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 1000000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    newSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 750000, rate: 10 },
      { threshold: 1000000, rate: 15 },
      { threshold: 1250000, rate: 20 },
      { threshold: 1500000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    oldStandardDeduction: 50000,
    newStandardDeduction: 0,
    oldRebateLimit: 500000,
    newRebateLimit: 500000,
    maxRebate: 12500,
  },
  "FY2022-23": {
    oldSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 1000000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    newSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 750000, rate: 10 },
      { threshold: 1000000, rate: 15 },
      { threshold: 1250000, rate: 20 },
      { threshold: 1500000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    oldStandardDeduction: 50000,
    newStandardDeduction: 0,
    oldRebateLimit: 500000,
    newRebateLimit: 500000,
    maxRebate: 12500,
  },
  "FY2023-24": {
    oldSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 1000000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    newSlabs: [
      { threshold: 300000, rate: 0 },
      { threshold: 600000, rate: 5 },
      { threshold: 900000, rate: 10 },
      { threshold: 1200000, rate: 15 },
      { threshold: 1500000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    oldStandardDeduction: 50000,
    newStandardDeduction: 50000,
    oldRebateLimit: 500000,
    newRebateLimit: 700000,
    maxRebate: 25000,
  },
  "FY2024-25": {
    oldSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 1000000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    newSlabs: [
      { threshold: 300000, rate: 0 },
      { threshold: 700000, rate: 5 },
      { threshold: 1000000, rate: 10 },
      { threshold: 1200000, rate: 15 },
      { threshold: 1500000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    oldStandardDeduction: 50000,
    newStandardDeduction: 75000,
    oldRebateLimit: 500000,
    newRebateLimit: 700000,
    maxRebate: 25000,
  },
  "FY2025-26": {
    oldSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 1000000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    newSlabs: [
      { threshold: 400000, rate: 0 },
      { threshold: 800000, rate: 5 },
      { threshold: 1200000, rate: 10 },
      { threshold: 1600000, rate: 15 },
      { threshold: 2000000, rate: 20 },
      { threshold: 2400000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    oldStandardDeduction: 50000,
    newStandardDeduction: 75000,
    oldRebateLimit: 500000,
    newRebateLimit: 1200000,
    maxRebate: 60000,
  },
  "FY2026-27": {
    oldSlabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 1000000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    newSlabs: [
      { threshold: 400000, rate: 0 },
      { threshold: 800000, rate: 5 },
      { threshold: 1200000, rate: 10 },
      { threshold: 1600000, rate: 15 },
      { threshold: 2000000, rate: 20 },
      { threshold: 2400000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    oldStandardDeduction: 50000,
    newStandardDeduction: 75000,
    oldRebateLimit: 500000,
    newRebateLimit: 1200000,
    maxRebate: 60000,
  },
}

function calculateTaxFromSlabs(
  taxableIncome: number,
  slabs: Array<{ threshold: number; rate: number }>
): number {
  let tax = 0
  let prevThreshold = 0

  for (const slab of slabs) {
    if (taxableIncome > prevThreshold) {
      const taxableInThisSlab =
        Math.min(taxableIncome, slab.threshold) - prevThreshold
      tax += taxableInThisSlab * (slab.rate / 100)
    }
    prevThreshold = slab.threshold
  }

  return tax
}

function calculateHRAExemption(input: TaxInput): number {
  if (input.rentPaid === 0 || input.hra === 0) return 0

  const actualHRA = input.hra
  const rentMinus10 = Math.max(0, input.rentPaid - 0.1 * input.basicSalary)
  const cityPercent = input.cityType === "metro" ? 0.5 : 0.4
  const percentOfBasic = cityPercent * input.basicSalary

  return Math.min(actualHRA, rentMinus10, percentOfBasic)
}

export function calculateTaxComparison(input: TaxInput): TaxComparison {
  const fyConfig = FY_CONFIGS[input.financialYear] || FY_CONFIGS["FY2025-26"]

  const hraExemption = calculateHRAExemption(input)

  const oldDeductions =
    fyConfig.oldStandardDeduction +
    hraExemption +
    Math.min(input.section80C, 150000) +
    Math.min(input.section80D, 100000) +
    Math.min(input.section80CCD, 50000) +
    Math.min(input.homeLoanInterest, 200000) +
    input.otherDeductions

  const oldTaxableIncome = Math.max(0, input.annualSalary - oldDeductions)
  let oldTax = calculateTaxFromSlabs(oldTaxableIncome, fyConfig.oldSlabs)

  if (oldTaxableIncome <= fyConfig.oldRebateLimit) {
    oldTax = 0
  } else {
    const incomeAboveLimit = oldTaxableIncome - fyConfig.oldRebateLimit
    if (oldTax > incomeAboveLimit) {
      oldTax = incomeAboveLimit
    }
  }

  const oldCess = oldTax * 0.04
  const oldTotal = Math.round(oldTax + oldCess)

  const newDeductions = fyConfig.newStandardDeduction
  const newTaxableIncome = Math.max(0, input.annualSalary - newDeductions)
  let newTax = calculateTaxFromSlabs(newTaxableIncome, fyConfig.newSlabs)

  if (newTaxableIncome <= fyConfig.newRebateLimit) {
    newTax = 0
  } else {
    const incomeAboveLimit = newTaxableIncome - fyConfig.newRebateLimit
    if (newTax > incomeAboveLimit) {
      newTax = Math.min(incomeAboveLimit, fyConfig.maxRebate)
    }
  }

  const newCess = newTax * 0.04
  const newTotal = Math.round(newTax + newCess)

  const oldResult: TaxResult = {
    taxableIncome: oldTaxableIncome,
    taxPayable: Math.round(oldTax),
    cess: Math.round(oldCess),
    totalTax: oldTotal,
    effectiveRate:
      input.annualSalary > 0 ? (oldTotal / input.annualSalary) * 100 : 0,
    deductions: Math.round(oldDeductions),
    hraExemption: Math.round(hraExemption),
  }

  const newResult: TaxResult = {
    taxableIncome: newTaxableIncome,
    taxPayable: Math.round(newTax),
    cess: Math.round(newCess),
    totalTax: newTotal,
    effectiveRate:
      input.annualSalary > 0 ? (newTotal / input.annualSalary) * 100 : 0,
    deductions: Math.round(newDeductions),
  }

  return {
    oldRegime: oldResult,
    newRegime: newResult,
    savings: Math.abs(oldTotal - newTotal),
    betterRegime: oldTotal <= newTotal ? "old" : "new",
    financialYear: input.financialYear,
  }
}
