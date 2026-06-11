import { describe, expect, it } from "vitest"
import { calculateStt } from "../stt"

describe("STT Calculator", () => {
  it("computes equity delivery STT on both buy and sell", () => {
    const result = calculateStt({
      tradeType: "equity-delivery",
      buyValue: 200000,
      sellValue: 210000,
    })

    expect(result.buySideStt).toBe(200)
    expect(result.sellSideStt).toBe(210)
    expect(result.totalStt).toBe(410)
  })

  it("computes options STT on sell premium", () => {
    const result = calculateStt({
      tradeType: "options-sell",
      sellValue: 54000,
    })

    expect(result.totalStt).toBe(81)
  })

  it("computes options exercise STT on intrinsic value", () => {
    const result = calculateStt({
      tradeType: "options-exercise",
      intrinsicValue: 32000,
    })

    expect(result.totalStt).toBe(48)
  })
})
