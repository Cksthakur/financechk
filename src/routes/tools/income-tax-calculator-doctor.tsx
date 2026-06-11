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

const PROFESSION = "Doctor"
const DEFAULT_INCOME = 2400000

export const Route = createFileRoute("/tools/income-tax-calculator-doctor")({
  head: () =>
    generateSeoMeta({
      title: `Income Tax Calculator for ${PROFESSION}s - Tax Saving Tips FY 2026-27`,
      description: `Free income tax calculator for ${PROFESSION}s in India. Compare old vs new tax regime, calculate tax savings, and find best tax saving investments like 80C, 80D, NPS for medical professionals.`,
      path: "/tools/income-tax-calculator-doctor",
    }),
  component: IncomeTaxCalculator,
})

const faqs = [
  {
    question: "What tax deductions are available for Doctors?",
    answer:
      "Doctors can claim: Section 80C (EPF, PPF, LIC, ELSS - up to ₹1.5 lakh), Section 80D (Health Insurance - up to ₹1 lakh for self + parents), Section 80CCD (NPS - up to ₹50,000), Section 24b (Home Loan Interest - up to ₹2 lakh), and professional tax deduction.",
  },
  {
    question: "Can doctors claim medical equipment as tax deduction?",
    answer:
      "Yes, under Section 80DD, you can claim ₹75,000 for medical treatment of dependent with disability. Also, under Section 80D, you can claim preventive health check-up up to ₹5,000.",
  },
  {
    question: "Which tax regime is better for Doctors?",
    answer:
      "For high-income doctors (₹20+ lakh), the New Tax Regime is usually better due to lower slab rates. However, if you have high home loan interest, school fees for children (under 80D), and can maximize deductions, compare both as Old Regime may save more.",
  },
  {
    question: "Can doctors claim NPS contribution?",
    answer:
      "Yes! NPS gives additional tax benefit under Section 80CCD(1B) - you can invest up to ₹50,000 extra in NPS and claim tax deduction over and above the 80C limit of ₹1.5 lakh.",
  },
]

function IncomeTaxCalculator() {
  const [annualSalary, setAnnualSalary] = useState(DEFAULT_INCOME)
  const [basicSalary, setBasicSalary] = useState(DEFAULT_INCOME / 2)
  const [hra, setHra] = useState(0)
  const [rentPaid, setRentPaid] = useState(0)
  const [cityType, setCityType] = useState<"metro" | "non-metro">("metro")
  const [section80C, setSection80C] = useState(150000)
  const [section80D, setSection80D] = useState(50000)
  const [section80CCD, setSection80CCD] = useState(50000)
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
        { label: `${PROFESSION} Tax Calculator` },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-0 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Income Tax Calculator for {PROFESSION}s
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculate your tax liability with tax-saving investments typical for
            medical professionals. Compare old vs new tax regime with 80C, 80D,
            NPS deductions pre-filled.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr,1fr]">
          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Your Income Details</h2>
            <div className="space-y-4">
              <CurrencyInput
                label="Annual Gross Income"
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
            <h2 className="text-xl font-semibold">
              Tax Saving Deductions (Pre-filled for {PROFESSION}s)
            </h2>
            <div className="space-y-4">
              <CurrencyInput
                label="Section 80C (EPF, PPF, ELSS)"
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
                max={100000}
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
              <p className="text-sm text-muted-foreground">
                💡 {PROFESSION}s can claim up to ₹1 lakh under 80D for family +
                parents
              </p>
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
