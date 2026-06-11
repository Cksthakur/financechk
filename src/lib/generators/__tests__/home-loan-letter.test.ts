import { describe, expect, it } from "vitest"
import { generateHomeLoanLetter } from "../home-loan-letter"

describe("Home Loan Letter Generator", () => {
  it("generates branch letter and checklist", () => {
    const result = generateHomeLoanLetter({
      letterType: "prepayment-request",
      borrowerName: "Rajat Das",
      coBorrowerName: "",
      loanAccountNumber: "HL123456",
      bankName: "ABC Bank",
      branchName: "Koramangala",
      city: "Bengaluru",
      requestDate: "2026-04-17",
      requestedActionDate: "2026-04-25",
      contactEmail: "rajat@example.com",
      contactPhone: "9999999999",
      details: "Please post prepayment toward principal only.",
    })

    expect(result.subjectLine).toContain("HL123456")
    expect(result.branchLetter).toContain("ABC Bank")
    expect(result.emailDraft).toContain("Home Loan Prepayment Request")
    expect(result.documentChecklist.length).toBeGreaterThan(2)
    expect(result.followUpPlan.length).toBe(5)
  })
})
