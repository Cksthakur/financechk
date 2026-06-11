export interface TaxProofPackInput {
  employeeName: string
  employeeId: string
  employerName: string
  financialYear: string
  assessmentYear: string
  annualBasicSalary: number
  annualHraReceived: number
  annualRentPaid: number
  section80cInvestments: number
  section80dPremium: number
  npsContribution: number
  homeLoanInterest: number
  educationLoanInterest: number
  ltaClaim: number
  contactEmail: string
}

export interface TaxProofPackResult {
  coverEmailDraft: string
  submissionChecklist: Array<string>
  missingDocuments: Array<string>
  monthlyReminderPlan: Array<string>
  fileNamingGuide: Array<string>
  summaryNote: string
}

function normalizeText(value: string, fallback: string): string {
  const normalized = value.trim()
  return normalized || fallback
}

function safeAmount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.max(0, Math.round(value))
}

function inr(value: number): string {
  return value.toLocaleString("en-IN")
}

export function generateTaxProofPack(
  input: TaxProofPackInput
): TaxProofPackResult {
  const employeeName = normalizeText(input.employeeName, "[Employee Name]")
  const employeeId = normalizeText(input.employeeId, "[Employee ID]")
  const employerName = normalizeText(input.employerName, "[Employer Name]")
  const financialYear = normalizeText(input.financialYear, "[FY]")
  const assessmentYear = normalizeText(input.assessmentYear, "[AY]")
  const contactEmail = normalizeText(input.contactEmail, "[email@example.com]")

  const annualBasicSalary = safeAmount(input.annualBasicSalary)
  const annualHraReceived = safeAmount(input.annualHraReceived)
  const annualRentPaid = safeAmount(input.annualRentPaid)
  const section80cInvestments = safeAmount(input.section80cInvestments)
  const section80dPremium = safeAmount(input.section80dPremium)
  const npsContribution = safeAmount(input.npsContribution)
  const homeLoanInterest = safeAmount(input.homeLoanInterest)
  const educationLoanInterest = safeAmount(input.educationLoanInterest)
  const ltaClaim = safeAmount(input.ltaClaim)

  const submissionChecklist = [
    `Form 12BB filled and signed for FY ${financialYear}`,
    "PAN and Aadhaar copies (self-attested)",
    `80C investment proofs (declared: INR ${inr(section80cInvestments)})`,
    `80D premium payment receipts (declared: INR ${inr(section80dPremium)})`,
    `NPS contribution proof (declared: INR ${inr(npsContribution)})`,
    annualRentPaid > 0
      ? `Rent receipts + landlord PAN for HRA claim (annual rent: INR ${inr(annualRentPaid)})`
      : "HRA claim not opted",
    homeLoanInterest > 0
      ? `Home loan interest certificate (declared: INR ${inr(homeLoanInterest)})`
      : "Home-loan interest claim not opted",
    educationLoanInterest > 0
      ? `Education loan interest certificate (declared: INR ${inr(educationLoanInterest)})`
      : "Education-loan deduction not opted",
    ltaClaim > 0
      ? `LTA travel proof + boarding/booking references (claimed: INR ${inr(ltaClaim)})`
      : "LTA claim not opted",
  ]

  const missingDocuments: Array<string> = []

  if (section80cInvestments === 0) {
    missingDocuments.push(
      "No 80C proof value entered. Add EPF/PPF/ELSS/life-insurance proofs."
    )
  }
  if (annualRentPaid > 100000 && annualHraReceived > 0) {
    missingDocuments.push(
      "Landlord PAN is mandatory for annual rent above INR 1,00,000."
    )
  }
  if (homeLoanInterest > 0 && annualBasicSalary === 0) {
    missingDocuments.push(
      "Basic salary missing; verify payroll tax computation before submission."
    )
  }
  if (npsContribution > 50000) {
    missingDocuments.push(
      "Split NPS claim into 80CCD(1B) and employer NPS section for accurate payroll mapping."
    )
  }
  if (missingDocuments.length === 0) {
    missingDocuments.push(
      "No obvious gaps found from inputs. Recheck document names and dates before upload."
    )
  }

  const monthlyReminderPlan = [
    "April: Create tax-proof folder structure and payroll checklist for the new FY.",
    "June: Mid-quarter deduction review (80C/80D/NPS progress).",
    "September: HRA and rent-receipt completeness check for first half-year.",
    "December: Final proof collection before payroll declaration cutoff.",
    "January: Reconcile with payslips and submit missing proofs.",
    "March: Save final proofs + Form 16 cross-check notes for ITR filing.",
  ]

  const fileNamingGuide = [
    `${financialYear}_Form12BB_${employeeName.replace(/\s+/g, "-")}.pdf`,
    `${financialYear}_80C_Proofs_${employeeId}.pdf`,
    `${financialYear}_80D_Mediclaim_${employeeId}.pdf`,
    `${financialYear}_HRA_RentReceipts_${employeeId}.pdf`,
    `${financialYear}_HomeLoan_InterestCertificate_${employeeId}.pdf`,
    `${financialYear}_NPS_Contribution_${employeeId}.pdf`,
  ]

  const summaryNote = `Employee: ${employeeName} (${employeeId})\nEmployer: ${employerName}\nFY: ${financialYear} | AY: ${assessmentYear}\nDeclared: 80C INR ${inr(section80cInvestments)}, 80D INR ${inr(section80dPremium)}, NPS INR ${inr(npsContribution)}, HRA received INR ${inr(annualHraReceived)}, annual rent INR ${inr(annualRentPaid)}.`

  const coverEmailDraft = `Subject: Tax Proof Submission for FY ${financialYear} - ${employeeName} (${employeeId})\n\nHi Payroll Team,\n\nPlease find attached my tax proof documents for FY ${financialYear} (AY ${assessmentYear}).\n\nEmployee Name: ${employeeName}\nEmployee ID: ${employeeId}\nDeclared deductions include 80C, 80D, NPS, HRA and other applicable sections as per attached checklist.\n\nKindly confirm receipt and let me know if any additional document or clarification is required.\n\nRegards,\n${employeeName}\n${contactEmail}`

  return {
    coverEmailDraft,
    submissionChecklist,
    missingDocuments,
    monthlyReminderPlan,
    fileNamingGuide,
    summaryNote,
  }
}
