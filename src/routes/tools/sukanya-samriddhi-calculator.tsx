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
import { calculateSsy } from "@/lib/calculators/ssy"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/sukanya-samriddhi-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "Sukanya Samriddhi Yojana Calculator 2025 | SSY Returns & Maturity Amount",
      description:
        "Calculate SSY maturity at 8.2% with 15-year contribution and maturity at age 21. Includes year-wise table, total interest, and annual 80C tax benefit estimate.",
      path: "/tools/sukanya-samriddhi-calculator",
      keywords: [
        "sukanya samriddhi yojana calculator",
        "SSY calculator India 2025",
        "SSY returns calculator 8.2%",
        "sukanya samriddhi maturity calculator",
        "SSY 80C tax benefit calculator",
      ],
    }),
  component: SukanyaSamriddhiCalculatorPage,
})

const faqs = [
  {
    question: "What is the current SSY interest rate?",
    answer:
      "This calculator is prefilled at 8.2% based on the provided dataset. Rates are notified periodically, so verify the latest official rate while investing.",
  },
  {
    question: "Does SSY mature at age 18 or 21?",
    answer:
      "The account generally runs to maturity at age 21, with contribution period up to 15 years from opening under standard scheme rules.",
  },
  {
    question: "What is the maximum SSY yearly deposit?",
    answer:
      "Annual contribution is capped at Rs 1,50,000. This calculator automatically caps excess input for realistic projection.",
  },
  {
    question: "Is SSY interest taxable?",
    answer:
      "SSY is typically treated as a tax-efficient small-savings instrument. Always validate latest tax treatment and compliance details before filing.",
  },
  {
    question: "Can I deposit for 15 years and earn till 21?",
    answer:
      "Yes, projection here follows 15-year contribution and continued interest accrual up to maturity age 21.",
  },
]

function SukanyaSamriddhiCalculatorPage() {
  const [daughterAgeYears, setDaughterAgeYears] = useState(3)
  const [annualDeposit, setAnnualDeposit] = useState(150000)
  const [annualInterestRate, setAnnualInterestRate] = useState(8.2)
  const [taxRatePercent, setTaxRatePercent] = useState(20)

  const result = useMemo(
    () =>
      calculateSsy({
        daughterAgeYears,
        annualDeposit,
        annualInterestRate,
        taxRatePercent,
      }),
    [daughterAgeYears, annualDeposit, annualInterestRate, taxRatePercent]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Sukanya Samriddhi Calculator" },
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
          Sukanya Samriddhi Yojana Calculator - Maturity Amount & Returns at
          8.2%
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Plan SSY corpus for your daughter with age-based maturity, capped
          yearly deposit, interest compounding, and annual 80C deduction
          visibility.
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
          SSY Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <SliderField
            label="Daughter Age"
            value={daughterAgeYears}
            onChange={setDaughterAgeYears}
            min={0}
            max={20}
            step={1}
            formatValue={(v) => `${v} years`}
          />

          <CurrencyInput
            label="Annual Deposit"
            value={annualDeposit}
            onChange={setAnnualDeposit}
            min={0}
            max={300000}
          />

          <SliderField
            label="SSY Interest Rate"
            value={annualInterestRate}
            onChange={setAnnualInterestRate}
            min={5}
            max={10}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Tax Rate for 80C View"
            value={taxRatePercent}
            onChange={setTaxRatePercent}
            min={0}
            max={30}
            step={1}
            formatValue={(v) => `${v}%`}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          SSY Projection
        </p>

        <ResultGrid cols={4}>
          <ResultCard
            label="Maturity Amount"
            value={formatCompactCurrency(result.maturityAmount)}
            subtitle={formatCurrency(result.maturityAmount)}
          />
          <ResultCard
            label="Total Deposits"
            value={formatCompactCurrency(result.totalDeposits)}
          />
          <ResultCard
            label="Total Interest"
            value={formatCompactCurrency(result.totalInterest)}
            variant="gain"
          />
          <ResultCard
            label="Deposit Window"
            value={`${result.depositYears} years`}
            subtitle="Contribute up to 15 years"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Annual 80C Deduction"
            value={formatCompactCurrency(result.annual80cDeduction)}
          />
          <ResultCard
            label="Annual Tax Saved"
            value={formatCompactCurrency(result.annualTaxSaved)}
            subtitle="Indicative by slab"
            variant="gain"
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Year-wise SSY Table
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 text-right font-medium">Age</th>
                  <th className="px-4 py-3 text-right font-medium">Deposit</th>
                  <th className="px-4 py-3 text-right font-medium">Interest</th>
                  <th className="px-4 py-3 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.schedule.map((row) => (
                  <tr key={row.yearNumber} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.yearNumber}
                    </td>
                    <td className="px-4 py-3 text-right">{row.daughterAge}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.deposit)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fc-gain-text">
                      {formatCurrency(row.interest)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
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
            age: daughterAgeYears,
            deposit: annualDeposit,
            rate: annualInterestRate,
            tax: taxRatePercent,
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
            SSY planning guide: contribution discipline matters more than timing
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
              Sukanya Samriddhi Yojana is most effective when treated as a
              long-term contribution habit, not as a one-time lump-sum plan. The
              key drivers of maturity outcome are deposit consistency, years
              remaining to age-21 maturity, and declared interest-rate context.
            </p>
            <p>
              This calculator helps you model those moving parts with an annual
              schedule so you can see how each year contributes to final corpus.
              The 15-year contribution window and continued accrual till
              maturity are reflected to support practical goal planning for
              education and early adulthood milestones.
            </p>
            <p>
              For better planning, combine SSY with other household goals
              instead of evaluating it in isolation. If your family also needs
              emergency corpus and retirement investing, allocate monthly
              surplus across all goals with liquidity in mind, then commit to
              sustainable SSY deposits.
            </p>
            <p>
              Since interest rates can be revised periodically, review
              projection assumptions annually and keep expectation bands rather
              than a single fixed maturity figure.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Healthy SSY strategy
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Set an annual deposit you can maintain for full contribution
                  window.
                </li>
                <li>
                  Use yearly review date to update contribution and
                  documentation.
                </li>
                <li>
                  Track 80C allocation so SSY fits within total deduction
                  strategy.
                </li>
                <li>Maintain liquidity separately for near-term expenses.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Mistakes that reduce long-term outcome
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Irregular deposits despite having yearly capacity.</li>
                <li>Overcommitting to SSY and hurting emergency liquidity.</li>
                <li>
                  Ignoring annual deduction planning across all 80C instruments.
                </li>
                <li>
                  Not revisiting projections after rate or income changes.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Savings Tools
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/ppf-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              PPF Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/epf-vpf-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              EPF / VPF Calculator
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
            name: "Sukanya Samriddhi Yojana Calculator",
            description:
              "Calculate SSY maturity amount with yearly deposits, interest and tax-benefit estimate.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/sukanya-samriddhi-calculator",
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
