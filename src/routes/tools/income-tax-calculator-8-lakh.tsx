import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { calculateTaxComparison } from "@/lib/calculators/tax-regime"
import { formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

const INCOME_LEVEL = "₹8 Lakh"
const INCOME_VALUE = 800000

export const Route = createFileRoute("/tools/income-tax-calculator-8-lakh")({
  head: () =>
    generateSeoMeta({
      title: `Income Tax Calculator ${INCOME_LEVEL} - Old vs New Regime FY 2026-27`,
      description: `Free online income tax calculator for ${INCOME_LEVEL} annual salary. Compare old vs new tax regime for FY 2026-27 with accurate India tax slabs and deductions.`,
      path: "/tools/income-tax-calculator-8-lakh",
    }),
  component: IncomeTaxCalculator,
})

const faqs = [
  {
    question: `How much tax do I pay on ${INCOME_LEVEL} income?`,
    answer:
      "Under the New Tax Regime FY 2026-27, your tax is approximately ₹33,000. After the standard deduction of ₹75,000, your taxable income is ₹7,25,000. Tax: ₹0 on first ₹4L + ₹6,250 (5% on ₹1.25L) + ₹30,000 (10% on ₹2L) + cess.",
  },
  {
    question: "Can I save tax with deductions on ₹8 lakh salary?",
    answer:
      "Yes! Under the Old Tax Regime with ₹1.5 lakh in Section 80C deductions (EPF, PPF, LIC), your tax reduces significantly. You can also claim HRA exemption (if renting), Section 80D for health insurance, and NPS contributions up to ₹50,000.",
  },
  {
    question: "Which tax regime is better for ₹8 lakh income?",
    answer:
      "For ₹8 lakh salary without major deductions, New Regime saves about ₹20,000 more. But if you have ₹3+ lakh in valid deductions (80C + 80D + NPS + HRA + home loan), Old Regime may be better or equal.",
  },
]

const howToSteps = [
  `Your gross salary of ₹8,00,000 is pre-filled. Adjust if needed.`,
  "Under New Regime: Taxable = ₹8L - ₹75k = ₹7.25L = ~₹33,000 tax",
  "Add deductions like EPF, PPF, LIC (80C), Health Insurance (80D), NPS for Old Regime.",
  "Compare to find the best regime for your situation.",
]

function IncomeTaxCalculator() {
  const [annualSalary, setAnnualSalary] = useState(INCOME_VALUE)
  const [basicSalary, setBasicSalary] = useState(INCOME_VALUE / 2)
  const [hra, setHra] = useState(0)
  const [rentPaid, setRentPaid] = useState(0)
  const [cityType, setCityType] = useState<"metro" | "non-metro">("non-metro")
  const [section80C, setSection80C] = useState(0)
  const [section80D, setSection80D] = useState(0)
  const [section80CCD, setSection80CCD] = useState(0)
  const [homeLoanInterest, setHomeLoanInterest] = useState(0)
  const [otherDeductions, setOtherDeductions] = useState(0)
  const financialYear = "FY2026-27"

  const result = useMemo(
    () =>
      calculateTaxComparison({
        annualSalary,
        basicSalary,
        hra,
        rentPaid,
        cityType,
        section80C,
        section80D,
        section80CCD,
        homeLoanInterest,
        otherDeductions,
        financialYear,
      }),
    [
      annualSalary,
      basicSalary,
      hra,
      rentPaid,
      cityType,
      section80C,
      section80D,
      section80CCD,
      homeLoanInterest,
      otherDeductions,
    ]
  )

  const savings = result.oldRegime.totalTax - result.newRegime.totalTax

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Tax Calculators", href: "/tools/tax-regime-comparison" },
        { label: `${INCOME_LEVEL} Income Tax Calculator` },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-0 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Income Tax Calculator for {INCOME_LEVEL} Salary
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculate your tax liability under both old and new tax regimes for
            FY 2026-27. See exactly how much you can save.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr,1fr]">
          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Your Salary Details</h2>
            <div className="space-y-4">
              <CurrencyInput
                label="Annual Gross Salary"
                value={annualSalary}
                onChange={setAnnualSalary}
                currency="INR"
              />
              <CurrencyInput
                label="Basic Salary (per year)"
                value={basicSalary}
                onChange={setBasicSalary}
                currency="INR"
              />
              <CurrencyInput
                label="HRA Received (per year)"
                value={hra}
                onChange={setHra}
                currency="INR"
              />
              <CurrencyInput
                label="Annual Rent Paid"
                value={rentPaid}
                onChange={setRentPaid}
                currency="INR"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setCityType("metro")}
                  className={`flex-1 rounded-lg px-4 py-2 transition-colors ${cityType === "metro" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                  Metro
                </button>
                <button
                  onClick={() => setCityType("non-metro")}
                  className={`flex-1 rounded-lg px-4 py-2 transition-colors ${cityType === "non-metro" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                  Non-Metro
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Deductions (Old Regime)</h2>
            <div className="space-y-4">
              <CurrencyInput
                label="Section 80C (EPF, PPF, LIC)"
                value={section80C}
                onChange={setSection80C}
                currency="INR"
                max={150000}
              />
              <CurrencyInput
                label="Section 80D (Health Insurance)"
                value={section80D}
                onChange={setSection80D}
                currency="INR"
                max={50000}
              />
              <CurrencyInput
                label="Section 80CCD (NPS)"
                value={section80CCD}
                onChange={setSection80CCD}
                currency="INR"
                max={50000}
              />
              <CurrencyInput
                label="Home Loan Interest (Section 24b)"
                value={homeLoanInterest}
                onChange={setHomeLoanInterest}
                currency="INR"
                max={200000}
              />
              <CurrencyInput
                label="Other Deductions"
                value={otherDeductions}
                onChange={setOtherDeductions}
                currency="INR"
              />
            </div>
          </div>
        </div>

        <ResultGrid>
          <ResultCard
            label="New Regime Tax"
            value={formatCurrency(result.newRegime.totalTax)}
            subtitle="Lower slabs + ₹75k standard deduction"
          />
          <ResultCard
            label="Old Regime Tax"
            value={formatCurrency(result.oldRegime.totalTax)}
            subtitle="With all deductions"
          />
          <ResultCard
            label="Tax Savings"
            value={formatCurrency(Math.max(0, savings))}
            subtitle={
              savings > 0
                ? `Save ${((savings / result.oldRegime.totalTax) * 100).toFixed(0)}% with ${result.betterRegime}`
                : "New regime is better"
            }
          />
          <ResultCard
            label="Better Regime"
            value={result.betterRegime}
            subtitle="Based on your deductions"
          />
        </ResultGrid>

        <div className="rounded-2xl bg-muted/50 p-6">
          <h3 className="mb-4 text-lg font-semibold">Detailed Breakdown</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">New Tax Regime</h4>
              <div className="space-y-1 text-sm">
                <p>Gross Salary: {formatCurrency(annualSalary)}</p>
                <p>Standard Deduction: ₹75,000</p>
                <p>
                  Taxable Income:{" "}
                  {formatCurrency(result.newRegime.taxableIncome)}
                </p>
                <p>Tax: {formatCurrency(result.newRegime.taxPayable)}</p>
                <p className="font-medium">
                  Total Tax: {formatCurrency(result.newRegime.totalTax)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Old Tax Regime</h4>
              <div className="space-y-1 text-sm">
                <p>Gross Salary: {formatCurrency(annualSalary)}</p>
                <p>
                  HRA Exemption:{" "}
                  {formatCurrency(result.oldRegime.hraExemption ?? 0)}
                </p>
                <p>Standard Deduction: ₹50,000</p>
                <p>
                  Total Deductions:{" "}
                  {formatCurrency(result.oldRegime.deductions)}
                </p>
                <p>
                  Taxable Income:{" "}
                  {formatCurrency(result.oldRegime.taxableIncome)}
                </p>
                <p className="font-medium">
                  Total Tax: {formatCurrency(result.oldRegime.totalTax)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/50 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            How to Use This Calculator
          </h3>
          <ol className="list-inside space-y-2">
            {howToSteps.map((step, index) => (
              <li key={index} className="text-muted-foreground">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>

        <FAQSection items={faqs} />
        <LastUpdated date="April 2026" />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </ToolLayout>
  )
}
