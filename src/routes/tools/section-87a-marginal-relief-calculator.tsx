import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import type { Section87aMarginalReliefInput } from "@/lib/calculators/section-87a-marginal-relief"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { calculateSection87aMarginalRelief } from "@/lib/calculators/section-87a-marginal-relief"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/tools/section-87a-marginal-relief-calculator"
)({
  head: () =>
    generateSeoMeta({
      title:
        "Section 87A Marginal Relief Calculator FY 2026-27 - Tax Rebate Up to Rs 25,000",
      description:
        "Find if you qualify for Section 87A rebate (up to Rs 25,000) or marginal relief near the Rs 12 lakh threshold. Enter total income + STCG/LTCG to see exact tax payable under new regime.",
      path: "/tools/section-87a-marginal-relief-calculator",
      keywords: [
        "section 87A marginal relief calculator",
        "87A rebate calculator 2026-27",
        "marginal relief income tax calculator India",
        "tax rebate under 87A new regime",
        "income above 12 lakh marginal relief",
        "87A rebate on special rate income",
        "rebate under section 87A FY 2026-27",
        "how to calculate marginal relief in new tax regime",
        "section 87A rebate on STCG income new regime",
        "income 12.5 lakh tax calculation with marginal relief",
      ],
    }),
  component: Section87aMarginalReliefCalculator,
})

const faqs = [
  {
    question: "What is Section 87A marginal relief?",
    answer:
      "Section 87A provides a tax rebate of up to Rs 25,000 for individuals with total income up to Rs 12 lakh (under new regime). Marginal relief applies when income slightly exceeds this threshold to prevent sudden tax spike.",
  },
  {
    question: "Is 87A rebate available on STCG income in new regime?",
    answer:
      "No, STCG (short-term capital gains under Section 111A) and LTCG are NOT eligible for Section 87A rebate. These are taxed at special rates separately and do not qualify for the Rs 25,000 rebate.",
  },
  {
    question: "At what income does marginal relief stop in new regime?",
    answer:
      "Marginal relief applies when income is between Rs 12 lakh and approximately Rs 12.5 lakh. Beyond this, regular slab tax applies and the relief effect diminishes significantly.",
  },
  {
    question: "How is marginal relief calculated with a formula?",
    answer:
      "Marginal relief = Tax payable - (Total income - Rs 12 lakh), capped so extra tax does not exceed the excess income. This prevents paying more tax on Rs 12.1 lakh than on Rs 12 lakh.",
  },
  {
    question: "What is the difference between 87A rebate and marginal relief?",
    answer:
      "87A rebate: Direct Rs 25,000 reduction when income <= Rs 12 lakh. Marginal relief: Gradual adjustment when income isRs 12-12.5 lakh to smooth the tax curve. Both work together near the threshold.",
  },
]

const howToSteps = [
  "Enter gross total income for the financial year.",
  "Add special-rate income (for example, specific capital gains).",
  "Select new or old regime.",
  "Review normal tax, rebate, marginal relief and final tax payable.",
  "Compare nearby values around the threshold to understand tax impact.",
]

function Section87aMarginalReliefCalculator() {
  const [grossTotalIncome, setGrossTotalIncome] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("income")) ||
        1200000
      )
    }
    return 1200000
  })

  const [specialRateIncome, setSpecialRateIncome] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("special")) || 0
      )
    }
    return 0
  })

  const [taxRegime, setTaxRegime] = useState<
    Section87aMarginalReliefInput["taxRegime"]
  >(() => {
    if (typeof window !== "undefined") {
      const regime = new URLSearchParams(window.location.search).get("regime")
      if (regime === "old") return "old"
    }
    return "new"
  })

  const result = useMemo(
    () =>
      calculateSection87aMarginalRelief({
        grossTotalIncome,
        specialRateIncome,
        taxRegime,
      }),
    [grossTotalIncome, specialRateIncome, taxRegime]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Section 87A Marginal Relief Calculator" },
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
          Section 87A Rebate & Marginal Relief Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Check 87A rebate eligibility, special-rate income effect and marginal
          relief near threshold incomes before filing your return.
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
          Tax Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Gross Total Income"
            value={grossTotalIncome}
            onChange={setGrossTotalIncome}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="Special-rate Income"
            value={specialRateIncome}
            onChange={setSpecialRateIncome}
            min={0}
            max={50000000}
          />

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Tax Regime
            </label>
            <div className="flex flex-wrap gap-2">
              {(["new", "old"] as const).map((regime) => (
                <button
                  key={regime}
                  onClick={() => setTaxRegime(regime)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    taxRegime === regime
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {regime === "new" ? "New Regime" : "Old Regime"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Relief Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background:
              result.finalTaxPayable > 0
                ? "var(--fc-warm-stone)"
                : "var(--fc-gain-bg)",
            boxShadow:
              result.finalTaxPayable > 0
                ? "rgba(78,50,23,0.04) 0px 6px 16px"
                : undefined,
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Final Tax Payable
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.finalTaxPayable)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.finalTaxPayable)} including cess
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Regular Income"
            value={formatCompactCurrency(result.regularIncome)}
            subtitle="After special-rate split"
          />
          <ResultCard
            label="Regular Tax"
            value={formatCompactCurrency(result.regularTax)}
            subtitle="Before rebate"
          />
          <ResultCard
            label="Special-rate Tax"
            value={formatCompactCurrency(result.specialRateTax)}
            subtitle="Computed separately"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="87A Rebate"
            value={formatCompactCurrency(result.rebateAmount)}
            subtitle={`Threshold ${formatCurrency(result.rebateThreshold)}`}
            variant="gain"
          />
          <ResultCard
            label="Marginal Relief"
            value={formatCompactCurrency(result.marginalReliefAmount)}
            subtitle="Additional relief near threshold"
            variant="gain"
          />
        </ResultGrid>

        <ResultGrid cols={3} className="mt-3">
          <ResultCard
            label="Tax Before Rebate"
            value={formatCompactCurrency(result.baseTaxBeforeRebate)}
            subtitle="Regular + special-rate"
          />
          <ResultCard
            label="Tax After Relief"
            value={formatCompactCurrency(result.taxAfterRelief)}
            subtitle="Before cess"
          />
          <ResultCard
            label="Cess (4%)"
            value={formatCompactCurrency(result.cess)}
            subtitle="Health & education cess"
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            income: grossTotalIncome,
            special: specialRateIncome,
            regime: taxRegime,
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
            87A rebate calculator with marginal relief logic
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
              This section 87A marginal relief calculator is designed for users
              searching high-intent queries like "87A rebate calculator 2026-27"
              and "marginal relief income tax calculator India".
            </p>
            <p>
              It separates regular income from special-rate income so you can
              see where rebate applies and where it does not. That makes
              threshold decisions clearer when income is close to the rebate
              boundary.
            </p>
            <p>
              Use this output as a planning reference, then verify final numbers
              during filing with your full return data and professional review.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Tax Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Continue planning using connected tax calculators.
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
              to="/tools/new-vs-old-regime-break-even"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Tax Regime Break-Even Finder
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
            name: "Section 87A Marginal Relief Calculator",
            url: "https://financechk.com/tools/section-87a-marginal-relief-calculator",
            description:
              "Calculate Section 87A rebate (up to Rs 25,000) and marginal relief for income Rs 12-12.5 lakh.",
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
