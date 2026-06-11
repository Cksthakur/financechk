export type Segment = "delivery" | "intraday" | "futures" | "options"

export interface BrokerageInput {
  buyPrice: number
  sellPrice: number
  quantity: number
  segment: Segment
}

export interface BrokerageResult {
  turnover: number
  brokerage: number
  stt: number
  exchangeTxnCharge: number
  gst: number
  sebiCharge: number
  stampDuty: number
  totalTaxAndCharges: number
  netPnL: number
  breakevenPoints: number
}

export function calculateBrokerage(input: BrokerageInput): BrokerageResult {
  const { buyPrice, sellPrice, quantity, segment } = input

  const buyTurnover = buyPrice * quantity
  const sellTurnover = sellPrice * quantity
  const totalTurnover = buyTurnover + sellTurnover

  let brokerageBuy = 0
  let brokerageSell = 0
  let stt = 0
  let exchangeTxnCharge = 0
  let stampDuty = 0

  switch (segment) {
    case "delivery":
      // Brokerage: ₹0
      brokerageBuy = 0
      brokerageSell = 0
      // STT: 0.1% on buy & sell
      stt = Math.round(buyTurnover * 0.001 + sellTurnover * 0.001)
      // Exchange: 0.00297% on NSE
      exchangeTxnCharge = totalTurnover * 0.0000297
      // Stamp Duty: 0.015% on buy side
      stampDuty = Math.round(buyTurnover * 0.00015)
      break

    case "intraday":
      // Brokerage: 0.03% or ₹20 (whichever is lower)
      brokerageBuy = Math.min(buyTurnover * 0.0003, 20)
      brokerageSell = Math.min(sellTurnover * 0.0003, 20)
      // STT: 0.025% on sell side
      stt = Math.round(sellTurnover * 0.00025)
      // Exchange: 0.00297% on NSE
      exchangeTxnCharge = totalTurnover * 0.0000297
      // Stamp Duty: 0.003% on buy side
      stampDuty = Math.round(buyTurnover * 0.00003)
      break

    case "futures":
      // Brokerage: 0.03% or ₹20 (whichever is lower)
      brokerageBuy = Math.min(buyTurnover * 0.0003, 20)
      brokerageSell = Math.min(sellTurnover * 0.0003, 20)
      // STT: 0.02% on sell side (April 2026/latest budget rates)
      stt = Math.round(sellTurnover * 0.0002)
      // Exchange: 0.00173% on NSE
      exchangeTxnCharge = totalTurnover * 0.0000173
      // Stamp Duty: 0.002% on buy side
      stampDuty = Math.round(buyTurnover * 0.00002)
      break

    case "options":
      // Brokerage: Flat ₹20 per executed order
      brokerageBuy = 20
      brokerageSell = 20
      // STT: 0.1% on sell side (on premium) - Updated budget rate
      stt = Math.round(sellTurnover * 0.001)
      // Exchange: 0.03503% on NSE
      exchangeTxnCharge = totalTurnover * 0.0003503
      // Stamp Duty: 0.003% on buy side
      stampDuty = Math.round(buyTurnover * 0.00003)
      break
  }

  const totalBrokerage = Number((brokerageBuy + brokerageSell).toFixed(2))
  exchangeTxnCharge = Number(exchangeTxnCharge.toFixed(2))

  // SEBI charges: ₹10 per crore (0.0001%)
  const sebiCharge = Number((totalTurnover * 0.000001).toFixed(2))

  // GST: 18% on (Brokerage + Exchange Txn + SEBI)
  const gst = Number(
    ((totalBrokerage + exchangeTxnCharge + sebiCharge) * 0.18).toFixed(2)
  )

  const totalTaxAndCharges = Number(
    (
      totalBrokerage +
      stt +
      exchangeTxnCharge +
      gst +
      sebiCharge +
      stampDuty
    ).toFixed(2)
  )

  const grossPnL = sellTurnover - buyTurnover
  const netPnL = Number((grossPnL - totalTaxAndCharges).toFixed(2))

  // Points to break even: Total charges divided by quantity
  const breakevenPoints =
    quantity > 0 ? Number((totalTaxAndCharges / quantity).toFixed(2)) : 0

  return {
    turnover: Number(totalTurnover.toFixed(2)),
    brokerage: totalBrokerage,
    stt,
    exchangeTxnCharge,
    gst,
    sebiCharge,
    stampDuty,
    totalTaxAndCharges,
    netPnL,
    breakevenPoints,
  }
}
