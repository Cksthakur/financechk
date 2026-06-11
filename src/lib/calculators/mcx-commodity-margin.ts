export type McxCommodity =
  | "crudeoilm"
  | "crudeoil"
  | "gold"
  | "gold-mini"
  | "silver"
  | "silver-mini"
  | "natural-gas"

export type McxTradeType = "intraday" | "overnight" | "positional"

export interface McxCommodityInput {
  commodity: McxCommodity
  lots: number
  lotSize: number
  tickValuePerLot: number
  entryPrice: number
  exitPrice?: number
  tradeType: McxTradeType
  spanMarginPercent: number
  exposureMarginPercent: number
  brokeragePerOrder: number
  otherCharges: number
}

export interface McxCommodityResult {
  commodity: McxCommodity
  lots: number
  lotSize: number
  tickValuePerLot: number
  contractValue: number
  spanMargin: number
  exposureMargin: number
  totalMarginRequired: number
  pnlPerTick: number
  realizedPnl: number | null
  brokerage: number
  ctt: number
  otherCharges: number
  totalCharges: number
  netPnlAfterCharges: number | null
}

function round2(value: number): number {
  return Number(value.toFixed(2))
}

/**
 * Calculates MCX margin estimate, P&L and charges.
 * Margin percentages are user-provided estimates from broker/contract screen.
 */
export function calculateMcxCommodityMargin(
  input: McxCommodityInput
): McxCommodityResult {
  const lots = Math.max(0, Math.floor(input.lots))
  const lotSize = Math.max(0, input.lotSize)
  const tickValuePerLot = Math.max(0, input.tickValuePerLot)
  const entryPrice = Math.max(0, input.entryPrice)
  const exitPrice =
    input.exitPrice === undefined ? undefined : Math.max(0, input.exitPrice)
  const spanMarginPercent = Math.max(0, input.spanMarginPercent)
  const exposureMarginPercent = Math.max(0, input.exposureMarginPercent)
  const brokeragePerOrder = Math.max(0, input.brokeragePerOrder)
  const otherCharges = Math.max(0, input.otherCharges)

  const contractValue = entryPrice * lotSize * lots
  const spanMargin = contractValue * (spanMarginPercent / 100)
  const exposureMargin = contractValue * (exposureMarginPercent / 100)
  const totalMarginRequired = spanMargin + exposureMargin

  const pnlPerTick = tickValuePerLot * lots

  const realizedPnl =
    exitPrice === undefined ? null : (exitPrice - entryPrice) * lotSize * lots

  const brokerage = brokeragePerOrder * 2

  const sellTurnover =
    (exitPrice === undefined ? entryPrice : exitPrice) * lotSize * lots
  const ctt = sellTurnover * 0.0001

  const totalCharges = brokerage + ctt + otherCharges

  return {
    commodity: input.commodity,
    lots,
    lotSize: round2(lotSize),
    tickValuePerLot: round2(tickValuePerLot),
    contractValue: round2(contractValue),
    spanMargin: round2(spanMargin),
    exposureMargin: round2(exposureMargin),
    totalMarginRequired: round2(totalMarginRequired),
    pnlPerTick: round2(pnlPerTick),
    realizedPnl: realizedPnl === null ? null : round2(realizedPnl),
    brokerage: round2(brokerage),
    ctt: round2(ctt),
    otherCharges: round2(otherCharges),
    totalCharges: round2(totalCharges),
    netPnlAfterCharges:
      realizedPnl === null ? null : round2(realizedPnl - totalCharges),
  }
}
