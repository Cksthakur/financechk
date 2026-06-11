export type EmploymentType = "salaried" | "self-employed" | "freelancer"
export type JobStability = "low" | "medium" | "high"

export interface EmergencyFundInput {
  monthlyEssentialExpenses: number
  employmentType: EmploymentType
  dependants: number
  jobStability: JobStability
  hasHealthInsurance: boolean
  hasLifeInsurance: boolean
  targetBuildMonths: number
  taxRatePercent: number
}

export interface EmergencyParkingOption {
  key: "savings" | "liquid-mf" | "fd"
  label: string
  expectedPreTaxReturn: number
  expectedPostTaxReturn: number
  liquidity: "high" | "medium"
  risk: "low" | "moderate"
}

export interface EmergencyFundResult {
  recommendedMonths: number
  targetAmount: number
  monthlySavingsRequired: number
  parkingOptions: Array<EmergencyParkingOption>
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function round(value: number): number {
  return Math.round(value)
}

function getBaseMonths(employmentType: EmploymentType): number {
  if (employmentType === "salaried") return 6
  if (employmentType === "self-employed") return 9
  return 10
}

/**
 * Compute emergency-fund target and parking comparison for Indian users.
 */
export function calculateEmergencyFund(
  input: EmergencyFundInput
): EmergencyFundResult {
  const monthlyEssentialExpenses = Math.max(0, input.monthlyEssentialExpenses)
  const dependants = Math.max(0, Math.round(input.dependants))
  const targetBuildMonths = Math.max(1, Math.round(input.targetBuildMonths))
  const taxRatePercent = clamp(input.taxRatePercent, 0, 30)

  let months = getBaseMonths(input.employmentType)

  if (input.jobStability === "low") months += 2
  if (input.jobStability === "high") months -= 1

  if (dependants >= 1) months += 1
  if (dependants >= 3) months += 1

  if (!input.hasHealthInsurance) months += 1
  if (!input.hasLifeInsurance && dependants > 0) months += 1

  const recommendedMonths = clamp(months, 3, 12)
  const targetAmount = monthlyEssentialExpenses * recommendedMonths
  const monthlySavingsRequired = targetAmount / targetBuildMonths

  const effectiveTaxMultiplier = 1 - taxRatePercent / 100

  const parkingOptions: Array<EmergencyParkingOption> = [
    {
      key: "savings",
      label: "Savings Account",
      expectedPreTaxReturn: 3.0,
      expectedPostTaxReturn: Number((3.0 * effectiveTaxMultiplier).toFixed(2)),
      liquidity: "high",
      risk: "low",
    },
    {
      key: "liquid-mf",
      label: "Liquid Mutual Fund",
      expectedPreTaxReturn: 6.5,
      expectedPostTaxReturn: Number((6.5 * effectiveTaxMultiplier).toFixed(2)),
      liquidity: "high",
      risk: "moderate",
    },
    {
      key: "fd",
      label: "Short-term FD",
      expectedPreTaxReturn: 7.0,
      expectedPostTaxReturn: Number((7.0 * effectiveTaxMultiplier).toFixed(2)),
      liquidity: "medium",
      risk: "low",
    },
  ]

  return {
    recommendedMonths,
    targetAmount: round(targetAmount),
    monthlySavingsRequired: round(monthlySavingsRequired),
    parkingOptions,
  }
}
