/**
 * Format a number in Indian numbering system (1,00,000 instead of 100,000)
 */
export function formatIndianNumber(num: number): string {
  const isNegative = num < 0
  const absNum = Math.abs(Math.round(num))
  const str = absNum.toString()

  if (str.length <= 3) return (isNegative ? "-" : "") + str

  const lastThree = str.slice(-3)
  const rest = str.slice(0, -3)
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree

  return (isNegative ? "-" : "") + formatted
}

/**
 * Format as Indian currency with ₹ symbol
 */
export function formatCurrency(num: number): string {
  return `₹${formatIndianNumber(num)}`
}

/**
 * Format as compact Indian currency (lakhs/crores)
 */
export function formatCompactCurrency(num: number): string {
  const sign = num < 0 ? "-" : ""
  const absNum = Math.abs(num)

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  })

  if (absNum >= 1_00_00_000) {
    return `${sign}₹${(absNum / 1_00_00_000).toFixed(2)} Cr`
  }

  if (absNum >= 1_00_000) {
    return `${sign}₹${(absNum / 1_00_000).toFixed(2)} L`
  }

  return formatter.format(num)
}

/**
 * Format as USD currency with $ symbol
 */
export function formatUSD(num: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(num)
}

/**
 * Format as compact USD currency (K, M, B)
 */
export function formatCompactUSD(num: number): string {
  const absNum = Math.abs(num)
  const sign = num < 0 ? "-" : ""

  if (absNum >= 1_000_000_000) {
    return `${sign}$${(absNum / 1_000_000_000).toFixed(2)}B`
  }

  if (absNum >= 1_000_000) {
    return `${sign}$${(absNum / 1_000_000).toFixed(2)}M`
  }

  if (absNum >= 1_000) {
    return `${sign}$${(absNum / 1_000).toFixed(1)}K`
  }

  return `${sign}$${absNum.toFixed(0)}`
}

/**
 * Format percentage
 */
export function formatPercent(num: number, decimals = 2): string {
  return `${num.toFixed(decimals)}%`
}

/**
 * Parse Indian formatted number string back to number
 */
export function parseIndianNumber(str: string): number {
  const cleaned = str.replace(/[₹,\s]/g, "")
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
