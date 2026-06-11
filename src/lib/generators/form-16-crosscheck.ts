import {
  
  
  estimateAnnualTax
} from "./tax-estimate"
import type {AnnualTaxEstimate, TaxRegimeType} from "./tax-estimate";

export interface Form16CrosscheckInput {
  employeeName: string
  pan: string
  employerName: string
  financialYear: string
  regime: TaxRegimeType
  grossSalaryAsPerForm16: number
  taxableIncomeAsPerForm16: number
  tdsDeductedAsPerForm16: number
  section80cClaimed: number
  section80dClaimed: number
  npsClaimed: number
  homeLoanInterestClaimed: number
  otherDeductionsClaimed: number
}

export interface Form16CrosscheckResult {
  estimatedTax: AnnualTaxEstimate
  differenceVsTds: number
  reconciliationStatus: "excess-tds" | "short-tds" | "near-match"
  discrepancyNotes: Array<string>
  payrollFollowUpQuestions: Array<string>
  escalationEmailDraft: string
  summary: string
}

function safeAmount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.max(0, Math.round(value))
}

function normalizePan(value: string): string {
  const pan = value.trim().toUpperCase()
  return pan || "PAN-TO-BE-UPDATED"
}

export function generateForm16Crosscheck(
  input: Form16CrosscheckInput
): Form16CrosscheckResult {
  const employeeName = input.employeeName.trim() || "Employee"
  const pan = normalizePan(input.pan)
  const employerName = input.employerName.trim() || "Employer"

  const grossSalaryAsPerForm16 = safeAmount(input.grossSalaryAsPerForm16)
  const taxableIncomeAsPerForm16 = safeAmount(input.taxableIncomeAsPerForm16)
  const tdsDeductedAsPerForm16 = safeAmount(input.tdsDeductedAsPerForm16)

  const deductionsTotal =
    safeAmount(input.section80cClaimed) +
    safeAmount(input.section80dClaimed) +
    safeAmount(input.npsClaimed) +
    safeAmount(input.homeLoanInterestClaimed) +
    safeAmount(input.otherDeductionsClaimed)

  const recalculatedTaxableIncome = Math.max(
    0,
    grossSalaryAsPerForm16 - deductionsTotal
  )

  const taxableForEstimate = Math.max(
    taxableIncomeAsPerForm16,
    recalculatedTaxableIncome
  )

  const estimatedTax = estimateAnnualTax(taxableForEstimate, input.regime)
  const differenceVsTds = tdsDeductedAsPerForm16 - estimatedTax.totalTax

  let reconciliationStatus: Form16CrosscheckResult["reconciliationStatus"] =
    "near-match"
  if (differenceVsTds > 2000) {
    reconciliationStatus = "excess-tds"
  } else if (differenceVsTds < -2000) {
    reconciliationStatus = "short-tds"
  }

  const discrepancyNotes: Array<string> = []

  if (Math.abs(taxableIncomeAsPerForm16 - recalculatedTaxableIncome) > 5000) {
    discrepancyNotes.push(
      "Taxable income in Form 16 differs from deduction-derived taxable estimate. Recheck deduction mapping and standard deduction treatment."
    )
  }

  if (input.regime === "new" && deductionsTotal > 0) {
    discrepancyNotes.push(
      "New regime usually ignores most chapter VI-A deductions except specific sections. Confirm payroll regime logic if deductions reduced taxable salary."
    )
  }

  if (reconciliationStatus === "excess-tds") {
    discrepancyNotes.push(
      "TDS appears higher than estimated annual liability. Potential refund scenario; verify month-wise deduction spikes."
    )
  }

  if (reconciliationStatus === "short-tds") {
    discrepancyNotes.push(
      "TDS appears lower than estimated annual liability. Additional self-assessment or final payroll adjustment may be needed."
    )
  }

  if (discrepancyNotes.length === 0) {
    discrepancyNotes.push(
      "No major discrepancy detected under current assumptions. Keep working papers for ITR filing and scrutiny readiness."
    )
  }

  const payrollFollowUpQuestions = [
    "Please share month-wise taxable salary and TDS working used for Form 16.",
    "Confirm the selected regime and effective date in payroll system.",
    "Confirm which deductions were considered and under which sections.",
    "Confirm if any arrears/bonus were taxed at special rates.",
    "Share correction timeline if mismatch exists before final ITR filing.",
  ]

  const escalationEmailDraft = `Subject: Form 16 Tax Computation Clarification - ${input.financialYear}\n\nHi Payroll Team,\n\nI have cross-checked my Form 16 values and need clarification on taxable income and TDS computation.\n\nEmployee: ${employeeName}\nPAN: ${pan}\nFinancial Year: ${input.financialYear}\n\nPlease share month-wise TDS working and deduction mapping used for final Form 16 issued by ${employerName}.\n\nThanks,\n${employeeName}`

  const summary = `Estimated annual tax is INR ${estimatedTax.totalTax.toLocaleString("en-IN")} against Form 16 TDS of INR ${tdsDeductedAsPerForm16.toLocaleString("en-IN")}. Difference: INR ${differenceVsTds.toLocaleString("en-IN")}.`

  return {
    estimatedTax,
    differenceVsTds,
    reconciliationStatus,
    discrepancyNotes,
    payrollFollowUpQuestions,
    escalationEmailDraft,
    summary,
  }
}
