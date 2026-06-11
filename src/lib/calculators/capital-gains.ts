export type AssetClass = "equity" | "debt" | "real-estate" | "gold"

export interface CapitalGainsInput {
  assetClass: AssetClass
  buyPrice: number
  sellPrice: number
  quantity: number
  holdingPeriodMonths: number
  taxSlabPercentage: number
  financialYear: string
}

export interface CapitalGainsResult {
  totalInvestment: number
  totalSaleValue: number
  grossGain: number
  gainType: "STCG" | "LTCG"
  applicableTaxRate: string
  taxableAmount: number
  taxAmount: number
  cess: number
  totalTaxLiability: number
  netProfitAfterTax: number
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
    equity: { stcgRate: number; ltcgRate: number; exemptionLimit: number }
    realEstateGold: {
      stcgRate: number
      ltcgRate: number
      hasIndexation: boolean
    }
    debt: { note: string }
  }
> = {
  "FY2020-21": {
    equity: { stcgRate: 15, ltcgRate: 10, exemptionLimit: 100000 },
    realEstateGold: { stcgRate: 20, ltcgRate: 20, hasIndexation: true },
    debt: { note: "Taxed at slab rate" },
  },
  "FY2021-22": {
    equity: { stcgRate: 15, ltcgRate: 10, exemptionLimit: 100000 },
    realEstateGold: { stcgRate: 20, ltcgRate: 20, hasIndexation: true },
    debt: { note: "Taxed at slab rate" },
  },
  "FY2022-23": {
    equity: { stcgRate: 15, ltcgRate: 10, exemptionLimit: 100000 },
    realEstateGold: { stcgRate: 20, ltcgRate: 20, hasIndexation: true },
    debt: { note: "Taxed at slab rate" },
  },
  "FY2023-24": {
    equity: { stcgRate: 15, ltcgRate: 10, exemptionLimit: 100000 },
    realEstateGold: { stcgRate: 20, ltcgRate: 20, hasIndexation: true },
    debt: { note: "Post-Apr 2023: Always STCG at slab rate" },
  },
  "FY2024-25": {
    equity: { stcgRate: 20, ltcgRate: 12.5, exemptionLimit: 125000 },
    realEstateGold: { stcgRate: 20, ltcgRate: 12.5, hasIndexation: false },
    debt: { note: "Always STCG at slab rate" },
  },
  "FY2025-26": {
    equity: { stcgRate: 20, ltcgRate: 12.5, exemptionLimit: 125000 },
    realEstateGold: { stcgRate: 20, ltcgRate: 12.5, hasIndexation: false },
    debt: { note: "Always STCG at slab rate" },
  },
  "FY2026-27": {
    equity: { stcgRate: 20, ltcgRate: 12.5, exemptionLimit: 125000 },
    realEstateGold: { stcgRate: 20, ltcgRate: 12.5, hasIndexation: false },
    debt: { note: "Always STCG at slab rate" },
  },
}

export function calculateCapitalGains(
  input: CapitalGainsInput
): CapitalGainsResult {
  const {
    assetClass,
    buyPrice,
    sellPrice,
    quantity,
    holdingPeriodMonths,
    taxSlabPercentage,
    financialYear,
  } = input

  const fyConfig = FY_CONFIGS[financialYear] || FY_CONFIGS["FY2025-26"]

  const totalInvestment = buyPrice * quantity
  const totalSaleValue = sellPrice * quantity
  const grossGain = totalSaleValue - totalInvestment

  let gainType: "STCG" | "LTCG" = "STCG"
  let taxRatePercentage = 0
  let taxableAmount = Math.max(0, grossGain)
  let applicableTaxRateStr = ""

  if (grossGain <= 0) {
    return {
      totalInvestment,
      totalSaleValue,
      grossGain,
      gainType: holdingPeriodMonths > 12 ? "LTCG" : "STCG",
      applicableTaxRate: "0% (Loss)",
      taxableAmount: 0,
      taxAmount: 0,
      cess: 0,
      totalTaxLiability: 0,
      netProfitAfterTax: grossGain,
      financialYear,
    }
  }

  switch (assetClass) {
    case "equity":
      const isLTCGEquity = holdingPeriodMonths > 12
      if (isLTCGEquity) {
        gainType = "LTCG"
        taxableAmount = Math.max(0, grossGain - fyConfig.equity.exemptionLimit)
        taxRatePercentage = fyConfig.equity.ltcgRate
        applicableTaxRateStr = `${fyConfig.equity.ltcgRate}% (above ₹${fyConfig.equity.exemptionLimit / 100000}L)`
      } else {
        gainType = "STCG"
        taxRatePercentage = fyConfig.equity.stcgRate
        applicableTaxRateStr = `${fyConfig.equity.stcgRate}%`
      }
      break

    case "debt":
      gainType = "STCG"
      taxRatePercentage = taxSlabPercentage
      applicableTaxRateStr = `${taxSlabPercentage}% (Your Slab)`
      break

    case "real-estate":
    case "gold":
      const isLTCGOthers = holdingPeriodMonths > 24
      if (isLTCGOthers) {
        gainType = "LTCG"
        taxRatePercentage = fyConfig.realEstateGold.ltcgRate
        const indexationNote = fyConfig.realEstateGold.hasIndexation
          ? " (with Indexation)"
          : " (No Indexation)"
        applicableTaxRateStr = `${fyConfig.realEstateGold.ltcgRate}%${indexationNote}`
      } else {
        gainType = "STCG"
        taxRatePercentage = taxSlabPercentage
        applicableTaxRateStr = `${taxSlabPercentage}% (Your Slab)`
      }
      break
  }

  const taxAmount = (taxableAmount * taxRatePercentage) / 100
  const cess = taxAmount * 0.04
  const totalTaxLiability = taxAmount + cess

  return {
    totalInvestment: Math.round(totalInvestment),
    totalSaleValue: Math.round(totalSaleValue),
    grossGain: Math.round(grossGain),
    gainType,
    applicableTaxRate: applicableTaxRateStr,
    taxableAmount: Math.round(taxableAmount),
    taxAmount: Math.round(taxAmount),
    cess: Math.round(cess),
    totalTaxLiability: Math.round(totalTaxLiability),
    netProfitAfterTax: Math.round(grossGain - totalTaxLiability),
    financialYear,
  }
}
