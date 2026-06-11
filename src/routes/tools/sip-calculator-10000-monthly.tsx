import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { SliderField } from "@/components/finance/slider-field"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { calculateSIP } from "@/lib/calculators/sip"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

const MONTHLY_AMOUNT = 10000
const AMOUNT_LABEL = "₹10,000"
const TENURE_YEARS = 10
const RETURN_RATE = 12

export const Route = createFileRoute("/tools/sip-calculator-10000-monthly")({
  head: () =>
    generateSeoMeta({
      title: `SIP Calculator ${AMOUNT_LABEL} Monthly - ${TENURE_YEARS} Year Returns`,
      description: `Free SIP calculator for ${AMOUNT_LABEL} monthly investment. Calculate returns over ${TENURE_YEARS} years with ${RETURN_RATE}% expected return. See how your money grows to big corpus.`,
      path: "/tools/sip-calculator-10000-monthly",
    }),
  component: SIPCalculator,
})

const faqs = [
  {
    question: `What will be my returns if I invest ${AMOUNT_LABEL} monthly for ${TENURE_YEARS} years?`,
    answer: `At ${RETURN_RATE}% expected return, your ${AMOUNT_LABEL} monthly SIP for ${TENURE_YEARS} years will grow to approximately ₹23.2 lakh. You would have invested ₹12 lakh total, earning ₹11.2 lakh in returns. That's a 93% return on your investment!`,
  },
  {
    question: `Is ${AMOUNT_LABEL} monthly SIP good for financial goals?`,
    answer: `${AMOUNT_LABEL} monthly SIP is excellent for building wealth! For a ${TENURE_YEARS}-year goal at ${RETURN_RATE}%, it creates ₹23 lakh. For 20 years, it grows to ₹99.7 lakh (almost ₹1 crore). This is a great amount for retirement or buying a house.`,
  },
  {
    question: "Which mutual funds are best for ₹10,000 SIP?",
    answer:
      "For ₹10,000 monthly SIP, you can consider a diversified portfolio: 50% in index funds (Nifty 50), 30% in Flexicap funds for growth, and 20% in small-cap funds for higher returns. Always consult a financial advisor before investing.",
  },
]

function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(MONTHLY_AMOUNT)
  const [expectedReturnRate, setExpectedReturnRate] = useState(RETURN_RATE)
  const [tenureYears, setTenureYears] = useState(TENURE_YEARS)

  const result = useMemo(
    () => calculateSIP({ monthlyInvestment, expectedReturnRate, tenureYears }),
    [monthlyInvestment, expectedReturnRate, tenureYears]
  )

  const gainPercent =
    result.totalInvested > 0
      ? ((result.estimatedReturns / result.totalInvested) * 100).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "SIP Calculators", href: "/tools/sip-calculator" },
        { label: `${AMOUNT_LABEL} Monthly SIP` },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-0 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            SIP Calculator - {AMOUNT_LABEL} Monthly Investment
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculate your Systematic Investment Plan returns with{" "}
            {AMOUNT_LABEL} monthly contribution. See how your money grows with
            the power of compounding.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr,1fr]">
          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Investment Details</h2>
            <SliderField
              label="Monthly Investment"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={500}
              max={100000}
              step={500}
              formatValue={(v) => formatCurrency(v)}
            />
            <SliderField
              label="Expected Annual Return (%)"
              value={expectedReturnRate}
              onChange={setExpectedReturnRate}
              min={4}
              max={20}
              step={0.5}
              formatValue={(v) => `${v}%`}
            />
            <SliderField
              label="Investment Tenure (Years)"
              value={tenureYears}
              onChange={setTenureYears}
              min={1}
              max={30}
              step={1}
              formatValue={(v) => `${v} Years`}
            />
          </div>

          <div className="space-y-6 rounded-2xl bg-card p-6 shadow-md">
            <h2 className="text-xl font-semibold">Your Results</h2>
            <div className="space-y-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">
                  {formatCompactCurrency(result.totalInvested)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated Returns
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCompactCurrency(result.estimatedReturns)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCompactCurrency(result.totalCorpus)}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-sm text-green-700">
                  Returns: +{gainPercent}% on investment
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/50 p-6">
          <h3 className="mb-4 text-lg font-semibold">How Your Money Grows</h3>
          <PayoffChart
            data={result.schedule
              .filter((row) => row.month % 12 === 0)
              .map((row) => ({
                year: row.year,
                baseAmount: row.invested,
                growthAmount: row.returns,
              }))}
            baseLabel="Amount Invested"
            growthLabel="Wealth Gained"
          />
        </div>

        <ResultGrid>
          <ResultCard
            label="Total Invested"
            value={formatCompactCurrency(result.totalInvested)}
            subtitle={`${tenureYears} yrs × 12 × ${formatCurrency(monthlyInvestment)}`}
          />
          <ResultCard
            label="Est. Returns"
            value={formatCompactCurrency(result.estimatedReturns)}
            subtitle={`${gainPercent}% absolute gain`}
          />
          <ResultCard
            label="Wealth Multiplier"
            value={`${result.totalInvested > 0 ? (result.totalCorpus / result.totalInvested).toFixed(1) : "0"}x`}
            subtitle="Your money grew by"
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
