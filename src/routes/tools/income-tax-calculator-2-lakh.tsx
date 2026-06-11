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

export const Route = createFileRoute("/tools/income-tax-calculator-2-lakh")({
  head: () =>
    generateSeoMeta({
      title: "Income Tax Calculator ₹2 Lakh - Old vs New Regime FY 2026-27",
      description:
        "Free online income tax calculator for ₹2 lakh annual salary. Compare old vs new tax regime for FY 2026-27 with accurate India tax slabs and deductions.",
      path: "/tools/income-tax-calculator-2-lakh",
    }),
  component: IncomeTax2Lakh,
})

const faqs = [
  {
    question: "Do I need to pay tax on ₹2 lakh income?",
    answer:
      "No, you do not need to pay any tax on ₹2 lakh (₹200,000) annual income under the new tax regime. With the standard deduction of ₹75,000, your taxable income is ₹1,25,000 which falls in the nil tax bracket (₹0-₹4 lakh).",
  },
  {
    question: "Which tax regime is better for ₹2 lakh salary?",
    answer:
      "Both regimes result in zero tax for ₹2 lakh income. The New Tax Regime is simpler as it does not require you to claim deductions to reduce your tax. You can simply claim the standard deduction and be done.",
  },
  {
    question: "Can I claim deductions on ₹2 lakh salary?",
    answer:
      "Yes, you can still claim deductions like Section 80C, 80D, NPS under the Old Tax Regime. However, since your tax is already zero, these deductions provide no additional benefit unless your income increases.",
  },
]

const howToSteps = [
  "Your gross salary of ₹2,00,000 is pre-filled. Adjust if needed.",
  "Under New Regime: Taxable income = ₹2,00,000 - ₹75,000 = ₹1,25,000 = ₹0 Tax",
  "Under Old Regime: With standard deduction, taxable = ₹1,50,000 = ₹0 Tax",
  "Both regimes give you zero tax. File your ITR for record.",
]

function IncomeTax2Lakh() {
  const [annualSalary, setAnnualSalary] = useState(200000)
  const [basicSalary, setBasicSalary] = useState(100000)
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
        { label: "₹2 Lakh Income Tax Calculator" },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-0 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Income Tax Calculator for ₹2 Lakh Salary
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
                  className={`flex-1 rounded-lg px-4 py-2 transition-colors ${
                    cityType === "metro"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Metro
                </button>
                <button
                  onClick={() => setCityType("non-metro")}
                  className={`flex-1 rounded-lg px-4 py-2 transition-colors ${
                    cityType === "non-metro"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
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
                <p>Cess (4%): {formatCurrency(result.newRegime.cess)}</p>
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
