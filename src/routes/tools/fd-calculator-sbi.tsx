import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { calculateFD } from "@/lib/calculators/investments"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

const BANK_NAME = "State Bank of India (SBI)"

export const Route = createFileRoute("/tools/fd-calculator-sbi")({
  head: () =>
    generateSeoMeta({
      title: "SBI FD Calculator - Current SBI FD Rates 2025",
      description:
        "Calculate your SBI Fixed Deposit returns with current interest rates. Compare SBI FD rates for 1 year, 2 year, 3 year, 5 year terms. Senior citizen rates also available.",
      path: "/tools/fd-calculator-sbi",
    }),
  component: FdCalculator,
})

const faqs = [
  {
    question: "What is the current SBI FD interest rate?",
    answer:
      "As of April 2026, SBI offers 6.50% for general citizens and 7.50% for senior citizens on 1-year FD. The 5-year FD rate is 6.75% (7.75% for seniors). SBI FD rates are competitive and government-backed.",
  },
  {
    question: "Is SBI FD safe?",
    answer:
      "Yes, SBI FDs are extremely safe as SBI is India's largest bank. All SBI deposits are insured by DICGC up to ₹5 lakh per depositor per bank. SBI has consistently maintained its credit rating.",
  },
  {
    question: "Does SBI offer tax-saving FD?",
    answer:
      "Yes, SBI offers 5-year tax-saving FD under Section 80C of Income Tax Act. You can invest up to ₹1.5 lakh per financial year and claim tax deduction. The interest is taxable but principal qualifies for 80C deduction.",
  },
  {
    question: "What is the minimum deposit for SBI FD?",
    answer:
      "SBI minimum FD deposit is ₹1,000 for regular FDs. For tax-saving FDs, minimum is ₹1,000 as well. You can open FD through SBI Yono app, net banking, or visit any branch.",
  },
]

function FdCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [tenureYears, setTenureYears] = useState(1)
  const [interestRate, setInterestRate] = useState(6.5)
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false)

  const result = useMemo(
    () =>
      calculateFD({
        principal,
        tenureYears,
        interestRate: isSeniorCitizen ? interestRate + 1 : interestRate,
        compoundingFrequency: 4,
      }),
    [principal, tenureYears, interestRate, isSeniorCitizen]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "FD Calculator", href: "/tools/fd-calculator" },
        { label: "SBI" },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-0 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {BANK_NAME} Fixed Deposit Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculate your SBI FD returns with current interest rates. Compare
            returns for senior citizens and general citizens.
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4 text-blue-800">
          <p className="font-medium">
            Current SBI FD Rates (April 2026): General: 6.25-6.75% | Senior
            Citizens: 7.25-7.75%
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr,1fr]">
          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">FD Details</h2>
            <CurrencyInput
              label="Deposit Amount"
              value={principal}
              onChange={setPrincipal}
              currency="INR"
            />
            <SliderField
              label="Tenure (Years)"
              value={tenureYears}
              onChange={setTenureYears}
              min={1}
              max={10}
              step={1}
              formatValue={(v) => `${v} Years`}
            />
            <SliderField
              label="Interest Rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              min={4}
              max={10}
              step={0.1}
              formatValue={(v) => `${v}%`}
            />
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <span className="text-sm font-medium">
                Senior Citizen (Extra 1%)
              </span>
              <button
                onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
                className={`rounded-full px-4 py-1 text-sm ${isSeniorCitizen ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {isSeniorCitizen ? "Yes" : "No"}
              </button>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Your Returns</h2>
            <div className="space-y-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Principal</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(principal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Earned</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCompactCurrency(result.estimatedReturns)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maturity Value</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCompactCurrency(result.totalCorpus)}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-sm text-green-700">
                  Total Return:{" "}
                  {((result.estimatedReturns / principal) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/50 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            SBI FD Rates Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left">Tenure</th>
                  <th className="pb-2 text-right">General Rate</th>
                  <th className="pb-2 text-right">Senior Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">7-45 days</td>
                  <td className="text-right">4.50%</td>
                  <td className="text-right">5.50%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">46-90 days</td>
                  <td className="text-right">5.50%</td>
                  <td className="text-right">6.50%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">91-179 days</td>
                  <td className="text-right">6.00%</td>
                  <td className="text-right">7.00%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">180-210 days</td>
                  <td className="text-right">6.25%</td>
                  <td className="text-right">7.25%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">211 days - 1 year</td>
                  <td className="text-right">6.50%</td>
                  <td className="text-right">7.50%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">1-2 years</td>
                  <td className="text-right">6.75%</td>
                  <td className="text-right">7.75%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">2-3 years</td>
                  <td className="text-right">6.75%</td>
                  <td className="text-right">7.75%</td>
                </tr>
                <tr>
                  <td className="py-2">3-5 years</td>
                  <td className="text-right">6.50%</td>
                  <td className="text-right">7.50%</td>
                </tr>
              </tbody>
            </table>
          </div>
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
