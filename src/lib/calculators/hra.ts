export interface HRAInput {
  basicSalary: number
  hraReceived: number
  rentPaid: number
  cityType: "metro" | "non-metro"
}

export interface HRAResult {
  hraExemption: number
  taxableHRA: number
  calculationBreakdown: {
    actualHRA: number
    rentPaidMinus10Percent: number
    fiftyPercentOrFortyPercentOfBasic: number
    exemptAmount: number
  }
}

export function calculateHRA(input: HRAInput): HRAResult {
  const { basicSalary, hraReceived, rentPaid, cityType } = input

  const annualBasic = basicSalary * 12
  const annualHRA = hraReceived * 12
  const annualRent = rentPaid * 12

  const rentMinus10Percent = Math.max(0, annualRent - annualBasic * 0.1)

  const fiftyOrFortyPercent =
    cityType === "metro" ? annualBasic * 0.5 : annualBasic * 0.4

  const exemption = Math.min(annualHRA, rentMinus10Percent, fiftyOrFortyPercent)
  const taxableHRA = annualHRA - exemption

  return {
    hraExemption: Math.round(exemption),
    taxableHRA: Math.round(Math.max(0, taxableHRA)),
    calculationBreakdown: {
      actualHRA: annualHRA,
      rentPaidMinus10Percent: Math.round(rentMinus10Percent),
      fiftyPercentOrFortyPercentOfBasic: Math.round(fiftyOrFortyPercent),
      exemptAmount: Math.round(exemption),
    },
  }
}
