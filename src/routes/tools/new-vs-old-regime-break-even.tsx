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
import { formatCompactCurrency } from "@/lib/format"
import { AVAILABLE_FYS } from "@/lib/calculators/tax-regime"
import { calculateTaxRegimeBreakEven } from "@/lib/calculators/tax-regime-break-even"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/new-vs-old-regime-break-even")({
  head: () =>
    generateSeoMeta({
      title: "New vs Old Tax Regime Break-Even Deduction Calculator FY 2026-27",
      description:
        "Find the exact deduction threshold where old and new tax regime outcomes become similar using salary, HRA and deduction inputs.",
      path: "/tools/new-vs-old-regime-break-even",
      keywords: [
        "new vs old regime break even calculator",
        "which tax regime is better calculator",
        "tax regime comparison calculator India",
        "break even deduction for new tax regime",
        "old vs new regime deduction threshold",
        "tax regime switch calculator FY 2026-27",
      ],
    }),
  component: TaxRegimeBreakEvenPage,
})

const faqs = [
  {
    question: "At what deduction amount does old regime save more tax?",
    answer:
      "Break-even means the Section 80C level where old and new regime tax outgo are almost equal for the same income profile.",
  },
  {
    question: "Does HRA make old regime better than new regime?",
    answer:
      "HRA exemption can materially shift the outcome toward old regime depending on rent, city type and salary structure. This tool includes HRA-driven effect in break-even output.",
  },
  {
    question: "Can salaried employees switch tax regime every year?",
    answer:
      "Salaried taxpayers can generally choose regime during filing each year, subject to prevailing rules. Always validate with latest compliance guidance.",
  },
  {
    question: "What is the break-even deduction for 10 lakh income?",
    answer:
      "There is no universal number. Break-even depends on HRA, home-loan interest, section 80D/80CCD and other deduction mix. Use your own data for a reliable value.",
  },
  {
    question: "Is new tax regime always better without deductions?",
    answer:
      "For many profiles, new regime is more efficient at low deduction levels. This page helps identify when old regime starts catching up as deductions increase.",
  },
]

const howToSteps = [
  "Enter annual salary and salary components used for HRA computation.",
  "Add rent and deduction values (80D, 80CCD, home-loan interest, others).",
  "Select city type and financial year.",
  "Check break-even section 80C threshold and tax gap.",
  "Use recommendation as a first-pass regime decision before filing.",
]

function TaxRegimeBreakEvenPage() {
  const [annualSalary, setAnnualSalary] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("income")) ||
        1800000
      )
    }
    return 1800000
  })

  const [basicSalary, setBasicSalary] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("basic")) ||
        900000
      )
    }
    return 900000
  })

  const [hra, setHra] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("hra")) || 240000
      )
    }
    return 240000
  })

  const [rentPaid, setRentPaid] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("rent")) ||
        300000
      )
    }
    return 300000
  })

  const [section80D, setSection80D] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("d80d")) || 25000
      )
    }
    return 25000
  })

  const [section80CCD, setSection80CCD] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("d80ccd")) ||
        50000
      )
    }
    return 50000
  })

  const [homeLoanInterest, setHomeLoanInterest] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("homeInt")) ||
        150000
      )
    }
    return 150000
  })

  const [otherDeductions, setOtherDeductions] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("other")) || 0
      )
    }
    return 0
  })

  const [cityType, setCityType] = useState<"metro" | "non-metro">(() => {
    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("city")
      if (value === "non-metro") return "non-metro"
    }
    return "metro"
  })

  const [financialYear, setFinancialYear] = useState(() => {
    if (typeof window !== "undefined") {
      const fy = new URLSearchParams(window.location.search).get("fy")
      if (fy && AVAILABLE_FYS.includes(fy)) return fy
    }
    return "FY2026-27"
  })

  const result = useMemo(
    () =>
      calculateTaxRegimeBreakEven({
        annualSalary,
        basicSalary,
        hra,
        rentPaid,
        cityType,
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
      section80D,
      section80CCD,
      homeLoanInterest,
      otherDeductions,
      financialYear,
    ]
  )

  const breakEvenGap = Math.abs(
    result.oldTaxAtBreakEven - result.newTaxAtBreakEven
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "New vs Old Regime Break-Even" },
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
          Tax Regime Break-Even Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Find the exact deduction threshold where old and new regime outcomes
          converge using salary, HRA and deduction inputs.
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
          Break-Even Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Annual Salary"
            value={annualSalary}
            onChange={setAnnualSalary}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="Basic Salary"
            value={basicSalary}
            onChange={setBasicSalary}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="HRA Received"
            value={hra}
            onChange={setHra}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="Rent Paid"
            value={rentPaid}
            onChange={setRentPaid}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="Section 80D"
            value={section80D}
            onChange={setSection80D}
            min={0}
            max={100000}
          />
          <CurrencyInput
            label="Section 80CCD(1B)"
            value={section80CCD}
            onChange={setSection80CCD}
            min={0}
            max={50000}
          />
          <CurrencyInput
            label="Home Loan Interest"
            value={homeLoanInterest}
            onChange={setHomeLoanInterest}
            min={0}
            max={2000000}
          />
          <CurrencyInput
            label="Other Deductions"
            value={otherDeductions}
            onChange={setOtherDeductions}
            min={0}
            max={5000000}
          />

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              City Type
            </label>
            <div className="flex flex-wrap gap-2">
              {(["metro", "non-metro"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCityType(type)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    cityType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type === "metro" ? "Metro" : "Non-Metro"}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Financial Year
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_FYS.map((fy) => (
                <button
                  key={fy}
                  onClick={() => setFinancialYear(fy)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    financialYear === fy
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {fy.replace("FY", "FY ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Break-Even Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Section 80C Break-Even
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.breakEvenSection80C)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tax gap near break-even: {formatCompactCurrency(breakEvenGap)}
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Old Tax at 80C = 0"
            value={formatCompactCurrency(result.taxIfSection80CZeroOld)}
            subtitle="Without additional 80C"
          />
          <ResultCard
            label="New Tax at 80C = 0"
            value={formatCompactCurrency(result.taxIfSection80CZeroNew)}
            subtitle="Without additional 80C"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Old Tax at Break-Even"
            value={formatCompactCurrency(result.oldTaxAtBreakEven)}
          />
          <ResultCard
            label="New Tax at Break-Even"
            value={formatCompactCurrency(result.newTaxAtBreakEven)}
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Suggested Regime Around Break-Even"
            value={
              result.recommendedRegimeAtCurrent80C === "old"
                ? "Old Regime"
                : "New Regime"
            }
            subtitle="Based on nearest break-even point"
            variant={
              result.recommendedRegimeAtCurrent80C === "old"
                ? "gain"
                : "default"
            }
          />
          <ResultCard
            label="Break-Even Gap"
            value={formatCompactCurrency(breakEvenGap)}
            subtitle="Absolute difference between regimes"
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            income: annualSalary,
            basic: basicSalary,
            hra,
            rent: rentPaid,
            d80d: section80D,
            d80ccd: section80CCD,
            homeInt: homeLoanInterest,
            other: otherDeductions,
            city: cityType,
            fy: financialYear,
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
            New vs old regime break-even analysis for salaried users
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
              This new vs old regime break even calculator is intended for users
              searching "which tax regime is better calculator" and "tax regime
              comparison calculator India" style queries.
            </p>
            <p>
              Instead of giving only a side-by-side number, it estimates the
              deduction threshold where old and new outcomes become nearly
              equal. That helps with practical tax declaration planning.
            </p>
            <p>
              Use this as a strategy tool and verify final return-level numbers
              with complete payroll and investment records.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Tax Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Explore more detailed tax analysis calculators.
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
              to="/tools/section-87a-marginal-relief-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Section 87A Marginal Relief Calculator
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
            name: "New vs Old Regime Break-Even Finder",
            url: "https://financechk.com/tools/new-vs-old-regime-break-even",
            description:
              "Find the section 80C break-even threshold where old and new regimes converge.",

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
