export type TaxNoticeType =
  | "143-1-mismatch"
  | "defective-return-139-9"
  | "demand-notice-156"
  | "ais-mismatch"

export interface IncomeTaxNoticeReplyInput {
  noticeType: TaxNoticeType
  fullName: string
  pan: string
  assessmentYear: string
  noticeDate: string
  noticeReference: string
  issueSummary: string
  amountInDispute: number
  jurisdiction: string
  contactEmail: string
  contactPhone: string
  filingDate: string
  additionalContext: string
}

export interface IncomeTaxNoticeReplyResult {
  subjectLine: string
  salutation: string
  noticeLabel: string
  draftReply: string
  emailBody: string
  documentChecklist: Array<string>
  actionPlan48h: Array<string>
}

const NOTICE_LABELS: Record<TaxNoticeType, string> = {
  "143-1-mismatch": "Intimation u/s 143(1) mismatch",
  "defective-return-139-9": "Defective return notice u/s 139(9)",
  "demand-notice-156": "Demand notice u/s 156",
  "ais-mismatch": "AIS/TIS mismatch communication",
}

const NOTICE_EXPLANATIONS: Record<TaxNoticeType, string> = {
  "143-1-mismatch":
    "The mismatch appears to be due to variance between processed return values and claimed deductions/income schedules submitted in the original filing.",
  "defective-return-139-9":
    "The return is marked defective and requires corrected schedules, income-head mapping, and re-submission within the prescribed timeline.",
  "demand-notice-156":
    "The demand appears to arise from adjustment/recomputation and is being responded to with supporting computation and payment-credit reconciliation.",
  "ais-mismatch":
    "The variance appears to originate from AIS/TIS entries that require confirmation, feedback, or correction against actual books and statements.",
}

const NOTICE_CHECKLISTS: Record<TaxNoticeType, Array<string>> = {
  "143-1-mismatch": [
    "Copy of filed ITR acknowledgment (ITR-V)",
    "Intimation order u/s 143(1)",
    "Computation sheet used at filing time",
    "Form 16 / Form 26AS / AIS extracts",
    "Proof for deductions claimed (80C/80D/NPS etc.)",
  ],
  "defective-return-139-9": [
    "Defective return notice with error code",
    "Corrected ITR JSON/utility output",
    "P&L / Balance Sheet where applicable",
    "Capital gains and business schedule backups",
    "Tax payment challans and TDS/TCS credit proof",
  ],
  "demand-notice-156": [
    "Demand notice copy with DIN/reference",
    "Tax paid challans (CIN, BSR, date)",
    "26AS and AIS credit reconciliation",
    "Rectification request draft u/s 154 (if needed)",
    "Working note showing disputed vs accepted demand",
  ],
  "ais-mismatch": [
    "AIS/TIS statement export",
    "Bank/broker/interest certificates",
    "Capital gains statement and contract notes",
    "Feedback screenshots submitted in AIS portal",
    "Revised computation with reconciled values",
  ],
}

function normalizeText(value: string, fallback: string): string {
  const normalized = value.trim()
  return normalized || fallback
}

function normalizePan(value: string): string {
  const pan = value.trim().toUpperCase()
  if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
    return pan
  }
  return "PAN-TO-BE-UPDATED"
}

function formatDate(value: string): string {
  const normalized = value.trim()
  if (!normalized) {
    return "[date]"
  }
  return normalized
}

function formatAmount(value: number): string {
  const safe = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0
  return safe.toLocaleString("en-IN")
}

export function generateIncomeTaxNoticeReply(
  input: IncomeTaxNoticeReplyInput
): IncomeTaxNoticeReplyResult {
  const fullName = normalizeText(input.fullName, "[Taxpayer Name]")
  const pan = normalizePan(input.pan)
  const assessmentYear = normalizeText(input.assessmentYear, "[AY]")
  const noticeReference = normalizeText(
    input.noticeReference,
    "[Notice Reference]"
  )
  const issueSummary = normalizeText(
    input.issueSummary,
    "Disputed items have been identified and reconciled with source records."
  )
  const jurisdiction = normalizeText(
    input.jurisdiction,
    "Jurisdictional Assessing Officer"
  )
  const contactEmail = normalizeText(input.contactEmail, "[email@example.com]")
  const contactPhone = normalizeText(input.contactPhone, "[phone number]")
  const filingDate = formatDate(input.filingDate)
  const noticeDate = formatDate(input.noticeDate)
  const additionalContext = normalizeText(input.additionalContext, "")
  const amountInDispute = formatAmount(input.amountInDispute)
  const noticeLabel = NOTICE_LABELS[input.noticeType]

  const subjectLine = `Reply to ${noticeLabel} for AY ${assessmentYear} | ${fullName} | PAN ${pan}`
  const salutation = `To\nThe ${jurisdiction}`
  const explanation = NOTICE_EXPLANATIONS[input.noticeType]

  const draftReply = `${salutation}\n\nSubject: ${subjectLine}\n\nRespected Sir/Madam,\n\nI, ${fullName} (PAN: ${pan}), hereby submit this response against the ${noticeLabel} dated ${noticeDate} bearing reference ${noticeReference}, pertaining to Assessment Year ${assessmentYear}.\n\nThe return for the relevant year was originally filed on ${filingDate}. ${explanation}\n\nIssue Summary:\n${issueSummary}\n\nAmount under reference/dispute: INR ${amountInDispute}.\n\nI respectfully request your office to consider the enclosed computation, reconciliations, and documentary evidence. Based on these records, I request appropriate rectification/acceptance of response and update of demand status, wherever applicable.\n\n${additionalContext ? `Additional Clarification:\n${additionalContext}\n\n` : ""}Contact Details for any further clarification:\nEmail: ${contactEmail}\nPhone: ${contactPhone}\n\nThank you for your consideration.\n\nSincerely,\n${fullName}\nPAN: ${pan}`

  const emailBody = `Dear Sir/Madam,\n\nPlease find attached my reply to ${noticeLabel} for AY ${assessmentYear} (Ref: ${noticeReference}). I have attached reconciliations and supporting documents for your review.\n\nKindly acknowledge receipt and update status accordingly.\n\nRegards,\n${fullName}\nPAN: ${pan}\nEmail: ${contactEmail}\nPhone: ${contactPhone}`

  const documentChecklist = NOTICE_CHECKLISTS[input.noticeType]

  const actionPlan48h = [
    "Within 2 hours: download latest notice PDF, AIS/26AS and prior ITR computation in one folder.",
    "Within 6 hours: reconcile disputed amount line-by-line and mark accepted vs contested values.",
    "Within 12 hours: prepare final draft reply and supporting annexure index.",
    "Within 24 hours: upload response on e-filing portal and keep acknowledgment screenshot.",
    "Within 48 hours: set follow-up reminder and track portal status for further action/rectification.",
  ]

  return {
    subjectLine,
    salutation,
    noticeLabel,
    draftReply,
    emailBody,
    documentChecklist,
    actionPlan48h,
  }
}
