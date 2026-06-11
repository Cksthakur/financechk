import { describe, expect, it } from "vitest"
import { generateIncomeTaxNoticeReply } from "../income-tax-notice-reply"

describe("Income Tax Notice Reply Generator", () => {
  it("creates subject line and draft with notice details", () => {
    const result = generateIncomeTaxNoticeReply({
      noticeType: "143-1-mismatch",
      fullName: "Rajat Das",
      pan: "abcde1234f",
      assessmentYear: "2026-27",
      noticeDate: "2026-07-15",
      noticeReference: "DIN-123",
      issueSummary: "Mismatch in AIS salary entry",
      amountInDispute: 22000,
      jurisdiction: "Assessing Officer, CPC",
      contactEmail: "rajat@example.com",
      contactPhone: "9999999999",
      filingDate: "2026-07-20",
      additionalContext: "Tax already deducted and reflected in Form 26AS.",
    })

    expect(result.subjectLine).toContain("AY 2026-27")
    expect(result.subjectLine).toContain("ABCDE1234F")
    expect(result.draftReply).toContain("DIN-123")
    expect(result.documentChecklist.length).toBeGreaterThan(3)
    expect(result.actionPlan48h.length).toBe(5)
  })
})
