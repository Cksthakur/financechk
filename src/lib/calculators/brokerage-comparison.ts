export type TradeSegment = "delivery" | "intraday" | "futures" | "options"

export interface BrokerageComparisonInput {
  segment: TradeSegment
  tradesPerMonth: number
  avgTradeValue: number // Per trade turnover
}

export interface BrokerageComparisonResult {
  discountBrokerMonthly: number
  discountBrokerYearly: number
  fullServiceMonthly: number
  fullServiceYearly: number
  yearlySavings: number
  opportunityCost10Years: number // Wealth generated if savings were invested at 12%
}

/**
 * Calculates and compares brokerage costs between Discount and Full-Service brokers
 */
export function calculateBrokerageComparison(
  input: BrokerageComparisonInput
): BrokerageComparisonResult {
  const { segment, tradesPerMonth, avgTradeValue } = input

  let discountPerTrade = 0
  let fullServicePerTrade = 0

  switch (segment) {
    case "delivery":
      discountPerTrade = 0
      fullServicePerTrade = avgTradeValue * 0.0055 // 0.55%
      break
    case "intraday":
      discountPerTrade = Math.min(avgTradeValue * 0.0003, 20) // 0.03% or Rs 20
      fullServicePerTrade = avgTradeValue * 0.0005 // 0.05%
      break
    case "futures":
      discountPerTrade = Math.min(avgTradeValue * 0.0003, 20)
      fullServicePerTrade = avgTradeValue * 0.0005
      break
    case "options":
      discountPerTrade = 20 // Flat Rs 20
      fullServicePerTrade = 50 // Typical full service flat or per lot, using 50 for comparison
      break
  }

  // Multiply by 2 because a "trade" involves both buy and sell legs
  const discountTotalPerTrade = discountPerTrade * 2
  const fullServiceTotalPerTrade = fullServicePerTrade * 2

  const discountBrokerMonthly = discountTotalPerTrade * tradesPerMonth
  const discountBrokerYearly = discountBrokerMonthly * 12

  const fullServiceMonthly = fullServiceTotalPerTrade * tradesPerMonth
  const fullServiceYearly = fullServiceMonthly * 12

  const yearlySavings = fullServiceYearly - discountBrokerYearly

  // Opportunity cost: If yearlySavings were invested in an index fund at 12% for 10 years
  // FV = P * (((1 + r)^n - 1) / r) * (1 + r)
  const r = 12 / 100
  const n = 10
  let opportunityCost10Years = 0
  if (yearlySavings > 0) {
    opportunityCost10Years =
      yearlySavings * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  }

  return {
    discountBrokerMonthly: Math.round(discountBrokerMonthly),
    discountBrokerYearly: Math.round(discountBrokerYearly),
    fullServiceMonthly: Math.round(fullServiceMonthly),
    fullServiceYearly: Math.round(fullServiceYearly),
    yearlySavings: Math.round(yearlySavings),
    opportunityCost10Years: Math.round(opportunityCost10Years),
  }
}
