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
import { ShareResult } from "@/components/finance/share-result"
import { calculateSWP } from "@/lib/calculators/swp"
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/swp-calculator")({
  head: () =>
    generateSeoMeta({
      title: "SWP Calculator India | Corpus Longevity Planner",
      description:
        "Plan monthly mutual fund withdrawals with corpus longevity, inflation-adjusted income and estimated LTCG impact. Free SWP calculator India.",
      path: "/tools/swp-calculator",
      keywords: [
        "SWP calculator India",
        "systematic withdrawal plan calculator",
        "SWP corpus longevity calculator",
        "mutual fund SWP calculator",
        "monthly income from mutual fund calculator",
        "SWP tax calculator LTCG",
      ],
    }),
  component: SwpCalculatorPage,
})

const faqs = [
  {
    question: "What is SWP in mutual funds?",
    answer:
      "A Systematic Withdrawal Plan (SWP) allows periodic redemption from an invested corpus. It is commonly used by retirees who need stable monthly cash flow from mutual fund holdings.",
  },
  {
    question: "Is SWP income taxable in India?",
    answer:
      "SWP is a redemption, so tax applies on the gain component of redeemed units, not on the full withdrawal amount. The exact tax depends on asset type, holding period and applicable gain rules.",
  },
  {
    question: "How is LTCG calculated on SWP redemptions (FIFO)?",
    answer:
      "FIFO means earliest purchased units are treated as redeemed first. This affects holding-period classification and gain taxation over time. This tool provides a simplified long-term estimate.",
  },
  {
    question: "How long will INR 1 crore last at INR 50,000/month withdrawal?",
    answer:
      "It depends mainly on return rate and inflation. Use this calculator to model your own return assumptions and see exact depletion month or residual corpus.",
  },
  {
    question: "What is the ideal withdrawal rate from a mutual fund corpus?",
    answer:
      "A lower withdrawal rate improves longevity and resilience. This calculator shows your break-even annual return rate so you can test whether your plan is sustainable.",
  },
]

const howToSteps = [
  "Enter initial corpus available for withdrawals.",
  "Enter desired monthly SWP amount.",
  "Set expected annual return and inflation assumptions.",
  "Choose planning tenure in years.",
  "Review longevity, break-even rate, and tax estimate before finalizing plan.",
]

function SwpCalculatorPage() {
  const [initialCorpus, setInitialCorpus] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("corpus")) ||
        10000000
      )
    }
    return 10000000
  })

  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("wd")) || 50000
      )
    }
    return 50000
  })

  const [expectedReturnRate, setExpectedReturnRate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 10
      )
    }
    return 10
  })

  const [inflationRate, setInflationRate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("inflation")) ||
        6
      )
    }
    return 6
  })

  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("tenure")) || 25
      )
    }
    return 25
  })

  const result = useMemo(
    () =>
      calculateSWP({
        initialCorpus,
        monthlyWithdrawal,
        expectedReturnRate,
        tenureYears,
        inflationRate,
      }),
    [
      initialCorpus,
      monthlyWithdrawal,
      expectedReturnRate,
      tenureYears,
      inflationRate,
    ]
  )

  const isDepleted = result.depletedAtMonth !== null
  const annualWithdrawalRate =
    initialCorpus > 0 ? (monthlyWithdrawal * 12 * 100) / initialCorpus : 0

  const projectedYears = isDepleted
    ? Math.floor((result.depletedAtMonth ?? 0) / 12)
    : tenureYears
  const projectedMonths = isDepleted ? (result.depletedAtMonth ?? 0) % 12 : 0

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "SWP Calculator" },
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
          SWP Calculator - How Long Will Your Corpus Last?
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Use this SWP calculator India investors use to estimate retirement
          corpus longevity, inflation-adjusted withdrawal value and simplified
          LTCG impact.
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
          SWP Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Initial Corpus"
            value={initialCorpus}
            onChange={setInitialCorpus}
            min={0}
            max={1000000000}
          />
          <CurrencyInput
            label="Monthly Withdrawal"
            value={monthlyWithdrawal}
            onChange={setMonthlyWithdrawal}
            min={0}
            max={10000000}
          />
          <SliderField
            label="Expected Annual Return"
            value={expectedReturnRate}
            onChange={setExpectedReturnRate}
            min={0}
            max={20}
            step={0.25}
            formatValue={(v) => `${v}%`}
          />
          <SliderField
            label="Inflation Rate"
            value={inflationRate}
            onChange={setInflationRate}
            min={0}
            max={12}
            step={0.25}
            formatValue={(v) => `${v}%`}
          />
          <div className="sm:col-span-2">
            <SliderField
              label="Planning Tenure"
              value={tenureYears}
              onChange={setTenureYears}
              min={1}
              max={40}
              step={1}
              formatValue={(v) => `${v} years`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          SWP Projection Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: isDepleted ? "var(--fc-loss-bg)" : "var(--fc-gain-bg)",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {isDepleted
              ? "Corpus Depletion Point"
              : "Residual Corpus at Tenure End"}
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              isDepleted ? "text-fc-loss-text" : "text-fc-gain-text"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {isDepleted
              ? "Depleted"
              : formatCompactCurrency(result.finalCorpus)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isDepleted
              ? `Estimated depletion in ${projectedYears} years ${projectedMonths} months`
              : `Projected remaining corpus after ${tenureYears} years`}
          </p>
        </div>

        <ResultGrid cols={4}>
          <ResultCard
            label="Total Withdrawn"
            value={formatCompactCurrency(result.totalWithdrawn)}
            subtitle="Total SWP cash flow"
          />
          <ResultCard
            label="Withdrawal Rate"
            value={formatPercent(annualWithdrawalRate, 2)}
            subtitle="Annualized on starting corpus"
          />
          <ResultCard
            label="Break-even Return"
            value={formatPercent(result.breakEvenAnnualReturnRate, 2)}
            subtitle="Return needed to sustain principal"
          />
          <ResultCard
            label="Est. LTCG Tax"
            value={formatCompactCurrency(result.estimatedLtcgTaxOnWithdrawals)}
            subtitle="Simplified cumulative estimate"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Inflation-Adjusted Final Monthly Value"
            value={formatCompactCurrency(
              result.inflationAdjustedFinalMonthlyWithdrawal
            )}
            subtitle="Purchasing power at tenure end"
          />
          <ResultCard
            label="Final Corpus"
            value={formatCompactCurrency(result.finalCorpus)}
            subtitle={formatCurrency(result.finalCorpus)}
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Interest Earned
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Withdrawn
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Closing Corpus
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.schedule.map((row) => (
                  <tr
                    key={row.year}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      Year {row.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fc-gain-text">
                      +{formatCurrency(row.interestEarned)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fc-loss-text">
                      -{formatCurrency(row.withdrawn)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                      {formatCurrency(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            corpus: initialCorpus,
            wd: monthlyWithdrawal,
            rate: expectedReturnRate,
            inflation: inflationRate,
            tenure: tenureYears,
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
            How this systematic withdrawal plan calculator works
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
            SWP formula and decision interpretation
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
              Monthly projection logic follows: opening corpus earns monthly
              return, then fixed withdrawal is deducted. If withdrawal rate is
              above sustainable return, corpus eventually depletes.
            </p>
            <p>
              Break-even annual return is approximated as (Annual withdrawal /
              Initial corpus) × 100. Keep expected return comfortably above this
              threshold for higher longevity probability.
            </p>
            <p>
              Inflation-adjusted withdrawal value shows real purchasing power,
              helping retirees compare nominal income versus actual future
              affordability.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Withdrawal & Retirement Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Combine SWP analysis with long-term retirement and tax tools.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/epf-vpf-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              EPF / VPF Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/ltcg-stcg-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              LTCG & STCG Tax Calculator
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
            "@type": "SoftwareApplication",
            name: "SWP Calculator India",
            description:
              "Estimate mutual fund SWP corpus longevity with return, inflation and simplified tax impact.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/swp-calculator",

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
