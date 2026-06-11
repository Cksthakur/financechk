export type FoInstrumentType = "futures" | "options"
export type BrokerageModel = "flat" | "percent"
export type Exchange = "nse" | "bse"

export interface FoBrokerageInput {
  instrumentType: FoInstrumentType
  buyPrice: number
  sellPrice: number
  quantity: number
  brokerageModel: BrokerageModel
  brokerageFlatPerOrder: number
  brokeragePercentPerOrder: number
  exchange: Exchange
}

export interface FoBrokerageResult {
  turnover: number
  grossPnL: number
  brokerage: number
  stt: number
  exchangeCharge: number
  sebiCharge: number
  gst: number
  stampDuty: number
  totalCharges: number
  netPnL: number
  breakEvenPoints: number
  breakEvenPercent: number
}

function round2(value: number): number {
  return Number(value.toFixed(2))
}

function getExchangeRate(
  exchange: Exchange,
  instrumentType: FoInstrumentType
): number {
  if (instrumentType === "futures") {
    return exchange === "nse" ? 0.00002 : 0.00002
  }

  return exchange === "nse" ? 0.00053 : 0.00053
}

function calculateBrokeragePerOrder(
  orderTurnover: number,
  model: BrokerageModel,
  flatPerOrder: number,
  percentPerOrder: number
): number {
  if (model === "flat") {
    return Math.min(Math.max(0, flatPerOrder), 20)
  }

  const percentCharge = orderTurnover * (Math.max(0, percentPerOrder) / 100)
  return Math.min(percentCharge, 20)
}

/**
 * Calculates all-in futures/options trading charges with break-even.
 */
export function calculateFoBrokerage(
  input: FoBrokerageInput
): FoBrokerageResult {
  const buyPrice = Math.max(0, input.buyPrice)
  const sellPrice = Math.max(0, input.sellPrice)
  const quantity = Math.max(0, Math.round(input.quantity))

  if (quantity === 0) {
    return {
      turnover: 0,
      grossPnL: 0,
      brokerage: 0,
      stt: 0,
      exchangeCharge: 0,
      sebiCharge: 0,
      gst: 0,
      stampDuty: 0,
      totalCharges: 0,
      netPnL: 0,
      breakEvenPoints: 0,
      breakEvenPercent: 0,
    }
  }

  const buyTurnover = buyPrice * quantity
  const sellTurnover = sellPrice * quantity
  const turnover = buyTurnover + sellTurnover
  const grossPnL = sellTurnover - buyTurnover

  const brokerageBuy = calculateBrokeragePerOrder(
    buyTurnover,
    input.brokerageModel,
    input.brokerageFlatPerOrder,
    input.brokeragePercentPerOrder
  )
  const brokerageSell = calculateBrokeragePerOrder(
    sellTurnover,
    input.brokerageModel,
    input.brokerageFlatPerOrder,
    input.brokeragePercentPerOrder
  )
  const brokerage = round2(brokerageBuy + brokerageSell)

  const sttRate = input.instrumentType === "futures" ? 0.0005 : 0.0015
  const stt = Math.round(sellTurnover * sttRate)

  const exchangeRate = getExchangeRate(input.exchange, input.instrumentType)
  const exchangeCharge = round2(turnover * exchangeRate)

  const sebiCharge = round2(turnover * 0.000001)

  const gst = round2((brokerage + exchangeCharge + sebiCharge) * 0.18)

  const stampDutyRate = input.instrumentType === "futures" ? 0.00002 : 0.00003
  const stampDuty = Math.round(buyTurnover * stampDutyRate)

  const totalCharges = round2(
    brokerage + stt + exchangeCharge + sebiCharge + gst + stampDuty
  )
  const netPnL = round2(grossPnL - totalCharges)

  const breakEvenPoints = round2(totalCharges / quantity)
  const breakEvenPercent =
    buyPrice > 0 ? round2((breakEvenPoints / buyPrice) * 100) : 0

  return {
    turnover: round2(turnover),
    grossPnL: round2(grossPnL),
    brokerage,
    stt,
    exchangeCharge,
    sebiCharge,
    gst,
    stampDuty,
    totalCharges,
    netPnL,
    breakEvenPoints,
    breakEvenPercent,
  }
}
