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
import { AmortizationTable } from "@/components/finance/amortization-table"
import { calculatePersonalLoanPrepayment } from "@/lib/calculators/personal-loan-prepayment"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/tools/personal-loan-prepayment-calculator"
)({
  head: () =>
    generateSeoMeta({
      title: "Personal Loan Prepayment Calculator - Interest & Tenure Saved",
      description:
        "Check how much interest and time you save by prepaying your personal loan. Compare normal EMI vs monthly and one-time prepayment strategies.",
      path: "/tools/personal-loan-prepayment-calculator",
    }),
  component: PersonalLoanPrepaymentCalculator,
})

const faqs = [
  {
    question: "Is prepaying a personal loan always good?",
    answer:
      "Generally yes for high-interest personal loans, because each prepayment directly reduces outstanding principal and future interest. But always check prepayment penalty and compare with alternate use of funds.",
  },
  {
    question: "Should I prepay monthly or as a lump sum?",
    answer:
      "Monthly prepayment lowers interest consistently. Lump sum prepayment works best when done early in the tenure. A blended strategy often gives practical flexibility.",
  },
  {
    question: "Does prepayment reduce EMI or tenure?",
    answer:
      "Most lenders let you choose one. This calculator assumes EMI stays constant and tenure reduces, which usually maximizes interest savings.",
  },
]

const howToSteps = [
  "Enter your outstanding personal loan amount and current interest rate.",
  "Set remaining tenure in years and months.",
  "Add monthly extra prepayment if you can spare recurring cash.",
  "Optionally add one-time prepayment and the month in which you plan to pay it.",
  "Compare new tenure and interest saved against regular repayment.",
]

function PersonalLoanPrepaymentCalculator() {
  const [principalAmount, setPrincipalAmount] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("principal")) ||
        800000
      )
    }
    return 800000
  })

  const [interestRate, setInterestRate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 14
      )
    }
    return 14
  })

  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("years")) || 5
      )
    }
    return 5
  })

  const [tenureMonths, setTenureMonths] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("months")) || 0
      )
    }
    return 0
  })

  const [extraMonthlyPrepayment, setExtraMonthlyPrepayment] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("extra")) || 5000
      )
    }
    return 5000
  })

  const [oneTimePrepayment, setOneTimePrepayment] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("lump")) ||
        100000
      )
    }
    return 100000
  })

  const [oneTimePrepaymentMonth, setOneTimePrepaymentMonth] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("lumpMonth")) ||
        12
      )
    }
    return 12
  })

  const result = useMemo(
    () =>
      calculatePersonalLoanPrepayment({
        principalAmount,
        interestRate,
        tenureYears,
        tenureMonths,
        extraMonthlyPrepayment,
        oneTimePrepayment,
        oneTimePrepaymentMonth,
      }),
    [
      principalAmount,
      interestRate,
      tenureYears,
      tenureMonths,
      extraMonthlyPrepayment,
      oneTimePrepayment,
      oneTimePrepaymentMonth,
    ]
  )

  const totalTenureMonths = tenureYears * 12 + tenureMonths

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Personal Loan Prepayment Calculator" },
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
          Personal Loan Prepayment Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Find out exactly how much interest and tenure you can save with
          monthly and one-time prepayments on your personal loan.
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
          Loan Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Outstanding Loan Amount"
              value={principalAmount}
              onChange={setPrincipalAmount}
              min={0}
              max={50000000}
            />
          </div>

          <SliderField
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={8}
            max={36}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <SliderField
                label="Remaining Tenure (Years)"
                value={tenureYears}
                onChange={setTenureYears}
                min={0}
                max={10}
                step={1}
                formatValue={(v) => `${v} Yr`}
              />
            </div>
            <div className="flex-1">
              <SliderField
                label="(Months)"
                value={tenureMonths}
                onChange={setTenureMonths}
                min={0}
                max={11}
                step={1}
                formatValue={(v) => `${v} Mo`}
              />
            </div>
          </div>

          <div
            className="pt-3 sm:col-span-2"
            style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
          >
            <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Prepayment Plan
            </p>
          </div>

          <CurrencyInput
            label="Extra Monthly Prepayment"
            value={extraMonthlyPrepayment}
            onChange={setExtraMonthlyPrepayment}
            min={0}
            max={500000}
          />

          <CurrencyInput
            label="One-time Prepayment"
            value={oneTimePrepayment}
            onChange={setOneTimePrepayment}
            min={0}
            max={50000000}
          />

          <SliderField
            label="One-time Prepayment Month"
            value={oneTimePrepaymentMonth}
            onChange={setOneTimePrepaymentMonth}
            min={1}
            max={Math.max(1, totalTenureMonths)}
            step={1}
            formatValue={(v) => `Month ${v.toFixed(0)}`}
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Prepayment Impact
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total Interest Saved
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.interestSaved)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.interestSaved)}
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Current EMI"
            value={formatCompactCurrency(result.emi)}
            subtitle="Without prepayment"
          />
          <ResultCard
            label="Tenure Saved"
            value={`${Math.floor(result.tenureSavedMonths / 12)}y ${result.tenureSavedMonths % 12}m`}
            subtitle="Reduction in loan duration"
            variant="gain"
          />
          <ResultCard
            label="Total Prepayment"
            value={formatCompactCurrency(result.totalPrepaymentAmount)}
            subtitle="Monthly + one-time prepayment"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Interest (Regular Plan)"
            value={formatCompactCurrency(result.baseTotalInterest)}
            subtitle="If you continue current repayment"
            variant="loss"
          />
          <ResultCard
            label="Interest (With Prepayment)"
            value={formatCompactCurrency(result.prepaymentTotalInterest)}
            subtitle="After applying prepayment strategy"
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
            Principal vs Interest Paid Over Time
          </p>
          <PayoffChart
            data={(() => {
              const yearlyData = []
              let cumPrincipal = 0
              let cumInterest = 0
              for (const row of result.schedule) {
                cumPrincipal += row.principal
                cumInterest += row.interest
                if (
                  row.month % 12 === 0 ||
                  row.month === result.schedule.length
                ) {
                  yearlyData.push({
                    year: row.year,
                    baseAmount: cumPrincipal,
                    growthAmount: cumInterest,
                  })
                }
              }
              return yearlyData
            })()}
            baseLabel="Principal Paid"
            growthLabel="Interest Paid"
          />
        </div>

        <div className="mt-8">
          <AmortizationTable schedule={result.schedule} />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            principal: principalAmount,
            rate: interestRate,
            years: tenureYears,
            months: tenureMonths,
            extra: extraMonthlyPrepayment,
            lump: oneTimePrepayment,
            lumpMonth: oneTimePrepaymentMonth,
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
            Why prepayment matters more in personal loans
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
              Personal loans usually carry much higher interest rates than home
              loans. That makes every extra rupee of principal repayment highly
              valuable, especially in early years.
            </p>
            <p>
              If your loan has no or low prepayment charges, disciplined monthly
              prepayment can cut years off your tenure and save significant
              interest outflow.
            </p>
            <p>
              Always maintain emergency liquidity first. Prepay aggressively
              only after you have a stable cash buffer.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Loan Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Check transfer options and compare with broader debt-planning tools
            before finalizing your strategy.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/personal-loan-balance-transfer-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Personal Loan Balance Transfer Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/prepay-vs-invest"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Prepay vs Invest Calculator
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
            name: "Personal Loan Prepayment Calculator",
            url: "https://financechk.com/tools/personal-loan-prepayment-calculator",
            description:
              "Estimate interest and tenure savings from personal loan prepayment.",
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
