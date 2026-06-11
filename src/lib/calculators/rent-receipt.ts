export interface RentReceiptInput {
  tenantName: string
  landlordName: string
  landlordAddress: string
  propertyAddress: string
  monthlyRent: number
  fromMonth: string
  toMonth: string
  landlordPan?: string
}

export interface GeneratedRentReceipt {
  receiptNumber: string
  monthLabel: string
  year: number
  month: number
  rentAmount: number
  tenantName: string
  landlordName: string
  landlordAddress: string
  propertyAddress: string
  landlordPan?: string
}

export interface RentReceiptResult {
  receipts: Array<GeneratedRentReceipt>
  monthCount: number
  totalRentForPeriod: number
  annualizedRent: number
  panRequired: boolean
  panMissing: boolean
  suggestedRevenueStamp: boolean
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface ParsedMonth {
  year: number
  month: number
}

function parseMonth(value: string): ParsedMonth | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])

  if (!Number.isFinite(year) || !Number.isFinite(month)) return null
  if (month < 1 || month > 12) return null

  return { year, month }
}

function getCurrentMonth(): ParsedMonth {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

function monthIndex(value: ParsedMonth): number {
  return value.year * 12 + (value.month - 1)
}

function monthFromIndex(index: number): ParsedMonth {
  return {
    year: Math.floor(index / 12),
    month: (index % 12) + 1,
  }
}

/**
 * Generate monthly rent receipts and HRA validation flags.
 */
export function generateRentReceipts(
  input: RentReceiptInput
): RentReceiptResult {
  const monthlyRent = Math.max(0, Math.round(input.monthlyRent))
  const tenantName = input.tenantName.trim()
  const landlordName = input.landlordName.trim()
  const landlordAddress = input.landlordAddress.trim()
  const propertyAddress = input.propertyAddress.trim()
  const landlordPan = input.landlordPan?.trim() || ""

  const parsedFrom = parseMonth(input.fromMonth)
  const parsedTo = parseMonth(input.toMonth)
  const fallbackMonth = getCurrentMonth()

  const startMonth = parsedFrom || parsedTo || fallbackMonth
  const endMonth = parsedTo || parsedFrom || fallbackMonth

  let startIndex = monthIndex(startMonth)
  let endIndex = monthIndex(endMonth)

  if (startIndex > endIndex) {
    const temp = startIndex
    startIndex = endIndex
    endIndex = temp
  }

  const maxReceipts = 60
  const receipts: Array<GeneratedRentReceipt> = []

  for (
    let idx = startIndex, serial = 1;
    idx <= endIndex && serial <= maxReceipts;
    idx += 1, serial += 1
  ) {
    const { year, month } = monthFromIndex(idx)
    const receiptNumber = `RR-${year}${String(month).padStart(2, "0")}-${String(serial).padStart(2, "0")}`

    receipts.push({
      receiptNumber,
      monthLabel: `${MONTH_NAMES[month - 1]} ${year}`,
      year,
      month,
      rentAmount: monthlyRent,
      tenantName,
      landlordName,
      landlordAddress,
      propertyAddress,
      landlordPan: landlordPan || undefined,
    })
  }

  const monthCount = receipts.length
  const totalRentForPeriod = monthlyRent * monthCount
  const annualizedRent = monthlyRent * 12
  const panRequired = annualizedRent > 100000
  const panMissing = panRequired && landlordPan.length === 0
  const suggestedRevenueStamp = monthlyRent > 5000

  return {
    receipts,
    monthCount,
    totalRentForPeriod,
    annualizedRent,
    panRequired,
    panMissing,
    suggestedRevenueStamp,
  }
}
