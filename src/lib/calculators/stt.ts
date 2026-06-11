export type SttTradeType =
  | "equity-delivery"
  | "intraday-equity"
  | "futures"
  | "options-sell"
  | "options-exercise"

export interface SttInput {
  tradeType: SttTradeType
  buyValue?: number
  sellValue?: number
  intrinsicValue?: number
}

export interface SttResult {
  tradeType: SttTradeType
  taxableBase: number
  ratePercent: number
  buySideStt: number
  sellSideStt: number
  totalStt: number
  roundingNote: string
}

function clampCurrency(value: number | undefined): number {
  return Math.max(0, Number.isFinite(value) ? Number(value) : 0)
}

/**
 * Estimate Securities Transaction Tax (STT) for common equity and F&O cases.
 */
export function calculateStt(input: SttInput): SttResult {
  const buyValue = clampCurrency(input.buyValue)
  const sellValue = clampCurrency(input.sellValue)
  const intrinsicValue = clampCurrency(input.intrinsicValue)

  let ratePercent = 0
  let buySideStt = 0
  let sellSideStt = 0
  let taxableBase = 0

  switch (input.tradeType) {
    case "equity-delivery": {
      ratePercent = 0.1
      buySideStt = Math.round(buyValue * 0.001)
      sellSideStt = Math.round(sellValue * 0.001)
      taxableBase = buyValue + sellValue
      break
    }

    case "intraday-equity": {
      ratePercent = 0.025
      sellSideStt = Math.round(sellValue * 0.00025)
      taxableBase = sellValue
      break
    }

    case "futures": {
      ratePercent = 0.05
      sellSideStt = Math.round(sellValue * 0.0005)
      taxableBase = sellValue
      break
    }

    case "options-sell": {
      ratePercent = 0.15
      sellSideStt = Math.round(sellValue * 0.0015)
      taxableBase = sellValue
      break
    }

    case "options-exercise": {
      ratePercent = 0.15
      sellSideStt = Math.round(intrinsicValue * 0.0015)
      taxableBase = intrinsicValue
      break
    }
  }

  return {
    tradeType: input.tradeType,
    taxableBase: Math.round(taxableBase),
    ratePercent,
    buySideStt,
    sellSideStt,
    totalStt: buySideStt + sellSideStt,
    roundingNote: "Rounded to nearest rupee",
  }
}
