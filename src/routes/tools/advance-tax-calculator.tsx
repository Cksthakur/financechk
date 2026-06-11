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
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/advance-tax-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Advance Tax Calculator India | Quarterly Due Amount",
      description:
        "Calculate quarterly advance tax installments with 15%, 45%, 75% and 100% due schedule. Includes shortfall and estimated interest impact.",
      path: "/tools/advance-tax-calculator",
      keywords: [
        "advance tax calculator",
        "advance tax calculator India",
        "quarterly advance tax calculator",
        "income tax advance payment calculator",
        "advance tax due dates calculator",
      ],
    }),
  component: AdvanceTaxCalculatorPage,
})

const dueSchedule = [
  { label: "June 15", requiredPercent: 15 },
  { label: "September 15", requiredPercent: 45 },
  { label: "December 15", requiredPercent: 75 },
  { label: "March 15", requiredPercent: 100 },
]

const faqs = [
  {
    question: "Who needs to pay advance tax in India?",
    answer:
      "Taxpayers with significant tax payable after TDS/TCS adjustment generally need to pay advance tax. Use this tool as a planning estimate and verify threshold applicability during filing.",
  },
  {
    question: "What are the quarterly advance tax due percentages?",
    answer:
      "This calculator uses the standard cumulative schedule of 15%, 45%, 75% and 100% for the four due dates in the financial year.",
  },
  {
    question: "How is shortfall interest estimated?",
    answer:
      "A simplified monthly interest estimate is shown on installment shortfall to help planning. Final interest computation in return filing can differ based on actual dates and rules.",
  },
  {
    question: "Can salaried employees also need advance tax?",
    answer:
      "Yes, if tax remains payable due to side income such as capital gains, freelance income, rent or interest not fully covered by TDS.",
  },
  {
    question: "Does this replace final ITR computation?",
    answer:
      "No. This is an interim planning tool for cash-flow and installment discipline. Final payable tax and interest should be validated in your ITR workflow.",
  },
]

const howToSteps = [
  "Enter estimated annual tax liability before advance tax adjustment.",
  "Enter tax already paid (TDS/TCS + prior installments).",
  "Review due amount at each cumulative quarter milestone.",
  "Check projected shortfall and simplified interest estimate.",
  "Pay planned installment before due date to reduce interest risk.",
]

function AdvanceTaxCalculatorPage() {
  const [estimatedTaxLiability, setEstimatedTaxLiability] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("tax")) || 300000
      )
    }
    return 300000
  })

  const [taxAlreadyPaid, setTaxAlreadyPaid] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("paid")) || 0
      )
    }
    return 0
  })

  const [quarterPaid, setQuarterPaid] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("qPaid")) || 0
      )
    }
    return 0
  })

  const result = useMemo(() => {
    const liability = Math.max(0, estimatedTaxLiability)
    const paid = Math.max(0, taxAlreadyPaid + quarterPaid)
    const netPayable = Math.max(0, liability - paid)

    const rows = dueSchedule.map((row, idx) => {
      const cumulativeRequired = (liability * row.requiredPercent) / 100
      const shortfall = Math.max(0, cumulativeRequired - paid)

      const interestMonths = idx === 0 ? 3 : idx === 1 ? 3 : idx === 2 ? 3 : 1
      const estimatedInterest = shortfall * 0.01 * interestMonths

      return {
        ...row,
        cumulativeRequired,
        shortfall,
        estimatedInterest,
      }
    })

    const totalEstimatedInterest = rows.reduce(
      (sum, row) => sum + row.estimatedInterest,
      0
    )

    return {
      liability,
      paid,
      netPayable,
      rows,
      totalEstimatedInterest,
    }
  }, [estimatedTaxLiability, taxAlreadyPaid, quarterPaid])

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Advance Tax Calculator" },
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
          Advance Tax Calculator - Quarterly Due Amount Planner
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Use this advance tax calculator India taxpayers use to estimate
          quarterly installments, shortfall and indicative interest impact.
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
            label="Estimated Annual Tax Liability"
            value={estimatedTaxLiability}
            onChange={setEstimatedTaxLiability}
            min={0}
            max={50000000}
          />
          <CurrencyInput
            label="Tax Already Paid (TDS/TCS + installments)"
            value={taxAlreadyPaid}
            onChange={setTaxAlreadyPaid}
            min={0}
            max={50000000}
          />
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Additional Installment Paid (Current Quarter)"
              value={quarterPaid}
              onChange={setQuarterPaid}
              min={0}
              max={50000000}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Advance Tax Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Net Advance Tax Pending
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.netPayable)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.netPayable)} pending after paid taxes
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Estimated Liability"
            value={formatCompactCurrency(result.liability)}
          />
          <ResultCard
            label="Total Paid"
            value={formatCompactCurrency(result.paid)}
          />
          <ResultCard
            label="Est. Interest on Shortfall"
            value={formatCompactCurrency(result.totalEstimatedInterest)}
            subtitle="Simplified monthly estimate"
            variant="loss"
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Due Date</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Cumulative %
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Required Tax
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Shortfall
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Est. Interest
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {row.requiredPercent}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.cumulativeRequired)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fc-loss-text">
                      {formatCurrency(row.shortfall)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.estimatedInterest)}
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
            tax: estimatedTaxLiability,
            paid: taxAlreadyPaid,
            qPaid: quarterPaid,
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
            How this quarterly advance tax calculator works
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
            Due schedule and planning logic used
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <ul className="ml-6 list-disc space-y-2">
              <li>June 15: 15% cumulative tax payment</li>
              <li>September 15: 45% cumulative tax payment</li>
              <li>December 15: 75% cumulative tax payment</li>
              <li>March 15: 100% cumulative tax payment</li>
            </ul>
            <p>
              Interest estimate shown here is simplified for planning and not a
              substitute for return-filing final computation.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Tax Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Continue with connected tax planning calculators.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/tax-regime-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Tax Regime Comparison
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
            "@type": "SoftwareApplication",
            name: "Advance Tax Calculator India",
            description:
              "Estimate quarterly advance tax due, shortfall and indicative interest impact for Indian taxpayers.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/advance-tax-calculator",

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
