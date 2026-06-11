export interface USTaxInput {
  annualIncome: number
  filingStatus:
    | "single"
    | "married_joint"
    | "married_separate"
    | "head_of_household"
  year: number
}

export interface USTaxBracket {
  rate: number
  min: number
  max: number | null
}

export interface USTaxResult {
  taxableIncome: number
  taxLiability: number
  effectiveRate: number
  marginalRate: number
  brackets: Array<{
    rate: number
    incomeInBracket: number
    taxInBracket: number
  }>
}

export interface USTaxComparison {
  currentYear: USTaxResult
  previousYears: Array<{
    year: number
    result: USTaxResult
    change: number
  }>
}

const TAX_BRACKETS: Record<number, Record<string, Array<USTaxBracket>>> = {
  2015: {
    single: [
      { rate: 10, min: 0, max: 9226 },
      { rate: 15, min: 9226, max: 37450 },
      { rate: 25, min: 37450, max: 90750 },
      { rate: 28, min: 90750, max: 189300 },
      { rate: 33, min: 189300, max: 411500 },
      { rate: 35, min: 411500, max: 413200 },
      { rate: 39.6, min: 413200, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 18451 },
      { rate: 15, min: 18451, max: 74900 },
      { rate: 25, min: 74900, max: 151200 },
      { rate: 28, min: 151200, max: 231450 },
      { rate: 33, min: 231450, max: 413200 },
      { rate: 35, min: 413200, max: 466950 },
      { rate: 39.6, min: 466950, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 9226 },
      { rate: 15, min: 9226, max: 37450 },
      { rate: 25, min: 37450, max: 75600 },
      { rate: 28, min: 75600, max: 115725 },
      { rate: 33, min: 115725, max: 206600 },
      { rate: 35, min: 206600, max: 233475 },
      { rate: 39.6, min: 233475, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 13150 },
      { rate: 15, min: 13150, max: 50200 },
      { rate: 25, min: 50200, max: 129600 },
      { rate: 28, min: 129600, max: 209400 },
      { rate: 33, min: 209400, max: 411500 },
      { rate: 35, min: 411500, max: 439000 },
      { rate: 39.6, min: 439000, max: null },
    ],
  },
  2016: {
    single: [
      { rate: 10, min: 0, max: 9275 },
      { rate: 15, min: 9275, max: 37650 },
      { rate: 25, min: 37650, max: 91150 },
      { rate: 28, min: 91150, max: 190150 },
      { rate: 33, min: 190150, max: 413400 },
      { rate: 35, min: 413400, max: 415050 },
      { rate: 39.6, min: 415050, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 18550 },
      { rate: 15, min: 18550, max: 75300 },
      { rate: 25, min: 75300, max: 151900 },
      { rate: 28, min: 151900, max: 231450 },
      { rate: 33, min: 231450, max: 413350 },
      { rate: 35, min: 413350, max: 466950 },
      { rate: 39.6, min: 466950, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 9275 },
      { rate: 15, min: 9275, max: 37650 },
      { rate: 25, min: 37650, max: 75950 },
      { rate: 28, min: 75950, max: 115725 },
      { rate: 33, min: 115725, max: 206675 },
      { rate: 35, min: 206675, max: 233475 },
      { rate: 39.6, min: 233475, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 13250 },
      { rate: 15, min: 13250, max: 50400 },
      { rate: 25, min: 50400, max: 130150 },
      { rate: 28, min: 130150, max: 210800 },
      { rate: 33, min: 210800, max: 413400 },
      { rate: 35, min: 413400, max: 441000 },
      { rate: 39.6, min: 441000, max: null },
    ],
  },
  2017: {
    single: [
      { rate: 10, min: 0, max: 9325 },
      { rate: 15, min: 9325, max: 37950 },
      { rate: 25, min: 37950, max: 91900 },
      { rate: 28, min: 91900, max: 191650 },
      { rate: 33, min: 191650, max: 416700 },
      { rate: 35, min: 416700, max: 418400 },
      { rate: 39.6, min: 418400, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 18650 },
      { rate: 15, min: 18650, max: 75900 },
      { rate: 25, min: 75900, max: 153100 },
      { rate: 28, min: 153100, max: 233350 },
      { rate: 33, min: 233350, max: 416700 },
      { rate: 35, min: 416700, max: 470700 },
      { rate: 39.6, min: 470700, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 9325 },
      { rate: 15, min: 9325, max: 37950 },
      { rate: 25, min: 37950, max: 76550 },
      { rate: 28, min: 76550, max: 116675 },
      { rate: 33, min: 116675, max: 208350 },
      { rate: 35, min: 208350, max: 235350 },
      { rate: 39.6, min: 235350, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 13350 },
      { rate: 15, min: 13350, max: 50800 },
      { rate: 25, min: 50800, max: 131200 },
      { rate: 28, min: 131200, max: 212500 },
      { rate: 33, min: 212500, max: 416700 },
      { rate: 35, min: 416700, max: 444550 },
      { rate: 39.6, min: 444550, max: null },
    ],
  },
  2018: {
    single: [
      { rate: 10, min: 0, max: 9525 },
      { rate: 12, min: 9525, max: 38700 },
      { rate: 22, min: 38700, max: 82500 },
      { rate: 24, min: 82500, max: 157500 },
      { rate: 32, min: 157500, max: 200000 },
      { rate: 35, min: 200000, max: 500000 },
      { rate: 37, min: 500000, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 19050 },
      { rate: 12, min: 19050, max: 77400 },
      { rate: 22, min: 77400, max: 165000 },
      { rate: 24, min: 165000, max: 315000 },
      { rate: 32, min: 315000, max: 400000 },
      { rate: 35, min: 400000, max: 600000 },
      { rate: 37, min: 600000, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 9525 },
      { rate: 12, min: 9525, max: 38700 },
      { rate: 22, min: 38700, max: 82500 },
      { rate: 24, min: 82500, max: 157500 },
      { rate: 32, min: 157500, max: 200000 },
      { rate: 35, min: 200000, max: 300000 },
      { rate: 37, min: 300000, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 13600 },
      { rate: 12, min: 13600, max: 51800 },
      { rate: 22, min: 51800, max: 82500 },
      { rate: 24, min: 82500, max: 157500 },
      { rate: 32, min: 157500, max: 200000 },
      { rate: 35, min: 200000, max: 500000 },
      { rate: 37, min: 500000, max: null },
    ],
  },
  2019: {
    single: [
      { rate: 10, min: 0, max: 9700 },
      { rate: 12, min: 9700, max: 39475 },
      { rate: 22, min: 39475, max: 84200 },
      { rate: 24, min: 84200, max: 160725 },
      { rate: 32, min: 160725, max: 204100 },
      { rate: 35, min: 204100, max: 510300 },
      { rate: 37, min: 510300, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 19400 },
      { rate: 12, min: 19400, max: 78950 },
      { rate: 22, min: 78950, max: 168400 },
      { rate: 24, min: 168400, max: 321450 },
      { rate: 32, min: 321450, max: 408200 },
      { rate: 35, min: 408200, max: 612600 },
      { rate: 37, min: 612600, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 9700 },
      { rate: 12, min: 9700, max: 39475 },
      { rate: 22, min: 39475, max: 84200 },
      { rate: 24, min: 84200, max: 160725 },
      { rate: 32, min: 160725, max: 204100 },
      { rate: 35, min: 204100, max: 306300 },
      { rate: 37, min: 306300, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 13850 },
      { rate: 12, min: 13850, max: 52850 },
      { rate: 22, min: 52850, max: 84350 },
      { rate: 24, min: 84350, max: 161100 },
      { rate: 32, min: 161100, max: 204100 },
      { rate: 35, min: 204100, max: 510300 },
      { rate: 37, min: 510300, max: null },
    ],
  },
  2020: {
    single: [
      { rate: 10, min: 0, max: 9875 },
      { rate: 12, min: 9875, max: 40125 },
      { rate: 22, min: 40125, max: 85525 },
      { rate: 24, min: 85525, max: 164925 },
      { rate: 32, min: 164925, max: 207650 },
      { rate: 35, min: 207650, max: 518400 },
      { rate: 37, min: 518400, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 19750 },
      { rate: 12, min: 19750, max: 80250 },
      { rate: 22, min: 80250, max: 171050 },
      { rate: 24, min: 171050, max: 326850 },
      { rate: 32, min: 326850, max: 414700 },
      { rate: 35, min: 414700, max: 622050 },
      { rate: 37, min: 622050, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 9875 },
      { rate: 12, min: 9875, max: 40125 },
      { rate: 22, min: 40125, max: 85525 },
      { rate: 24, min: 85525, max: 164925 },
      { rate: 32, min: 164925, max: 207350 },
      { rate: 35, min: 207350, max: 311025 },
      { rate: 37, min: 311025, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 14100 },
      { rate: 12, min: 14100, max: 53700 },
      { rate: 22, min: 53700, max: 85500 },
      { rate: 24, min: 85500, max: 165600 },
      { rate: 32, min: 165600, max: 207200 },
      { rate: 35, min: 207200, max: 518400 },
      { rate: 37, min: 518400, max: null },
    ],
  },
  2021: {
    single: [
      { rate: 10, min: 0, max: 9950 },
      { rate: 12, min: 9950, max: 40125 },
      { rate: 22, min: 40125, max: 86375 },
      { rate: 24, min: 86375, max: 164925 },
      { rate: 32, min: 164925, max: 209425 },
      { rate: 35, min: 209425, max: 523600 },
      { rate: 37, min: 523600, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 19900 },
      { rate: 12, min: 19900, max: 81050 },
      { rate: 22, min: 81050, max: 172750 },
      { rate: 24, min: 172750, max: 329850 },
      { rate: 32, min: 329850, max: 418850 },
      { rate: 35, min: 418850, max: 628300 },
      { rate: 37, min: 628300, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 9950 },
      { rate: 12, min: 9950, max: 40125 },
      { rate: 22, min: 40125, max: 86375 },
      { rate: 24, min: 86375, max: 164925 },
      { rate: 32, min: 164925, max: 209425 },
      { rate: 35, min: 209425, max: 314150 },
      { rate: 37, min: 314150, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 14100 },
      { rate: 12, min: 14100, max: 53900 },
      { rate: 22, min: 53900, max: 86350 },
      { rate: 24, min: 86350, max: 165100 },
      { rate: 32, min: 165100, max: 209400 },
      { rate: 35, min: 209400, max: 523600 },
      { rate: 37, min: 523600, max: null },
    ],
  },
  2022: {
    single: [
      { rate: 10, min: 0, max: 10275 },
      { rate: 12, min: 10275, max: 41775 },
      { rate: 22, min: 41775, max: 89475 },
      { rate: 24, min: 89475, max: 170050 },
      { rate: 32, min: 170050, max: 215950 },
      { rate: 35, min: 215950, max: 539900 },
      { rate: 37, min: 539900, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 20550 },
      { rate: 12, min: 20550, max: 83550 },
      { rate: 22, min: 83550, max: 178950 },
      { rate: 24, min: 178950, max: 340100 },
      { rate: 32, min: 340100, max: 431900 },
      { rate: 35, min: 431900, max: 647850 },
      { rate: 37, min: 647850, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 10275 },
      { rate: 12, min: 10275, max: 41775 },
      { rate: 22, min: 41775, max: 89475 },
      { rate: 24, min: 89475, max: 170050 },
      { rate: 32, min: 170050, max: 215950 },
      { rate: 35, min: 215950, max: 323925 },
      { rate: 37, min: 323925, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 14600 },
      { rate: 12, min: 14600, max: 55900 },
      { rate: 22, min: 55900, max: 89350 },
      { rate: 24, min: 89350, max: 170050 },
      { rate: 32, min: 170050, max: 215950 },
      { rate: 35, min: 215950, max: 539900 },
      { rate: 37, min: 539900, max: null },
    ],
  },
  2023: {
    single: [
      { rate: 10, min: 0, max: 11000 },
      { rate: 12, min: 11000, max: 44725 },
      { rate: 22, min: 44725, max: 95375 },
      { rate: 24, min: 95375, max: 182100 },
      { rate: 32, min: 182100, max: 231250 },
      { rate: 35, min: 231250, max: 578125 },
      { rate: 37, min: 578125, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 22000 },
      { rate: 12, min: 22000, max: 89450 },
      { rate: 22, min: 89450, max: 190750 },
      { rate: 24, min: 190750, max: 364200 },
      { rate: 32, min: 364200, max: 462500 },
      { rate: 35, min: 462500, max: 693750 },
      { rate: 37, min: 693750, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 11000 },
      { rate: 12, min: 11000, max: 44725 },
      { rate: 22, min: 44725, max: 95375 },
      { rate: 24, min: 95375, max: 182100 },
      { rate: 32, min: 182100, max: 231250 },
      { rate: 35, min: 231250, max: 346875 },
      { rate: 37, min: 346875, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 15700 },
      { rate: 12, min: 15700, max: 59850 },
      { rate: 22, min: 59850, max: 95350 },
      { rate: 24, min: 95350, max: 182100 },
      { rate: 32, min: 182100, max: 231250 },
      { rate: 35, min: 231250, max: 578100 },
      { rate: 37, min: 578100, max: null },
    ],
  },
  2024: {
    single: [
      { rate: 10, min: 0, max: 11600 },
      { rate: 12, min: 11600, max: 47150 },
      { rate: 22, min: 47150, max: 100525 },
      { rate: 24, min: 100525, max: 191950 },
      { rate: 32, min: 191950, max: 243725 },
      { rate: 35, min: 243725, max: 609350 },
      { rate: 37, min: 609350, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 23200 },
      { rate: 12, min: 23200, max: 94300 },
      { rate: 22, min: 94300, max: 201050 },
      { rate: 24, min: 201050, max: 383900 },
      { rate: 32, min: 383900, max: 487450 },
      { rate: 35, min: 487450, max: 731200 },
      { rate: 37, min: 731200, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 11600 },
      { rate: 12, min: 11600, max: 47150 },
      { rate: 22, min: 47150, max: 100525 },
      { rate: 24, min: 100525, max: 191950 },
      { rate: 32, min: 191950, max: 243725 },
      { rate: 35, min: 243725, max: 365600 },
      { rate: 37, min: 365600, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 16550 },
      { rate: 12, min: 16550, max: 63100 },
      { rate: 22, min: 63100, max: 100525 },
      { rate: 24, min: 100525, max: 191950 },
      { rate: 32, min: 191950, max: 243700 },
      { rate: 35, min: 243700, max: 609350 },
      { rate: 37, min: 609350, max: null },
    ],
  },
  2025: {
    single: [
      { rate: 10, min: 0, max: 11925 },
      { rate: 12, min: 11925, max: 48475 },
      { rate: 22, min: 48475, max: 103350 },
      { rate: 24, min: 103350, max: 197300 },
      { rate: 32, min: 197300, max: 250525 },
      { rate: 35, min: 250525, max: 626350 },
      { rate: 37, min: 626350, max: null },
    ],
    married_joint: [
      { rate: 10, min: 0, max: 23850 },
      { rate: 12, min: 23850, max: 96950 },
      { rate: 22, min: 96950, max: 206700 },
      { rate: 24, min: 206700, max: 394600 },
      { rate: 32, min: 394600, max: 501050 },
      { rate: 35, min: 501050, max: 751600 },
      { rate: 37, min: 751600, max: null },
    ],
    married_separate: [
      { rate: 10, min: 0, max: 11925 },
      { rate: 12, min: 11925, max: 48475 },
      { rate: 22, min: 48475, max: 103350 },
      { rate: 24, min: 103350, max: 197300 },
      { rate: 32, min: 197300, max: 250525 },
      { rate: 35, min: 250525, max: 375800 },
      { rate: 37, min: 375800, max: null },
    ],
    head_of_household: [
      { rate: 10, min: 0, max: 17000 },
      { rate: 12, min: 17000, max: 64850 },
      { rate: 22, min: 64850, max: 103350 },
      { rate: 24, min: 103350, max: 197300 },
      { rate: 32, min: 197300, max: 250500 },
      { rate: 35, min: 250500, max: 626350 },
      { rate: 37, min: 626350, max: null },
    ],
  },
}

const STANDARD_DEDUCTIONS: Record<number, Record<string, number>> = {
  2015: {
    single: 6300,
    married_joint: 12600,
    married_separate: 6300,
    head_of_household: 9300,
  },
  2016: {
    single: 6350,
    married_joint: 12700,
    married_separate: 6350,
    head_of_household: 9350,
  },
  2017: {
    single: 6350,
    married_joint: 12700,
    married_separate: 6350,
    head_of_household: 9350,
  },
  2018: {
    single: 12000,
    married_joint: 24000,
    married_separate: 12000,
    head_of_household: 18000,
  },
  2019: {
    single: 12200,
    married_joint: 24400,
    married_separate: 12200,
    head_of_household: 18350,
  },
  2020: {
    single: 12400,
    married_joint: 24800,
    married_separate: 12400,
    head_of_household: 18650,
  },
  2021: {
    single: 12550,
    married_joint: 25100,
    married_separate: 12550,
    head_of_household: 18900,
  },
  2022: {
    single: 12950,
    married_joint: 25900,
    married_separate: 12950,
    head_of_household: 19400,
  },
  2023: {
    single: 13850,
    married_joint: 27700,
    married_separate: 13850,
    head_of_household: 20800,
  },
  2024: {
    single: 14600,
    married_joint: 29200,
    married_separate: 14600,
    head_of_household: 21900,
  },
  2025: {
    single: 15000,
    married_joint: 30000,
    married_separate: 15000,
    head_of_household: 22500,
  },
}

function calculateTaxForYear(
  annualIncome: number,
  filingStatus: string,
  year: number
): USTaxResult {
  const brackets =
    TAX_BRACKETS[year]?.[filingStatus] || TAX_BRACKETS[2025][filingStatus]
  const standardDeduction =
    STANDARD_DEDUCTIONS[year]?.[filingStatus] ||
    STANDARD_DEDUCTIONS[2025][filingStatus]

  const taxableIncome = Math.max(0, annualIncome - standardDeduction)

  let taxLiability = 0
  let marginalRate = brackets[0].rate
  const bracketBreakdown: Array<{
    rate: number
    incomeInBracket: number
    taxInBracket: number
  }> = []

  let remainingIncome = taxableIncome

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break

    const bracketRange =
      bracket.max === null ? remainingIncome : bracket.max - bracket.min
    const incomeInBracket = Math.min(remainingIncome, bracketRange)
    const taxInBracket = incomeInBracket * (bracket.rate / 100)

    taxLiability += taxInBracket
    marginalRate = bracket.rate
    remainingIncome -= incomeInBracket

    bracketBreakdown.push({
      rate: bracket.rate,
      incomeInBracket,
      taxInBracket,
    })
  }

  const effectiveRate =
    taxableIncome > 0 ? (taxLiability / taxableIncome) * 100 : 0

  return {
    taxableIncome: Math.round(taxableIncome),
    taxLiability: Math.round(taxLiability),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    marginalRate,
    brackets: bracketBreakdown,
  }
}

export function calculateUSTax(input: USTaxInput): USTaxComparison {
  const currentYear = calculateTaxForYear(
    input.annualIncome,
    input.filingStatus,
    input.year
  )

  const previousYears: Array<{
    year: number
    result: USTaxResult
    change: number
  }> = []
  const yearsToCompare = [2024, 2023, 2022, 2021, 2020, 2018, 2015]

  for (const year of yearsToCompare) {
    if (year === input.year) continue
    const result = calculateTaxForYear(
      input.annualIncome,
      input.filingStatus,
      year
    )
    previousYears.push({
      year,
      result,
      change: Math.round(result.taxLiability - currentYear.taxLiability),
    })
  }

  return {
    currentYear,
    previousYears,
  }
}

export function getAvailableYears(): Array<number> {
  return Object.keys(TAX_BRACKETS)
    .map(Number)
    .sort((a, b) => a - b)
}

export function getBracketsForYear(
  year: number,
  filingStatus: string
): Array<USTaxBracket> {
  return TAX_BRACKETS[year]?.[filingStatus] || []
}

export function getStandardDeduction(
  year: number,
  filingStatus: string
): number {
  const statusMap: Record<string, string> = {
    single: "single",
    married_joint: "married_joint",
    married_separate: "married_separate",
    head_of_household: "head_of_household",
  }
  return STANDARD_DEDUCTIONS[year]?.[statusMap[filingStatus]] || 0
}
