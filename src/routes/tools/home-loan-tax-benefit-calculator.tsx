import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateHomeLoanTaxBenefit } from "@/lib/calculators/home-loan-tax-benefit"
import { formatCompactCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/home-loan-tax-benefit-calculator")(
  {
    head: () =>
      generateSeoMeta({
        title: "Home Loan Tax Benefit Calculator - Section 24(b) and 80C",
        description:
          "Estimate annual home-loan tax savings under old regime using Section 24(b) interest deduction and Section 80C principal deduction.",
        path: "/tools/home-loan-tax-benefit-calculator",
      }),
    component: HomeLoanTaxBenefitCalculator,
  }
)

const faqs = [
  {
    question: "How much home-loan interest can I claim under Section 24(b)?",
    answer:
      "For a self-occupied property, deduction is usually capped at Rs 2,00,000 per year under old regime assumptions.",
  },
  {
    question: "Can I claim principal repayment under Section 80C?",
    answer:
      "Yes, principal repayment can be part of Section 80C, but total 80C bucket is capped at Rs 1,50,000 including EPF/PPF/ELSS and other eligible items.",
  },
  {
    question: "Are these deductions available in new regime?",
    answer:
      "In most self-occupied cases, these deductions are not available in new regime. This tool reflects that default treatment.",
  },
]

const howToSteps = [
  "Enter annual interest paid from your lender statement.",
  "Enter annual principal repaid in the financial year.",
  "Add how much Section 80C is already used via other investments.",
  "Choose your tax regime and gross annual income for slab approximation.",
  "Review deductible amount, estimated tax saved, and effective interest cost.",
]

function HomeLoanTaxBenefitCalculator() {
  const [annualInterestPaid, setAnnualInterestPaid] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("interest")) ||
        240000
      )
    }
    return 240000
  })

  const [annualPrincipalPaid, setAnnualPrincipalPaid] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("principal")) ||
        110000
      )
    }
    return 110000
  })

  const [section80cUsedElsewhere, setSection80cUsedElsewhere] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("other80c")) ||
        60000
      )
    }
    return 60000
  })

  const [annualGrossIncome, setAnnualGrossIncome] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("income")) ||
        1800000
      )
    }
    return 1800000
  })

  const [taxRegime, setTaxRegime] = useState<"old" | "new">(() => {
    if (typeof window !== "undefined") {
      const regime = new URLSearchParams(window.location.search).get("regime")
      if (regime === "new") return "new"
    }
    return "old"
  })

  const result = useMemo(
    () =>
      calculateHomeLoanTaxBenefit({
        annualInterestPaid,
        annualPrincipalPaid,
        section80cUsedElsewhere,
        annualGrossIncome,
        taxRegime,
      }),
    [
      annualInterestPaid,
      annualPrincipalPaid,
      section80cUsedElsewhere,
      annualGrossIncome,
      taxRegime,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Home Loan Tax Benefit Calculator" },
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
          Home Loan Tax Benefit Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Estimate annual savings from Section 24(b) interest deduction and
          Section 80C principal deduction.
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
            label="Annual Interest Paid"
            value={annualInterestPaid}
            onChange={setAnnualInterestPaid}
            min={0}
            max={20000000}
          />
          <CurrencyInput
            label="Annual Principal Paid"
            value={annualPrincipalPaid}
            onChange={setAnnualPrincipalPaid}
            min={0}
            max={20000000}
          />

          <CurrencyInput
            label="Section 80C Used Elsewhere"
            value={section80cUsedElsewhere}
            onChange={setSection80cUsedElsewhere}
            min={0}
            max={150000}
          />
          <CurrencyInput
            label="Gross Annual Income"
            value={annualGrossIncome}
            onChange={setAnnualGrossIncome}
            min={0}
            max={50000000}
          />

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Tax Regime
            </label>
            <div className="flex flex-wrap gap-2">
              {(["old", "new"] as const).map((regime) => (
                <button
                  key={regime}
                  onClick={() => setTaxRegime(regime)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    taxRegime === regime
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {regime === "old" ? "Old Regime" : "New Regime"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Tax Benefit Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Estimated Annual Tax Saved
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.estimatedTaxSaved)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Approximation at marginal tax rate {result.marginalTaxRate}%
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Deductible Interest"
            value={formatCompactCurrency(result.deductibleInterest)}
            subtitle="Section 24(b)"
          />
          <ResultCard
            label="Deductible Principal"
            value={formatCompactCurrency(result.deductiblePrincipal)}
            subtitle="Section 80C availability"
          />
          <ResultCard
            label="Total Deduction"
            value={formatCompactCurrency(result.totalDeduction)}
            subtitle="Combined eligible deduction"
            variant="gain"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Annual Interest Paid"
            value={formatCompactCurrency(annualInterestPaid)}
            subtitle="As entered"
            variant="loss"
          />
          <ResultCard
            label="Effective Interest Cost"
            value={formatCompactCurrency(result.effectiveInterestCost)}
            subtitle="After estimated tax benefit"
            variant="gain"
          />
        </ResultGrid>

        <div className="mt-6 rounded-2xl bg-secondary p-5">
          <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Notes
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            interest: annualInterestPaid,
            principal: annualPrincipalPaid,
            other80c: section80cUsedElsewhere,
            income: annualGrossIncome,
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
            Interpreting effective borrowing cost
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
              Tax deductions reduce your net cash outflow and therefore
              effective borrowing cost. This is why two borrowers with same
              interest rate can have different real costs.
            </p>
            <p>
              If you are in old regime and still have 80C room left, principal
              repayment can improve tax efficiency further.
            </p>
            <p>
              For filing-level precision, always validate this estimate with
              lender certificate and your CA before final tax submission.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Tax & Loan Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Continue your analysis with these calculators.
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
              to="/tools/advanced-home-loan-emi-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Advanced Home Loan EMI Calculator
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
            name: "Home Loan Tax Benefit Calculator",
            url: "https://financechk.com/tools/home-loan-tax-benefit-calculator",
            description:
              "Estimate annual tax benefit from home loan deductions under old regime assumptions.",
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
