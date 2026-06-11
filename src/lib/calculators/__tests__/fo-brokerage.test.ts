import { describe, expect, it } from "vitest"
import { calculateFoBrokerage } from "../fo-brokerage"

describe("F&O Brokerage Calculator", () => {
  it("returns charges and break-even for futures trade", () => {
    const result = calculateFoBrokerage({
      instrumentType: "futures",
      buyPrice: 22000,
      sellPrice: 22150,
      quantity: 50,
      brokerageModel: "flat",
      brokerageFlatPerOrder: 20,
      brokeragePercentPerOrder: 0.03,
      exchange: "nse",
    })

    expect(result.totalCharges).toBeGreaterThan(0)
    expect(result.breakEvenPoints).toBeGreaterThan(0)
  })

  it("caps percentage brokerage per order at 20", () => {
    const result = calculateFoBrokerage({
      instrumentType: "options",
      buyPrice: 300,
      sellPrice: 340,
      quantity: 1000,
      brokerageModel: "percent",
      brokerageFlatPerOrder: 20,
      brokeragePercentPerOrder: 1,
      exchange: "nse",
    })

    expect(result.brokerage).toBe(40)
  })

  it("returns zeroes when quantity is zero", () => {
    const result = calculateFoBrokerage({
      instrumentType: "futures",
      buyPrice: 100,
      sellPrice: 110,
      quantity: 0,
      brokerageModel: "flat",
      brokerageFlatPerOrder: 20,
      brokeragePercentPerOrder: 0.03,
      exchange: "nse",
    })

    expect(result.totalCharges).toBe(0)
    expect(result.netPnL).toBe(0)
  })
})
