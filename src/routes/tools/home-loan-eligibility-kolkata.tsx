import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { calculateHomeLoan } from "@/lib/calculators/home-loan"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

const CITY_NAME = "Kolkata"

export const Route = createFileRoute("/tools/home-loan-eligibility-kolkata")({
  head: () =>
    generateSeoMeta({
      title: `Home Loan Eligibility Calculator ${CITY_NAME} - Loan Eligibility ${CITY_NAME}`,
      description: `Calculate your home loan eligibility in ${CITY_NAME}. Check how much loan you can get based on your salary in ${CITY_NAME}. Get instant eligibility for SBI, HDFC, ICICI home loans in ${CITY_NAME}.`,
      path: "/tools/home-loan-eligibility-kolkata",
    }),
  component: HomeLoanCalculator,
})

const faqs = [
  {
    question: `What is the average home loan eligibility in ${CITY_NAME}?`,
    answer: `In ${CITY_NAME}, with a ₹1 lakh monthly salary, you can get a home loan of approximately ₹40-50 lakh. ${CITY_NAME} has relatively affordable property compared to Mumbai. A decent 2BHK in Salt Lake or EM Bypass costs ₹35-60 lakh.`,
  },
  {
    question: "Which banks offer the best home loan rates in Kolkata?",
    answer:
      "In Kolkata, SBI, HDFC, ICICI, Axis Bank, and UCO Bank offer competitive home loan rates (8.25-8.75%). SBI has special schemes for West Bengal government employees.",
  },
  {
    question: "What is the average property price in Kolkata?",
    answer:
      "Average property prices in Kolkata range from ₹5,000-₹12,000 per sq ft depending on location. Salt Lake, New Town are premium. A decent 2BHK costs ₹30-60 lakh.",
  },
]

function HomeLoanCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(100000)
  const [existingEMI, setExistingEMI] = useState(0)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(20)
  const [employerType, setEmployerType] = useState<
    "salaried-private" | "salaried-govt" | "self-employed"
  >("salaried-private")

  const result = useMemo(
    () =>
      calculateHomeLoan({
        monthlySalary,
        existingEMI,
        interestRate,
        tenureYears,
        employerType,
      }),
    [monthlySalary, existingEMI, interestRate, tenureYears, employerType]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        {
          label: "Home Loan Eligibility",
          href: "/tools/home-loan-eligibility-calculator",
        },
        { label: `${CITY_NAME}` },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-0 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Home Loan Eligibility Calculator - {CITY_NAME}
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculate how much home loan you can get in {CITY_NAME}. Based on
            FOIR method used by Indian banks like SBI, HDFC, ICICI.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr,1fr]">
          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Your Details</h2>
            <CurrencyInput
              label="Monthly Salary"
              value={monthlySalary}
              onChange={setMonthlySalary}
              currency="INR"
            />
            <CurrencyInput
              label="Existing Monthly EMIs"
              value={existingEMI}
              onChange={setExistingEMI}
              currency="INR"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Employer Type</label>
              <div className="flex gap-2">
                {(
                  [
                    "salaried-private",
                    "salaried-govt",
                    "self-employed",
                  ] as const
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => setEmployerType(type)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${employerType === type ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                  >
                    {type === "salaried-private"
                      ? "Private"
                      : type === "salaried-govt"
                        ? "Govt"
                        : "Self-Employed"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Loan Parameters</h2>
            <SliderField
              label="Interest Rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              min={6}
              max={12}
              step={0.25}
              formatValue={(v) => `${v}%`}
            />
            <SliderField
              label="Tenure (Years)"
              value={tenureYears}
              onChange={setTenureYears}
              min={5}
              max={30}
              step={1}
              formatValue={(v) => `${v} Years`}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-6 text-center shadow-md">
            <p className="text-sm text-muted-foreground">
              Max Loan Eligibility
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCompactCurrency(result.maxLoanAmount)}
            </p>
            <p className="text-sm text-muted-foreground">Based on FOIR</p>
          </div>
          <div className="rounded-2xl bg-card p-6 text-center shadow-md">
            <p className="text-sm text-muted-foreground">Recommended EMI</p>
            <p className="text-2xl font-bold">
              {formatCurrency(result.recommendedEMI)}
            </p>
            <p className="text-sm text-muted-foreground">
              @ {interestRate}% for {tenureYears} yrs
            </p>
          </div>
          <div className="rounded-2xl bg-card p-6 text-center shadow-md">
            <p className="text-sm text-muted-foreground">Monthly Salary</p>
            <p className="text-2xl font-bold">
              {formatCurrency(monthlySalary)}
            </p>
            <p className="text-sm text-muted-foreground">Net monthly</p>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/50 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Property Budget in {CITY_NAME}
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Economy</p>
              <p className="text-xl font-bold">
                {formatCompactCurrency(result.maxLoanAmount * 0.6)}
              </p>
              <p className="text-sm">2BHK in bt road</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Standard</p>
              <p className="text-xl font-bold">
                {formatCompactCurrency(result.maxLoanAmount * 0.8)}
              </p>
              <p className="text-sm">2BHK in Salt Lake</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Premium</p>
              <p className="text-xl font-bold">
                {formatCompactCurrency(result.maxLoanAmount)}
              </p>
              <p className="text-sm">3BHK in New Town</p>
            </div>
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
