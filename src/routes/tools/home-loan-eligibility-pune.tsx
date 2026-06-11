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

const CITY_NAME = "Pune"

export const Route = createFileRoute("/tools/home-loan-eligibility-pune")({
  head: () =>
    generateSeoMeta({
      title: `Home Loan Eligibility Calculator ${CITY_NAME} - Loan Eligibility ${CITY_NAME}`,
      description: `Calculate your home loan eligibility in ${CITY_NAME}. Check how much loan you can get based on your salary in ${CITY_NAME}. Get instant eligibility for SBI, HDFC, ICICI home loans in ${CITY_NAME}.`,
      path: "/tools/home-loan-eligibility-pune",
    }),
  component: HomeLoanCalculator,
})

const faqs = [
  {
    question: `What is the average home loan eligibility in ${CITY_NAME}?`,
    answer: `In ${CITY_NAME}, with a ₹1 lakh monthly salary, you can get a home loan of approximately ₹40-50 lakh. ${CITY_NAME} is an emerging IT hub with good property options. A 2BHK in good areas costs ₹55-90 lakh.`,
  },
  {
    question: "Which banks offer the best home loan rates in Pune?",
    answer:
      "In Pune, SBI, HDFC, ICICI, Axis Bank, and Bank of Baroda offer competitive home loan rates (8.25-8.75%). Many banks have special schemes for IT professionals in Hinjewadi and Magarpatta.",
  },
  {
    question: "What is the average property price in Pune?",
    answer:
      "Average property prices in Pune range from ₹5,500-₹12,000 per sq ft depending on location. Hinjewadi, Kharadi, and Wakad are popular IT areas. A 2BHK costs ₹55 lakh to ₹1 crore.",
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
          </div>
          <div className="rounded-2xl bg-card p-6 text-center shadow-md">
            <p className="text-sm text-muted-foreground">Recommended EMI</p>
            <p className="text-2xl font-bold">
              {formatCurrency(result.recommendedEMI)}
            </p>
          </div>
          <div className="rounded-2xl bg-card p-6 text-center shadow-md">
            <p className="text-sm text-muted-foreground">Monthly Salary</p>
            <p className="text-2xl font-bold">
              {formatCurrency(monthlySalary)}
            </p>
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
