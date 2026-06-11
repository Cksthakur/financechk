import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateEducationLoan } from "@/lib/calculators/education-loan"
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/education-loan-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Education Loan EMI Calculator with Section 80E Tax Benefit",
      description:
        "Calculate education loan EMI, moratorium impact, and Section 80E tax deduction for up to 8 years. Estimate effective net interest cost after tax saving.",
      path: "/tools/education-loan-calculator",
      keywords: [
        "education loan calculator India",
        "education loan EMI calculator",
        "section 80E tax benefit calculator",
        "education loan moratorium calculator",
        "education loan interest deduction calculator",
      ],
    }),
  component: EducationLoanCalculatorPage,
})

const faqs = [
  {
    question: "Who can claim Section 80E deduction?",
    answer:
      "The borrower who is repaying eligible education-loan interest can claim deduction under 80E, subject to documentation and applicable tax-return conditions.",
  },
  {
    question: "Is there a monetary cap on 80E deduction?",
    answer:
      "There is no fixed upper monetary ceiling in law context for eligible interest, but deduction applies to interest component and within allowed claim period.",
  },
  {
    question: "For how many years can 80E be claimed?",
    answer:
      "Typically up to 8 assessment years from the year repayment starts, or until interest is fully paid, whichever is earlier.",
  },
  {
    question: "Does principal repayment qualify under 80C?",
    answer:
      "Education-loan principal generally does not get a dedicated 80C benefit like home-loan principal. This calculator focuses 80E treatment on interest only.",
  },
  {
    question: "How does moratorium affect loan cost?",
    answer:
      "During moratorium, interest may accrue and increase effective principal at repayment start, raising EMI and total interest outgo.",
  },
]

function EducationLoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(1500000)
  const [annualInterestRate, setAnnualInterestRate] = useState(10)
  const [moratoriumMonths, setMoratoriumMonths] = useState(24)
  const [repaymentTenureYears, setRepaymentTenureYears] = useState(10)
  const [annualIncome, setAnnualIncome] = useState(1200000)
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("old")

  const result = useMemo(
    () =>
      calculateEducationLoan({
        loanAmount,
        annualInterestRate,
        moratoriumMonths,
        repaymentTenureYears,
        annualIncome,
        taxRegime,
      }),
    [
      loanAmount,
      annualInterestRate,
      moratoriumMonths,
      repaymentTenureYears,
      annualIncome,
      taxRegime,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Education Loan Calculator" },
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
          Education Loan Calculator - EMI + Section 80E Interest Deduction
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Estimate EMI after moratorium, total interest outgo, and tax savings
          from Section 80E to understand your effective education-loan cost.
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
          <CurrencyInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={0}
            max={50000000}
          />

          <CurrencyInput
            label="Annual Income"
            value={annualIncome}
            onChange={setAnnualIncome}
            min={0}
            max={20000000}
          />

          <SliderField
            label="Interest Rate"
            value={annualInterestRate}
            onChange={setAnnualInterestRate}
            min={6}
            max={18}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Moratorium Period"
            value={moratoriumMonths}
            onChange={setMoratoriumMonths}
            min={0}
            max={60}
            step={1}
            formatValue={(v) => `${v} months`}
          />

          <SliderField
            label="Repayment Tenure"
            value={repaymentTenureYears}
            onChange={setRepaymentTenureYears}
            min={1}
            max={20}
            step={1}
            formatValue={(v) => `${v} years`}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Tax Regime
            </label>
            <div className="flex gap-2">
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
                  {regime === "old" ? "Old" : "New"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Education Loan Projection
        </p>

        <ResultGrid cols={4}>
          <ResultCard
            label="EMI"
            value={formatCompactCurrency(result.emi)}
            subtitle="Post-moratorium"
          />
          <ResultCard
            label="Principal at Repayment Start"
            value={formatCompactCurrency(result.principalAtRepaymentStart)}
            subtitle="After moratorium accrual"
          />
          <ResultCard
            label="Total Interest"
            value={formatCompactCurrency(result.totalInterestPaid)}
          />
          <ResultCard
            label="Total Payment"
            value={formatCompactCurrency(result.totalPayment)}
          />
        </ResultGrid>

        <ResultGrid cols={3} className="mt-3">
          <ResultCard
            label="80E Eligible Interest"
            value={formatCompactCurrency(result.totalSection80eDeduction)}
            subtitle="Up to 8 years"
          />
          <ResultCard
            label="Estimated Tax Saved"
            value={formatCompactCurrency(result.totalTaxSaved)}
            variant="gain"
          />
          <ResultCard
            label="Effective Net Interest Rate"
            value={formatPercent(result.effectiveNetInterestRate, 2)}
            subtitle="After tax saving"
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Year-wise Amortization + 80E View
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 text-right font-medium">Interest</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Principal
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    80E Interest
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Tax Saved
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">
                      Year {row.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.interestPaid)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.principalPaid)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {formatCurrency(row.section80eEligibleInterest)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fc-gain-text">
                      {formatCurrency(row.taxSaved)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.closingBalance)}
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
            loan: loanAmount,
            rate: annualInterestRate,
            moratorium: moratoriumMonths,
            years: repaymentTenureYears,
            income: annualIncome,
            regime: taxRegime,
          }}
        />
      </div>

      <div className="mt-14">
        <section className="mb-12">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "36px",
              letterSpacing: "normal",
              lineHeight: 1.13,
            }}
          >
            Education loan planning: focus on cash flow first, tax benefit
            second
          </h2>
          <div
            className="mt-5 flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              Education loans are often evaluated only on EMI. In practice, the
              moratorium period and accrued interest can materially change the
              starting principal at repayment time. This is why two loans with
              similar rates may still feel very different once repayment begins.
            </p>
            <p>
              Use this calculator to model the complete path: loan sanction,
              moratorium accrual, repayment schedule, and Section 80E interest
              deduction. The result is a more realistic view of effective net
              borrowing cost and household cash-flow pressure.
            </p>
            <p>
              Section 80E can improve affordability, but it should not be the
              core reason to borrow more. A healthy approach is to set an EMI
              that remains manageable even if income growth is delayed. Then
              treat tax saving as an efficiency bonus.
            </p>
            <p>
              Before finalizing, compare at least three scenarios: conservative,
              base, and optimistic. This protects you from underestimating
              repayment burden in the first 2-3 years after course completion.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Inputs that matter most
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Moratorium length and capitalization treatment.</li>
                <li>
                  Realistic starting income post-study, not ideal salary
                  projections.
                </li>
                <li>Repayment tenure flexibility and prepayment intent.</li>
                <li>Tax regime context for 80E claim usability.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Common mistakes to avoid
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Assuming moratorium means zero long-term interest impact.
                </li>
                <li>
                  Sizing loan by eligibility alone instead of repayment comfort.
                </li>
                <li>Ignoring annual documentation needed for 80E claims.</li>
                <li>
                  Skipping stress testing for delayed placements or career
                  transition.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Tools
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/advance-tax-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Advance Tax Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/tax-regime-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Tax Regime Comparison
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
            name: "Education Loan EMI and 80E Calculator",
            description:
              "Calculate education-loan EMI, moratorium impact and Section 80E tax benefit.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/education-loan-calculator",
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
