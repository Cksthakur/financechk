import { describe, expect, it } from "vitest"
import { generateTaxProofPack } from "../tax-proof-pack"

describe("Tax Proof Pack Generator", () => {
  it("creates payroll submission assets", () => {
    const result = generateTaxProofPack({
      employeeName: "Rajat Das",
      employeeId: "EMP1029",
      employerName: "FinanceChk Labs",
      financialYear: "2026-27",
      assessmentYear: "2027-28",
      annualBasicSalary: 900000,
      annualHraReceived: 300000,
      annualRentPaid: 360000,
      section80cInvestments: 150000,
      section80dPremium: 25000,
      npsContribution: 50000,
      homeLoanInterest: 180000,
      educationLoanInterest: 0,
      ltaClaim: 0,
      contactEmail: "rajat@example.com",
    })

    expect(result.coverEmailDraft).toContain("FY 2026-27")
    expect(result.submissionChecklist.length).toBeGreaterThan(4)
    expect(result.monthlyReminderPlan.length).toBe(6)
    expect(result.fileNamingGuide[0]).toContain("2026-27")
  })
})
