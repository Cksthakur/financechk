export interface McxPositionInput {
  accountCapital: number
  riskPercentage: number
  entryPrice: number
  stopLossPrice: number
}

export interface McxPositionResult {
  maxRiskAmount: number
  pointsRisk: number

  // Mega Contract (100 barrels)
  megaLotSize: number
  megaRiskPerLot: number
  megaLotsAllowed: number
  megaActualRisk: number
  megaMarginRequired: number
  megaMarginSufficient: boolean

  // Mini Contract (10 barrels)
  miniLotSize: number
  miniRiskPerLot: number
  miniLotsAllowed: number
  miniActualRisk: number
  miniMarginRequired: number
  miniMarginSufficient: boolean
}

/**
 * Calculates optimal position size for MCX Crude Oil based on risk parameters
 */
export function calculateMcxPosition(
  input: McxPositionInput
): McxPositionResult {
  const { accountCapital, riskPercentage, entryPrice, stopLossPrice } = input

  // Constants based on MCX specifications
  const MEGA_LOT_SIZE = 100
  const MINI_LOT_SIZE = 10
  // Approximate margin requirement per lot (assuming ~20% span+exposure on ₹6.5L contract value)
  // Actual margin fluctuates daily with volatility, but 1,20,000 for mega is a safe working estimate for retail traders.
  const MEGA_MARGIN = entryPrice * MEGA_LOT_SIZE * 0.2
  const MINI_MARGIN = entryPrice * MINI_LOT_SIZE * 0.2

  const maxRiskAmount = accountCapital * (riskPercentage / 100)
  const pointsRisk = Math.abs(entryPrice - stopLossPrice)

  // Edge case handling
  if (pointsRisk === 0) {
    return {
      maxRiskAmount,
      pointsRisk,
      megaLotSize: MEGA_LOT_SIZE,
      megaRiskPerLot: 0,
      megaLotsAllowed: 0,
      megaActualRisk: 0,
      megaMarginRequired: 0,
      megaMarginSufficient: false,
      miniLotSize: MINI_LOT_SIZE,
      miniRiskPerLot: 0,
      miniLotsAllowed: 0,
      miniActualRisk: 0,
      miniMarginRequired: 0,
      miniMarginSufficient: false,
    }
  }

  // Mega Calculations
  const megaRiskPerLot = pointsRisk * MEGA_LOT_SIZE
  const megaLotsAllowedByRisk = Math.floor(maxRiskAmount / megaRiskPerLot)
  const megaLotsAllowedByMargin = Math.floor(accountCapital / MEGA_MARGIN)
  const megaLotsAllowed = Math.min(
    megaLotsAllowedByRisk,
    megaLotsAllowedByMargin
  )

  const megaActualRisk = megaLotsAllowed * megaRiskPerLot
  const megaMarginRequired = megaLotsAllowed * MEGA_MARGIN
  const megaMarginSufficient = accountCapital >= MEGA_MARGIN

  // Mini Calculations
  const miniRiskPerLot = pointsRisk * MINI_LOT_SIZE
  const miniLotsAllowedByRisk = Math.floor(maxRiskAmount / miniRiskPerLot)
  const miniLotsAllowedByMargin = Math.floor(accountCapital / MINI_MARGIN)
  const miniLotsAllowed = Math.min(
    miniLotsAllowedByRisk,
    miniLotsAllowedByMargin
  )

  const miniActualRisk = miniLotsAllowed * miniRiskPerLot
  const miniMarginRequired = miniLotsAllowed * MINI_MARGIN
  const miniMarginSufficient = accountCapital >= MINI_MARGIN

  return {
    maxRiskAmount: Math.round(maxRiskAmount),
    pointsRisk: Number(pointsRisk.toFixed(2)),

    megaLotSize: MEGA_LOT_SIZE,
    megaRiskPerLot: Math.round(megaRiskPerLot),
    megaLotsAllowed,
    megaActualRisk: Math.round(megaActualRisk),
    megaMarginRequired: Math.round(megaMarginRequired),
    megaMarginSufficient,

    miniLotSize: MINI_LOT_SIZE,
    miniRiskPerLot: Math.round(miniRiskPerLot),
    miniLotsAllowed,
    miniActualRisk: Math.round(miniActualRisk),
    miniMarginRequired: Math.round(miniMarginRequired),
    miniMarginSufficient,
  }
}
