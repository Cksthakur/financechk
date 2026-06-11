import { describe, expect, it } from "vitest"
import { generateRentReceipts } from "../rent-receipt"

describe("Rent Receipt Generator", () => {
  it("creates monthly receipts across a selected range", () => {
    const result = generateRentReceipts({
      tenantName: "Aarav Singh",
      landlordName: "Meera Verma",
      landlordAddress: "22 Park Street, Delhi",
      propertyAddress: "Flat 5C, Green Residency, Delhi",
      monthlyRent: 24000,
      fromMonth: "2025-04",
      toMonth: "2025-09",
      landlordPan: "ABCDE1234F",
    })

    expect(result.monthCount).toBe(6)
    expect(result.totalRentForPeriod).toBe(144000)
    expect(result.receipts[0]?.monthLabel).toBe("April 2025")
    expect(result.receipts[5]?.monthLabel).toBe("September 2025")
  })

  it("flags PAN required when annual rent exceeds one lakh", () => {
    const result = generateRentReceipts({
      tenantName: "Riya",
      landlordName: "Karan",
      landlordAddress: "Pune",
      propertyAddress: "Pune",
      monthlyRent: 9000,
      fromMonth: "2026-01",
      toMonth: "2026-03",
    })

    expect(result.panRequired).toBe(true)
    expect(result.panMissing).toBe(true)
  })

  it("handles reversed month range safely", () => {
    const result = generateRentReceipts({
      tenantName: "Nila",
      landlordName: "Irfan",
      landlordAddress: "Mumbai",
      propertyAddress: "Mumbai",
      monthlyRent: 5000,
      fromMonth: "2026-10",
      toMonth: "2026-08",
      landlordPan: "AAAPA1111A",
    })

    expect(result.monthCount).toBe(3)
    expect(result.receipts[0]?.monthLabel).toBe("August 2026")
    expect(result.receipts[2]?.monthLabel).toBe("October 2026")
  })
})
