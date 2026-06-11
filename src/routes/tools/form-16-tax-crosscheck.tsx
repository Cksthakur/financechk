import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type {Form16CrosscheckInput} from "@/lib/generators/form-16-crosscheck";
import { CurrencyInput } from "@/components/finance/currency-input"
import { FAQSection } from "@/components/finance/faq-section"
import { GeneratorActions } from "@/components/finance/generator-actions"
import { LastUpdated } from "@/components/finance/last-updated"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { ShareResult } from "@/components/finance/share-result"
import { SliderField } from "@/components/finance/slider-field"
import { ToolLayout } from "@/components/layout/tool-layout"
import {
  
  generateForm16Crosscheck
} from "@/lib/generators/form-16-crosscheck"
import { formatCompactCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/form-16-tax-crosscheck")({
  head: () =>
    generateSeoMeta({
      title:
        "Form 16 Tax Crosscheck Tool India | TDS vs Estimated Tax Reconciliation",
      description:
        "Cross-check Form 16 taxable income, deductions and TDS with estimated tax liability. Generate discrepancy notes, payroll follow-up questions and escalation email draft.",
      path: "/tools/form-16-tax-crosscheck",
      keywords: [
        "form 16 tax crosscheck",
        "form 16 tds mismatch checker",
        "payroll tax reconciliation tool",
        "form 16 discrepancy generator",
        "tds vs tax liability India",
      ],
    }),
  component: Form16TaxCrosscheckPage,
})

const faqs = [
  {
    question: "What does this Form 16 crosscheck tool validate?",
    answer:
      "It compares Form 16 taxable values and TDS against an estimated tax calculation and highlights mismatch direction, likely causes, and follow-up queries.",
  },
  {
    question: "Can this replace my CA review?",
    answer:
      "No. It is an audit and workflow layer to identify issues quickly. Use it with professional review for filing decisions.",
  },
  {
    question: "How much mismatch is considered significant?",
    answer:
      "This tool marks differences above INR 2,000 as operationally significant and suggests payroll clarification actions.",
  },
  {
    question: "Does this support old and new regime?",
    answer:
      "Yes. Choose regime and enter deduction values to run regime-aware discrepancy checks.",
  },
  {
    question: "Can I send a ready email to payroll?",
    answer:
      "Yes. The generated escalation email draft can be copied or downloaded directly.",
  },
]

function Form16TaxCrosscheckPage() {
  const [employeeName, setEmployeeName] = useState("Rajat Das")
  const [pan, setPan] = useState("ABCDE1234F")
  const [employerName, setEmployerName] = useState("FinanceChk Labs Pvt Ltd")
  const [financialYear, setFinancialYear] = useState("2026-27")
  const [regime, setRegime] = useState<Form16CrosscheckInput["regime"]>("new")
  const [grossSalaryAsPerForm16, setGrossSalaryAsPerForm16] = useState(1890000)
  const [taxableIncomeAsPerForm16, setTaxableIncomeAsPerForm16] =
    useState(1625000)
  const [tdsDeductedAsPerForm16, setTdsDeductedAsPerForm16] = useState(173000)
  const [section80cClaimed, setSection80cClaimed] = useState(150000)
  const [section80dClaimed, setSection80dClaimed] = useState(25000)
  const [npsClaimed, setNpsClaimed] = useState(50000)
  const [homeLoanInterestClaimed, setHomeLoanInterestClaimed] = useState(180000)
  const [otherDeductionsClaimed, setOtherDeductionsClaimed] = useState(0)

  const result = useMemo(
    () =>
      generateForm16Crosscheck({
        employeeName,
        pan,
        employerName,
        financialYear,
        regime,
        grossSalaryAsPerForm16,
        taxableIncomeAsPerForm16,
        tdsDeductedAsPerForm16,
        section80cClaimed,
        section80dClaimed,
        npsClaimed,
        homeLoanInterestClaimed,
        otherDeductionsClaimed,
      }),
    [
      employeeName,
      pan,
      employerName,
      financialYear,
      regime,
      grossSalaryAsPerForm16,
      taxableIncomeAsPerForm16,
      tdsDeductedAsPerForm16,
      section80cClaimed,
      section80dClaimed,
      npsClaimed,
      homeLoanInterestClaimed,
      otherDeductionsClaimed,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Form 16 Tax Crosscheck" },
      ]}
    >
      <div className="mb-6">
        <h1
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "46px",
            letterSpacing: "-0.92px",
            lineHeight: 1.08,
          }}
        >
          Form 16 Tax Crosscheck Tool
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Reconcile Form 16 taxable income and TDS against estimated liability,
          then generate payroll clarification notes and email draft.
        </p>
        <LastUpdated date="April 2026" author="Rajat" />
      </div>

      <div
        className="rounded-2xl bg-card p-5 md:p-6"
        style={{
          boxShadow:
            "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
        }}
      >
        <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Crosscheck Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Employee Name
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(event) => setEmployeeName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              PAN
            </label>
            <input
              type="text"
              value={pan}
              onChange={(event) => setPan(event.target.value.toUpperCase())}
              maxLength={10}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground uppercase"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Employer Name
            </label>
            <input
              type="text"
              value={employerName}
              onChange={(event) => setEmployerName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Financial Year
            </label>
            <input
              type="text"
              value={financialYear}
              onChange={(event) => setFinancialYear(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div className="sm:col-span-2">
            <SliderField
              label="Tax Regime (0 = Old, 1 = New)"
              value={regime === "old" ? 0 : 1}
              onChange={(value) => setRegime(value < 0.5 ? "old" : "new")}
              min={0}
              max={1}
              step={1}
              formatValue={(value) => (value < 0.5 ? "Old" : "New")}
            />
          </div>

          <CurrencyInput
            label="Gross Salary as per Form 16"
            value={grossSalaryAsPerForm16}
            onChange={setGrossSalaryAsPerForm16}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="Taxable Income as per Form 16"
            value={taxableIncomeAsPerForm16}
            onChange={setTaxableIncomeAsPerForm16}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="TDS Deducted as per Form 16"
            value={tdsDeductedAsPerForm16}
            onChange={setTdsDeductedAsPerForm16}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="Section 80C Claimed"
            value={section80cClaimed}
            onChange={setSection80cClaimed}
            min={0}
            max={300000}
          />
          <CurrencyInput
            label="Section 80D Claimed"
            value={section80dClaimed}
            onChange={setSection80dClaimed}
            min={0}
            max={100000}
          />
          <CurrencyInput
            label="NPS Claimed"
            value={npsClaimed}
            onChange={setNpsClaimed}
            min={0}
            max={200000}
          />
          <CurrencyInput
            label="Home Loan Interest Claimed"
            value={homeLoanInterestClaimed}
            onChange={setHomeLoanInterestClaimed}
            min={0}
            max={500000}
          />
          <CurrencyInput
            label="Other Deductions"
            value={otherDeductionsClaimed}
            onChange={setOtherDeductionsClaimed}
            min={0}
            max={500000}
          />
        </div>
      </div>

      <div className="mt-7 space-y-6">
        <ResultGrid>
          <ResultCard
            label="Estimated Annual Tax"
            value={formatCompactCurrency(result.estimatedTax.totalTax)}
            subtitle="Based on selected regime"
          />
          <ResultCard
            label="Form 16 TDS"
            value={formatCompactCurrency(tdsDeductedAsPerForm16)}
            subtitle="Payroll deducted"
          />
          <ResultCard
            label="Difference"
            value={formatCompactCurrency(result.differenceVsTds)}
            subtitle={result.reconciliationStatus}
            variant={
              result.reconciliationStatus === "near-match"
                ? "default"
                : result.reconciliationStatus === "excess-tds"
                  ? "gain"
                  : "loss"
            }
          />
        </ResultGrid>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Discrepancy Notes
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              {result.summary}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.discrepancyNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Payroll Follow-Up Questions
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.payrollFollowUpQuestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Escalation Email Draft
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.escalationEmailDraft}
          </pre>
          <GeneratorActions
            title="Form 16 Escalation Email"
            content={result.escalationEmailDraft}
            fileName={`form16-crosscheck-email-${financialYear}.txt`}
            className="mt-4"
          />
        </div>

        <ShareResult
          params={{
            fy: financialYear,
            regime,
            tds: tdsDeductedAsPerForm16,
            taxable: taxableIncomeAsPerForm16,
          }}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/20 p-5 text-sm text-muted-foreground">
        Next step after reconciliation: submit supporting payroll queries and
        keep acknowledgement copies for ITR records.
      </div>

      <div className="mt-14">
        <FAQSection items={faqs} />
      </div>
    </ToolLayout>
  )
}
