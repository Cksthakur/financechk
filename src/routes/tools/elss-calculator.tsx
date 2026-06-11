import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { ShareResult } from "@/components/finance/share-result"
import { calculateElss } from "@/lib/calculators/elss"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/elss-calculator")({
  head: () =>
    generateSeoMeta({
      title: "ELSS Calculator India - Section 80C Tax Saving + Returns",
      description:
        "Free ELSS calculator for India. Estimate Section 80C tax savings, yearly investment growth, and final corpus with the 3-year ELSS lock-in considered.",
      path: "/tools/elss-calculator",
    }),
  component: ElssCalculator,
})

const faqs = [
  {
    question: "What is ELSS?",
    answer:
      "ELSS (Equity Linked Savings Scheme) is a tax-saving mutual fund under Section 80C with the shortest lock-in among major tax-saving options at 3 years. It offers market-linked returns and deduction up to Rs 1.5 lakh per financial year.",
  },
  {
    question: "How much tax can I save using ELSS?",
    answer:
      "Tax saved is capped by your eligible 80C deduction. Maximum eligible amount is Rs 1.5 lakh per year. So if your tax slab is 30%, maximum direct tax saving can be around Rs 45,000 (excluding cess/surcharge impact).",
  },
  {
    question: "Is ELSS better than PPF for tax saving?",
    answer:
      "ELSS has higher return potential but market risk. PPF is low-risk and government-backed but has a long lock-in. For long-term growth with tax benefit, many investors use both: ELSS for return potential and PPF for debt stability.",
  },
  {
    question: "Can I invest in ELSS every month?",
    answer:
      "Yes. SIP in ELSS is common. Every SIP installment gets its own 3-year lock-in, so units become redeemable in a staggered manner.",
  },
]

const howToSteps = [
  "Enter your monthly ELSS SIP amount.",
  "Set expected annual return based on your long-term assumption.",
  "Choose your investment horizon in years.",
  "Select your tax slab to estimate Section 80C benefit.",
  "Review total corpus, market gains, and tax-adjusted wealth.",
]

function ElssCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("amount")) ||
        12500
      )
    }
    return 12500
  })

  const [expectedReturnRate, setExpectedReturnRate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 12
      )
    }
    return 12
  })

  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("tenure")) || 15
      )
    }
    return 15
  })

  const [taxBracket, setTaxBracket] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("slab")) || 30
      )
    }
    return 30
  })

  const result = useMemo(
    () =>
      calculateElss({
        monthlyInvestment,
        expectedReturnRate,
        tenureYears,
        taxBracket,
      }),
    [monthlyInvestment, expectedReturnRate, tenureYears, taxBracket]
  )

  const taxAdjustedGainPct =
    result.effectiveNetInvestment > 0
      ? (
          (result.wealthOverEffectiveCost / result.effectiveNetInvestment) *
          100
        ).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "ELSS Calculator" },
      ]}
    >
      <div className="mb-6">
        <h1
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "48px",
            letterSpacing: "-0.96px",
            lineHeight: 1.08,
          }}
        >
          ELSS Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Estimate your ELSS SIP corpus, annual Section 80C tax savings, and
          tax-adjusted wealth creation over time.
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
          ELSS Investment Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Monthly ELSS SIP"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={500}
              max={500000}
            />
          </div>

          <SliderField
            label="Expected Annual Return"
            value={expectedReturnRate}
            onChange={setExpectedReturnRate}
            min={1}
            max={24}
            step={0.5}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Investment Horizon"
            value={tenureYears}
            onChange={setTenureYears}
            min={3}
            max={35}
            step={1}
            formatValue={(v) => `${v} yrs`}
          />

          <SliderField
            label="Tax Slab"
            value={taxBracket}
            onChange={setTaxBracket}
            min={0}
            max={30}
            step={5}
            formatValue={(v) => `${v}%`}
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          ELSS Outcome
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Projected Corpus
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalCorpus)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.totalCorpus)}
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Total Invested"
            value={formatCompactCurrency(result.totalInvested)}
            subtitle="Total SIP contributions"
          />
          <ResultCard
            label="Market Gains"
            value={formatCompactCurrency(result.marketGains)}
            subtitle="Corpus minus invested amount"
            variant="gain"
          />
          <ResultCard
            label="Total Tax Saved"
            value={formatCompactCurrency(result.totalTaxSaved)}
            subtitle={`${formatCurrency(result.annualTaxSaved)} per year (estimated)`}
            variant="gain"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Effective Net Investment"
            value={formatCompactCurrency(result.effectiveNetInvestment)}
            subtitle="Invested amount minus cumulative tax saved"
          />
          <ResultCard
            label="Wealth Over Net Cost"
            value={formatCompactCurrency(result.wealthOverEffectiveCost)}
            subtitle={`${taxAdjustedGainPct}% gain on tax-adjusted capital`}
            variant="gain"
          />
        </ResultGrid>

        <div
          className="mt-8 rounded-2xl bg-card p-5 md:p-6"
          style={{
            boxShadow:
              "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
          }}
        >
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Yearly ELSS Growth
          </p>
          <PayoffChart
            data={result.schedule.map((row) => ({
              year: row.year,
              baseAmount: row.invested,
              growthAmount: row.marketGain,
            }))}
            baseLabel="Amount Invested"
            growthLabel="Market Gains"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            amount: monthlyInvestment,
            rate: expectedReturnRate,
            tenure: tenureYears,
            slab: taxBracket,
          }}
        />
      </div>

      <div className="mt-14 flex flex-col gap-12">
        <section>
          <h2
            className="mb-6 text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "36px",
              letterSpacing: "normal",
              lineHeight: 1.13,
            }}
          >
            How to use this calculator
          </h2>
          <ol className="flex flex-col gap-4">
            {howToSteps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 text-muted-foreground"
                style={{
                  fontSize: "18px",
                  lineHeight: 1.6,
                  letterSpacing: "0.18px",
                }}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
                  {i + 1}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2
            className="mb-6 text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "36px",
              letterSpacing: "normal",
              lineHeight: 1.13,
            }}
          >
            Why ELSS is a high-intent tax-saving product
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              ELSS is often the first choice for investors who want both tax
              savings and equity growth. Under Section 80C, ELSS contributes to
              the same Rs 1.5 lakh deduction bucket used by EPF, PPF, life
              insurance premium, and principal repayment.
            </p>
            <p>
              Its 3-year lock-in is shorter than most alternatives, making it
              useful for people who want tax optimization without a 10-15 year
              commitment. At the same time, returns are market-linked, so long
              investment horizons usually improve outcomes.
            </p>
            <p>
              This calculator helps you evaluate ELSS not only on raw corpus,
              but also on tax-adjusted effective investment, which is a better
              lens for comparing with non-tax-saving mutual funds.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Compare Before You Invest
          </h3>
          <p className="mb-6 text-muted-foreground">
            Use these related calculators to check whether your overall tax
            regime and SIP strategy are aligned with your long-term goals.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/tax-regime-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Old vs New Tax Regime Comparison
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/sip-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              SIP Calculator
              <IconChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ELSS Calculator",
            url: "https://financechk.com/tools/elss-calculator",
            description:
              "Estimate ELSS tax savings and long-term corpus using SIP assumptions.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          }),
        }}
      />
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
