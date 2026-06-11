export interface FreelanceTaxInput {
  grossReceipts: number
  profitPercentage: number
  otherIncome: number
  financialYear: string
}

export interface FreelanceTaxResult {
  presumptiveIncome: number
  totalTaxableIncome: number
  taxAmount: number
  cess: number
  totalTaxLiability: number
  effectiveTaxRate: number
  isEligibleFor44ADA: boolean
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
    slabs: Array<{ threshold: number; rate: number }>
    rebateLimit: number
    maxRebate: number
    grossReceiptsLimit: number
  }
> = {
  "FY2020-21": {
    slabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 750000, rate: 10 },
      { threshold: 1000000, rate: 15 },
      { threshold: 1250000, rate: 20 },
      { threshold: 1500000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    rebateLimit: 500000,
    maxRebate: 12500,
    grossReceiptsLimit: 5000000,
  },
  "FY2021-22": {
    slabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 750000, rate: 10 },
      { threshold: 1000000, rate: 15 },
      { threshold: 1250000, rate: 20 },
      { threshold: 1500000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    rebateLimit: 500000,
    maxRebate: 12500,
    grossReceiptsLimit: 5000000,
  },
  "FY2022-23": {
    slabs: [
      { threshold: 250000, rate: 0 },
      { threshold: 500000, rate: 5 },
      { threshold: 750000, rate: 10 },
      { threshold: 1000000, rate: 15 },
      { threshold: 1250000, rate: 20 },
      { threshold: 1500000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    rebateLimit: 500000,
    maxRebate: 12500,
    grossReceiptsLimit: 5000000,
  },
  "FY2023-24": {
    slabs: [
      { threshold: 300000, rate: 0 },
      { threshold: 600000, rate: 5 },
      { threshold: 900000, rate: 10 },
      { threshold: 1200000, rate: 15 },
      { threshold: 1500000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    rebateLimit: 700000,
    maxRebate: 25000,
    grossReceiptsLimit: 7500000,
  },
  "FY2024-25": {
    slabs: [
      { threshold: 300000, rate: 0 },
      { threshold: 700000, rate: 5 },
      { threshold: 1000000, rate: 10 },
      { threshold: 1200000, rate: 15 },
      { threshold: 1500000, rate: 20 },
      { threshold: Infinity, rate: 30 },
    ],
    rebateLimit: 700000,
    maxRebate: 25000,
    grossReceiptsLimit: 7500000,
  },
  "FY2025-26": {
    slabs: [
      { threshold: 400000, rate: 0 },
      { threshold: 800000, rate: 5 },
      { threshold: 1200000, rate: 10 },
      { threshold: 1600000, rate: 15 },
      { threshold: 2000000, rate: 20 },
      { threshold: 2400000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    rebateLimit: 1200000,
    maxRebate: 60000,
    grossReceiptsLimit: 7500000,
  },
  "FY2026-27": {
    slabs: [
      { threshold: 400000, rate: 0 },
      { threshold: 800000, rate: 5 },
      { threshold: 1200000, rate: 10 },
      { threshold: 1600000, rate: 15 },
      { threshold: 2000000, rate: 20 },
      { threshold: 2400000, rate: 25 },
      { threshold: Infinity, rate: 30 },
    ],
    rebateLimit: 1200000,
    maxRebate: 60000,
    grossReceiptsLimit: 7500000,
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

export function calculateFreelanceTax(
  input: FreelanceTaxInput
): FreelanceTaxResult {
  const { grossReceipts, profitPercentage, otherIncome, financialYear } = input

  const fyConfig = FY_CONFIGS[financialYear] || FY_CONFIGS["FY2025-26"]

  const actualProfitPct = Math.max(50, Math.min(100, profitPercentage))
  const presumptiveIncome = grossReceipts * (actualProfitPct / 100)
  const totalTaxableIncome = presumptiveIncome + otherIncome

  let taxAmount = calculateTaxFromSlabs(totalTaxableIncome, fyConfig.slabs)

  if (totalTaxableIncome <= fyConfig.rebateLimit) {
    taxAmount = 0
  } else {
    const incomeAboveLimit = totalTaxableIncome - fyConfig.rebateLimit
    if (taxAmount > incomeAboveLimit) {
      taxAmount = Math.min(incomeAboveLimit, fyConfig.maxRebate)
    }
  }

  const cess = taxAmount * 0.04
  const totalTaxLiability = taxAmount + cess
  const totalIncome = grossReceipts + otherIncome
  const effectiveTaxRate =
    totalIncome > 0 ? (totalTaxLiability / totalIncome) * 100 : 0

  return {
    presumptiveIncome: Math.round(presumptiveIncome),
    totalTaxableIncome: Math.round(totalTaxableIncome),
    taxAmount: Math.round(taxAmount),
    cess: Math.round(cess),
    totalTaxLiability: Math.round(totalTaxLiability),
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
    isEligibleFor44ADA: grossReceipts <= fyConfig.grossReceiptsLimit,
    financialYear,
  }
}
