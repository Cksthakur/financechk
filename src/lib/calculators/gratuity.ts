export interface GratuityInput {
  lastDrawnBasicSalary: number
  lastDrawnDearnessAllowance: number
  yearsOfService: number
  monthsOfService?: number
  retirementType: "resignation" | "superannuation" | "death"
  employmentType?: "covered" | "not-covered"
}

export interface GratuityResult {
  gratuityAmount: number
  taxableGratuity: number
  exemptionLimit: number
  taxableAmount: number
  eligible: boolean
  effectiveYearsOfService: number
  calculationBreakdown: {
    basedOn15Days: number
    basedOnGratuityAct: number
    actualGratuity: number
    exemption: number
  }
}

export function calculateGratuity(input: {
  lastDrawnBasicSalary: number
  lastDrawnDearnessAllowance: number
  yearsOfService: number
  monthsOfService?: number
  retirementType: "resignation" | "superannuation" | "death"
  employmentType?: "covered" | "not-covered"
}): GratuityResult {
  const {
    lastDrawnBasicSalary,
    lastDrawnDearnessAllowance,
    yearsOfService,
    monthsOfService = 0,
    retirementType,
    employmentType = "covered",
  } = input

  const lastDrawnSalary = lastDrawnBasicSalary + lastDrawnDearnessAllowance
  const effectiveYearsOfService =
    yearsOfService + (monthsOfService >= 6 ? 1 : 0)

  const eligible = retirementType === "death" || effectiveYearsOfService >= 5

  if (!eligible) {
    return {
      gratuityAmount: 0,
      taxableGratuity: 0,
      exemptionLimit: 0,
      taxableAmount: 0,
      eligible: false,
      effectiveYearsOfService,
      calculationBreakdown: {
        basedOn15Days: 0,
        basedOnGratuityAct: 2000000,
        actualGratuity: 0,
        exemption: 0,
      },
    }
  }

  const divisor = employmentType === "covered" ? 26 : 30
  const baseDailyWage = lastDrawnSalary / divisor
  const fifteenDaysWage =
    baseDailyWage * 15 * Math.min(effectiveYearsOfService, 15)

  const maxGratuityUnderAct = 2000000

  let actualGratuity = fifteenDaysWage

  if (retirementType === "superannuation" || retirementType === "death") {
    const yearsAfter15 = Math.max(0, effectiveYearsOfService - 15)
    const additionalGratuity = baseDailyWage * 15 * yearsAfter15
    actualGratuity = fifteenDaysWage + additionalGratuity
  }

  actualGratuity = Math.min(actualGratuity, maxGratuityUnderAct)

  const exemption =
    retirementType === "death"
      ? actualGratuity
      : Math.min(actualGratuity, 2000000)

  const taxableAmount = Math.max(0, actualGratuity - exemption)

  return {
    gratuityAmount: Math.round(actualGratuity),
    taxableGratuity: Math.round(taxableAmount),
    exemptionLimit: Math.round(exemption),
    taxableAmount: Math.round(taxableAmount),
    eligible,
    effectiveYearsOfService,
    calculationBreakdown: {
      basedOn15Days: Math.round(fifteenDaysWage),
      basedOnGratuityAct: maxGratuityUnderAct,
      actualGratuity: Math.round(actualGratuity),
      exemption: Math.round(exemption),
    },
  }
}
