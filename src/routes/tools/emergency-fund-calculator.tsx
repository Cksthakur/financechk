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
import { calculateEmergencyFund } from "@/lib/calculators/emergency-fund"
import { formatCompactCurrency, formatPercent } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/emergency-fund-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "Emergency Fund Calculator India 2025 | How Much & Where to Invest",
      description:
        "Calculate ideal emergency fund based on expenses, job profile and dependants. Compare parking options like savings account, liquid fund, and short-term FD.",
      path: "/tools/emergency-fund-calculator",
      keywords: [
        "emergency fund calculator India",
        "how much emergency fund should I have India",
        "emergency corpus calculator India",
        "where to keep emergency fund in India",
        "liquid mutual fund vs savings account",
      ],
    }),
  component: EmergencyFundCalculatorPage,
})

const faqs = [
  {
    question: "How many months of expenses should emergency fund cover?",
    answer:
      "A practical range is 3 to 12 months depending on employment stability, dependants, and insurance coverage. This tool personalizes that range.",
  },
  {
    question: "Is liquid mutual fund suitable for emergency corpus?",
    answer:
      "Liquid funds are commonly used for emergency parking due to relatively quick access and better return potential than savings accounts, with moderate risk.",
  },
  {
    question: "Is FD interest on emergency corpus taxable?",
    answer:
      "Yes, FD interest is generally taxable per your slab. This calculator shows indicative post-tax return comparison across parking options.",
  },
  {
    question: "Should freelancers keep larger emergency funds?",
    answer:
      "Usually yes, because income variability is higher. Freelancers and self-employed households often require a higher buffer than salaried profiles.",
  },
  {
    question: "Emergency fund vs contingency fund - what is difference?",
    answer:
      "Emergency fund is typically for income disruption or essential unexpected expenses. Contingency buckets may include broader irregular planned events.",
  },
]

function EmergencyFundCalculatorPage() {
  const [monthlyEssentialExpenses, setMonthlyEssentialExpenses] =
    useState(50000)
  const [employmentType, setEmploymentType] = useState<
    "salaried" | "self-employed" | "freelancer"
  >("salaried")
  const [dependants, setDependants] = useState(1)
  const [jobStability, setJobStability] = useState<"low" | "medium" | "high">(
    "medium"
  )
  const [hasHealthInsurance, setHasHealthInsurance] = useState(true)
  const [hasLifeInsurance, setHasLifeInsurance] = useState(true)
  const [targetBuildMonths, setTargetBuildMonths] = useState(12)
  const [taxRatePercent, setTaxRatePercent] = useState(20)

  const result = useMemo(
    () =>
      calculateEmergencyFund({
        monthlyEssentialExpenses,
        employmentType,
        dependants,
        jobStability,
        hasHealthInsurance,
        hasLifeInsurance,
        targetBuildMonths,
        taxRatePercent,
      }),
    [
      monthlyEssentialExpenses,
      employmentType,
      dependants,
      jobStability,
      hasHealthInsurance,
      hasLifeInsurance,
      targetBuildMonths,
      taxRatePercent,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Emergency Fund Calculator" },
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
          Emergency Fund Calculator - Target Amount + Best Parking Option
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Estimate ideal emergency corpus from monthly essentials and profile
          risk. Compare post-tax return, liquidity, and risk across savings
          account, liquid mutual fund, and short-term FD.
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
          Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Monthly Essential Expenses"
            value={monthlyEssentialExpenses}
            onChange={setMonthlyEssentialExpenses}
            min={0}
            max={2000000}
          />

          <SliderField
            label="Dependants"
            value={dependants}
            onChange={setDependants}
            min={0}
            max={8}
            step={1}
            formatValue={(v) => `${v}`}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Employment Type
            </label>
            <div className="flex flex-wrap gap-2">
              {(["salaried", "self-employed", "freelancer"] as const).map(
                (v) => (
                  <button
                    key={v}
                    onClick={() => setEmploymentType(v)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      employmentType === v
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {v}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Job Stability
            </label>
            <div className="flex flex-wrap gap-2">
              {(["low", "medium", "high"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setJobStability(v)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    jobStability === v
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <SliderField
            label="Target Build Timeline"
            value={targetBuildMonths}
            onChange={setTargetBuildMonths}
            min={3}
            max={36}
            step={1}
            formatValue={(v) => `${v} months`}
          />

          <SliderField
            label="Tax Rate for Post-tax Return"
            value={taxRatePercent}
            onChange={setTaxRatePercent}
            min={0}
            max={30}
            step={1}
            formatValue={(v) => `${v}%`}
          />

          <div className="flex flex-wrap gap-5 sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={hasHealthInsurance}
                onChange={(e) => setHasHealthInsurance(e.target.checked)}
              />
              Health insurance available
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={hasLifeInsurance}
                onChange={(e) => setHasLifeInsurance(e.target.checked)}
              />
              Life insurance available
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Emergency Corpus Plan
        </p>

        <ResultGrid cols={3}>
          <ResultCard
            label="Recommended Months"
            value={`${result.recommendedMonths}`}
            subtitle="Expense cover target"
          />
          <ResultCard
            label="Target Emergency Fund"
            value={formatCompactCurrency(result.targetAmount)}
          />
          <ResultCard
            label="Monthly Savings Needed"
            value={formatCompactCurrency(result.monthlySavingsRequired)}
            subtitle={`To build in ${targetBuildMonths} months`}
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Where to Park Emergency Fund
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Option</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Pre-tax Return
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Post-tax Return
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Liquidity
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.parkingOptions.map((row) => (
                  <tr key={row.key} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatPercent(row.expectedPreTaxReturn, 2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {formatPercent(row.expectedPostTaxReturn, 2)}
                    </td>
                    <td className="px-4 py-3 text-center">{row.liquidity}</td>
                    <td className="px-4 py-3 text-center">{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            expense: monthlyEssentialExpenses,
            emp: employmentType,
            dep: dependants,
            stability: jobStability,
            build: targetBuildMonths,
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
            How to build an emergency fund without guessing
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
              An emergency fund is not a random "six months" number. The right
              corpus depends on your income stability, dependants, insurance
              cover, and how quickly your household can cut discretionary
              spending during a disruption. That is why this calculator adjusts
              target months using multiple profile factors.
            </p>
            <p>
              Start with essential monthly expenses only: rent, EMIs, groceries,
              utilities, school fees, and insurance premiums. Do not include
              lifestyle spending. Then choose employment and job-stability
              profile honestly. Freelancers, sales-heavy income roles, and
              single-income families usually need a larger cushion than stable
              dual-income households.
            </p>
            <p>
              Parking choice matters as much as target size. Emergency money
              must be accessible quickly, with predictable downside. A common
              approach is layered parking: one part in savings account for
              immediate use, one part in liquid fund for short-notice needs, and
              one part in short FD for slightly better post-tax carry.
            </p>
            <p>
              Revisit the corpus every quarter or after major changes in rent,
              dependants, job, insurance, or EMI load. Emergency planning works
              best as a living system, not a one-time setup.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Healthy emergency-fund framework
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Cover essentials first, not aspirational spending.</li>
                <li>
                  Use layered liquidity instead of single-instrument parking.
                </li>
                <li>Separate emergency corpus from long-term investments.</li>
                <li>Increase target buffer as family obligations rise.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Mistakes to avoid
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Using credit cards as a substitute for emergency corpus.
                </li>
                <li>Keeping all emergency money in volatile assets.</li>
                <li>Ignoring tax impact while comparing parking returns.</li>
                <li>Not updating the target after EMI or income changes.</li>
              </ul>
            </div>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Planning Tools
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/compound-interest-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Compound Interest Calculator
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
            "@type": "SoftwareApplication",
            name: "Emergency Fund Calculator India",
            description:
              "Estimate emergency corpus size and compare parking options by liquidity and post-tax return.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/emergency-fund-calculator",
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
