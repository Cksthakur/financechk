import {
  
  
  estimateAnnualTax
} from "./tax-estimate"
import type {AnnualTaxEstimate, TaxRegimeType} from "./tax-estimate";

export interface SalaryHikeTaxImpactInput {
  currentAnnualSalary: number
  hikePercent: number
  bonus: number
  oldRegimeDeductions: number
  oldRegimeHomeLoanInterest: number
  preferredRegime: TaxRegimeType
}

export interface SalaryHikeTaxImpactResult {
  currentGrossAnnual: number
  projectedGrossAnnual: number
  incrementalGross: number
  currentTax: AnnualTaxEstimate
  projectedTax: AnnualTaxEstimate
  additionalTax: number
  monthlyNetIncrease: number
  optimizationMoves: Array<string>
  actionPlan90Days: Array<string>
  payrollEmailDraft: string
  summary: string
}

function round(value: number): number {
  return Math.round(value)
}

export function generateSalaryHikeTaxImpact(
  input: SalaryHikeTaxImpactInput
): SalaryHikeTaxImpactResult {
  const currentAnnualSalary = Math.max(0, round(input.currentAnnualSalary))
  const hikePercent = Math.max(0, Math.min(100, input.hikePercent))
  const bonus = Math.max(0, round(input.bonus))
  const oldRegimeDeductions = Math.max(0, round(input.oldRegimeDeductions))
  const oldRegimeHomeLoanInterest = Math.max(
    0,
    round(input.oldRegimeHomeLoanInterest)
  )

  const projectedBase = currentAnnualSalary * (1 + hikePercent / 100)
  const projectedGrossAnnual = round(projectedBase + bonus)
  const incrementalGross = projectedGrossAnnual - currentAnnualSalary

  const currentTaxableOld = Math.max(
    0,
    currentAnnualSalary - oldRegimeDeductions - oldRegimeHomeLoanInterest
  )
  const projectedTaxableOld = Math.max(
    0,
    projectedGrossAnnual - oldRegimeDeductions - oldRegimeHomeLoanInterest
  )

  const currentTaxableNew = Math.max(0, currentAnnualSalary - 75000)
  const projectedTaxableNew = Math.max(0, projectedGrossAnnual - 75000)

  const currentTax =
    input.preferredRegime === "old"
      ? estimateAnnualTax(currentTaxableOld, "old")
      : estimateAnnualTax(currentTaxableNew, "new")

  const projectedTax =
    input.preferredRegime === "old"
      ? estimateAnnualTax(projectedTaxableOld, "old")
      : estimateAnnualTax(projectedTaxableNew, "new")

  const additionalTax = Math.max(0, projectedTax.totalTax - currentTax.totalTax)
  const monthlyNetIncrease = round((incrementalGross - additionalTax) / 12)

  const optimizationMoves =
    input.preferredRegime === "old"
      ? [
          "Top up 80C gap before December payroll proof window.",
          "Use 80D parent + family premium split if eligible.",
          "Evaluate NPS 80CCD(1B) allocation up to INR 50,000.",
          "Submit home-loan interest certificate early to avoid March TDS spike.",
        ]
      : [
          "Validate if old regime yields lower total tax post-hike.",
          "Shift bonus timing or split payout cycle if employer policy allows.",
          "Increase emergency corpus SIP using post-tax monthly delta.",
          "Request payroll simulation for final quarter to avoid over-deduction.",
        ]

  const actionPlan90Days = [
    "Week 1: request revised payroll projection and monthly TDS schedule.",
    "Week 2: finalize regime choice for remaining FY months.",
    "Month 2: execute deduction optimization and submit proofs.",
    "Month 3: run final recalibration with updated payslips.",
    "Quarter end: archive tax-impact note for ITR filing reference.",
  ]

  const payrollEmailDraft = `Subject: Payroll Tax Projection Request Post Salary Revision\n\nHi Payroll Team,\n\nMy annual compensation has been revised and I would like an updated monthly TDS projection under the ${input.preferredRegime.toUpperCase()} regime.\n\nPlease consider revised gross annual INR ${projectedGrossAnnual.toLocaleString("en-IN")} (including bonus) and share monthly TDS for the remaining months of the financial year.\n\nThanks,\nEmployee`

  const summary = `Gross increases by INR ${incrementalGross.toLocaleString("en-IN")}. Estimated additional annual tax is INR ${additionalTax.toLocaleString("en-IN")}, giving an approximate monthly net increase of INR ${monthlyNetIncrease.toLocaleString("en-IN")}.`

  return {
    currentGrossAnnual: currentAnnualSalary,
    projectedGrossAnnual,
    incrementalGross,
    currentTax,
    projectedTax,
    additionalTax,
    monthlyNetIncrease,
    optimizationMoves,
    actionPlan90Days,
    payrollEmailDraft,
    summary,
  }
}
