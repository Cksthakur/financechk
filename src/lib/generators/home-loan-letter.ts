export type HomeLoanLetterType =
  | "prepayment-request"
  | "roi-reduction-request"
  | "foreclosure-noc-request"
  | "interest-certificate-request"

export interface HomeLoanLetterInput {
  letterType: HomeLoanLetterType
  borrowerName: string
  coBorrowerName: string
  loanAccountNumber: string
  bankName: string
  branchName: string
  city: string
  requestDate: string
  requestedActionDate: string
  contactEmail: string
  contactPhone: string
  details: string
}

export interface HomeLoanLetterResult {
  letterTitle: string
  subjectLine: string
  branchLetter: string
  emailDraft: string
  documentChecklist: Array<string>
  followUpPlan: Array<string>
}

const LETTER_LABELS: Record<HomeLoanLetterType, string> = {
  "prepayment-request": "Home Loan Prepayment Request",
  "roi-reduction-request": "Interest Rate Reduction Request",
  "foreclosure-noc-request": "Foreclosure and NOC Request",
  "interest-certificate-request": "Interest Certificate Request",
}

const LETTER_DEFAULT_DETAILS: Record<HomeLoanLetterType, string> = {
  "prepayment-request":
    "I intend to make part-prepayment toward principal and request revised amortization schedule after posting the amount.",
  "roi-reduction-request":
    "I request a review and reduction in applicable ROI in line with current benchmark-linked rates and customer profile.",
  "foreclosure-noc-request":
    "I request final foreclosure amount, closure process, and issuance timeline for NOC, lien release, and original document handover.",
  "interest-certificate-request":
    "I request issuance of annual home-loan interest and principal certificate for tax filing/documentation purposes.",
}

const LETTER_DOCUMENTS: Record<HomeLoanLetterType, Array<string>> = {
  "prepayment-request": [
    "Signed request letter with loan account number",
    "Identity proof copy (PAN/Aadhaar)",
    "Payment proof/challan/UTR for prepayment",
    "Latest loan statement",
  ],
  "roi-reduction-request": [
    "Signed rate revision request letter",
    "Latest sanction letter and loan schedule",
    "Current lender benchmark and spread evidence",
    "KYC proof if bank asks for refresh",
  ],
  "foreclosure-noc-request": [
    "Signed foreclosure request letter",
    "Identity proof and loan account details",
    "Foreclosure amount payment proof",
    "List of original property documents to be released",
  ],
  "interest-certificate-request": [
    "Signed certificate request letter",
    "Loan account number and FY/AY needed",
    "Registered email/mobile for delivery",
    "Identity confirmation if branch requests",
  ],
}

function normalizeText(value: string, fallback: string): string {
  const normalized = value.trim()
  return normalized || fallback
}

function formatDate(value: string): string {
  const normalized = value.trim()
  return normalized || "[date]"
}

export function generateHomeLoanLetter(
  input: HomeLoanLetterInput
): HomeLoanLetterResult {
  const borrowerName = normalizeText(input.borrowerName, "[Borrower Name]")
  const coBorrowerName = normalizeText(input.coBorrowerName, "")
  const loanAccountNumber = normalizeText(
    input.loanAccountNumber,
    "[Loan Account Number]"
  )
  const bankName = normalizeText(input.bankName, "[Bank Name]")
  const branchName = normalizeText(input.branchName, "[Branch Name]")
  const city = normalizeText(input.city, "[City]")
  const requestDate = formatDate(input.requestDate)
  const requestedActionDate = formatDate(input.requestedActionDate)
  const contactEmail = normalizeText(input.contactEmail, "[email@example.com]")
  const contactPhone = normalizeText(input.contactPhone, "[phone number]")
  const details = normalizeText(
    input.details,
    LETTER_DEFAULT_DETAILS[input.letterType]
  )

  const letterTitle = LETTER_LABELS[input.letterType]
  const subjectLine = `${letterTitle} | Loan A/c ${loanAccountNumber}`

  const branchLetter = `Date: ${requestDate}\n\nTo\nThe Branch Manager\n${bankName}\n${branchName}, ${city}\n\nSubject: ${subjectLine}\n\nRespected Sir/Madam,\n\nI, ${borrowerName}${coBorrowerName ? ` (Co-borrower: ${coBorrowerName})` : ""}, request your kind assistance regarding home loan account ${loanAccountNumber}.\n\n${details}\n\nRequested effective/action date: ${requestedActionDate}.\n\nKindly process the request and confirm completion by email/SMS. Please also share any pending formalities or charges required from my side to complete this request.\n\nContact details:\nEmail: ${contactEmail}\nPhone: ${contactPhone}\n\nThank you.\n\nYours faithfully,\n${borrowerName}\nLoan A/c: ${loanAccountNumber}`

  const emailDraft = `Dear ${bankName} ${branchName} Team,\n\nPlease find attached my signed request for: ${letterTitle}.\nLoan Account Number: ${loanAccountNumber}\nRequested Action Date: ${requestedActionDate}\n\nKindly acknowledge and confirm the next steps or completion timeline.\n\nRegards,\n${borrowerName}\nEmail: ${contactEmail}\nPhone: ${contactPhone}`

  const documentChecklist = LETTER_DOCUMENTS[input.letterType]

  const followUpPlan = [
    "T+0: Submit signed request at branch and ask for inward number.",
    "T+1: Share same letter by registered email to branch support.",
    "T+3: Follow up with branch RM for processing status and pending items.",
    "T+5: Escalate to nodal desk if no written update is received.",
    "T+7: Archive all acknowledgments and final confirmation mail.",
  ]

  return {
    letterTitle,
    subjectLine,
    branchLetter,
    emailDraft,
    documentChecklist,
    followUpPlan,
  }
}
