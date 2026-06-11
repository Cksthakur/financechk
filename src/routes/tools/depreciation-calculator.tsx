import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import type { DepreciationMethod } from "@/lib/calculators/depreciation"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateDepreciation } from "@/lib/calculators/depreciation"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/depreciation-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Depreciation Calculator - SLM and WDV Method",
      description:
        "Calculate asset depreciation using straight-line method (SLM) and written-down value (WDV) method with yearly book value schedule.",
      path: "/tools/depreciation-calculator",
    }),
  component: DepreciationCalculator,
})

const faqs = [
  {
    question: "What is depreciation?",
    answer:
      "Depreciation is the systematic reduction in an asset's book value over time due to usage, wear, and obsolescence.",
  },
  {
    question: "What is the difference between SLM and WDV?",
    answer:
      "SLM charges equal depreciation every year. WDV charges depreciation on opening book value each year, so depreciation amount declines over time.",
  },
  {
    question: "Which method should I use?",
    answer:
      "Use the method required by your accounting/tax framework. Many business-tax schedules in India use block-based WDV principles, while management books may use SLM.",
  },
]

const howToSteps = [
  "Enter original asset cost and expected salvage value.",
  "Set useful life in years.",
  "Choose SLM or WDV method.",
  "For WDV, set annual depreciation rate.",
  "Review yearly opening value, depreciation, and closing book value.",
]

function DepreciationCalculator() {
  const [assetCost, setAssetCost] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("cost")) ||
        1200000
      )
    }
    return 1200000
  })

  const [salvageValue, setSalvageValue] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("salvage")) ||
        120000
      )
    }
    return 120000
  })

  const [usefulLifeYears, setUsefulLifeYears] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("life")) || 10
      )
    }
    return 10
  })

  const [method, setMethod] = useState<DepreciationMethod>(() => {
    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("method")
      if (value === "straight-line") return "straight-line"
    }
    return "written-down-value"
  })

  const [depreciationRate, setDepreciationRate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 15
      )
    }
    return 15
  })

  const result = useMemo(
    () =>
      calculateDepreciation({
        assetCost,
        salvageValue,
        usefulLifeYears,
        depreciationRate,
        method,
      }),
    [assetCost, salvageValue, usefulLifeYears, depreciationRate, method]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Depreciation Calculator" },
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
          Depreciation Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate yearly depreciation and closing asset value using SLM or WDV
          method.
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
          Asset Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Asset Cost"
            value={assetCost}
            onChange={setAssetCost}
            min={0}
            max={1000000000}
          />
          <CurrencyInput
            label="Salvage Value"
            value={salvageValue}
            onChange={setSalvageValue}
            min={0}
            max={1000000000}
          />

          <SliderField
            label="Useful Life"
            value={usefulLifeYears}
            onChange={setUsefulLifeYears}
            min={1}
            max={30}
            step={1}
            formatValue={(v) => `${v.toFixed(0)} years`}
          />

          <SliderField
            label="Depreciation Rate (WDV)"
            value={depreciationRate}
            onChange={setDepreciationRate}
            min={1}
            max={60}
            step={0.5}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Method
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMethod("straight-line")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  method === "straight-line"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                Straight-Line (SLM)
              </button>
              <button
                onClick={() => setMethod("written-down-value")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  method === "written-down-value"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                Written-Down Value (WDV)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Depreciation Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total Depreciation
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalDepreciation)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Over {usefulLifeYears} years
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Initial Asset Cost"
            value={formatCompactCurrency(assetCost)}
            subtitle="Opening gross value"
          />
          <ResultCard
            label="End Book Value"
            value={formatCompactCurrency(result.endBookValue)}
            subtitle="Closing value after depreciation"
          />
          <ResultCard
            label="Method"
            value={method === "straight-line" ? "SLM" : "WDV"}
            subtitle={
              method === "straight-line"
                ? "Equal annual charge"
                : `${depreciationRate.toFixed(1)}% on opening value`
            }
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Opening Value
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Depreciation
                  </th>
                  <th className="px-4 py-4 text-right font-medium text-foreground">
                    Closing Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.schedule.map((row, i) => (
                  <tr
                    key={row.year}
                    className={`transition-colors hover:bg-muted/50 ${
                      i % 2 === 0 ? "bg-card" : "bg-secondary/10"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      Year {row.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.openingValue)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      -{formatCurrency(row.depreciation)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(row.closingValue)}
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
            cost: assetCost,
            salvage: salvageValue,
            life: usefulLifeYears,
            rate: depreciationRate,
            method,
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
            Why depreciation planning matters
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
              Depreciation affects profitability, tax computations, and asset
              replacement planning. A clear schedule helps you align accounting
              and budget decisions.
            </p>
            <p>
              SLM provides stable annual expense, while WDV front-loads higher
              depreciation in early years. Method choice can materially
              influence year-wise profit profile.
            </p>
            <p>
              Use this as an estimation tool, then apply your statutory schedule
              and auditor guidance for final books.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Combine depreciation planning with tax and cash-flow tools.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/freelancer-tax-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Freelancer Tax Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/tax-regime-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Old vs New Tax Regime Comparison
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
            name: "Depreciation Calculator",
            url: "https://financechk.com/tools/depreciation-calculator",
            description:
              "Calculate annual depreciation schedule using SLM and WDV methods.",
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
