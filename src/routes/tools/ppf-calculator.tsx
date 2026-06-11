import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import {
  IconCalculator,
  IconChevronRight,
  IconShieldCheck,
} from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { SliderField } from "@/components/finance/slider-field"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { ShareResult } from "@/components/finance/share-result"
import { calculatePPF } from "@/lib/calculators/ppf"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/ppf-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "PPF Calculator India - Public Provident Fund Returns & Interest Calculator",
      description:
        "Free online PPF calculator for India. Calculate Public Provident Fund maturity amount, interest earned, and tax benefits. PPF offers EEE tax status - completely tax-free interest, contributions, and maturity. Plan your long-term savings.",
      path: "/tools/ppf-calculator",
    }),
  component: PPFCalculator,
})

const faqs = [
  {
    question: "What is Public Provident Fund (PPF)?",
    answer:
      "PPF is a government-backed long-term savings scheme with a 15-year lock-in period offering guaranteed returns and complete tax benefits. Established in 1968, it's one of India's most popular tax-saving investments with EEE (Exempt-Exempt-Exempt) status - contributions qualify for tax deduction under 80C, interest earned is tax-free, and maturity proceeds are completely tax-free.",
  },
  {
    question: "What is the current PPF interest rate for 2025-26?",
    answer:
      "The PPF interest rate for FY 2025-26 is 7.1% p.a. (effective from January 2025). This rate is reviewed quarterly by the Government of India and is currently at its lowest historically. Despite lower rates, PPF remains attractive due to its tax-free returns and sovereign guarantee. For comparison, the EPF rate is 8.25% but only for contributions above ₹2,500/month in mandatory EPF.",
  },
  {
    question: "How is PPF interest calculated?",
    answer:
      "PPF uses annual compound interest calculated on the lowest balance between the 5th and last day of each month. Interest is credited to your account at the end of each financial year. For example, if you invest ₹1 lakh on April 1st, you get full year interest. If you invest on April 30th, you only get interest for 1 month. The formula: Interest = (Lowest balance between 5th-30th of month) × (Rate/12) for each month, summed annually.",
  },
  {
    question: "Can I extend my PPF account after 15 years?",
    answer:
      "Yes, you can extend your PPF account in blocks of 5 years after maturity. You can make partial withdrawals (up to 60% of the balance at the time of extension) and continue investing. Extended accounts continue to earn interest at the prevailing rate. This is beneficial if you want to keep the tax-free returns flowing. You can extend multiple times - there's no limit on extensions.",
  },
  {
    question: "What is the maximum and minimum PPF contribution limit?",
    answer:
      "Minimum: ₹500 per financial year (can be invested in single or multiple installments). Maximum: ₹1.5 lakhs per financial year (investments above this don't earn interest). You can make unlimited transactions in a year, but only contributions up to ₹1.5 lakh qualify for 80C tax deduction. Even NRIs can open PPF accounts (but cannot extend after maturity).",
  },
  {
    question: "Is PPF better than FD or EPF?",
    answer:
      "PPF vs FD: PPF wins on tax benefits (EEE vs taxable) and rates (7.1% tax-free vs ~7% taxable = ~5.25% post-tax). PPF loses on liquidity (15-year lock-in vs 7-day FD). PPF vs EPF: EPF has higher rates (8.25%) but only for salary above ₹15,000. EPF is mandatory, PPF is voluntary. For tax-free returns, PPF remains excellent despite lower rates.",
  },
  {
    question: "Can I take loan against my PPF account?",
    answer:
      "Yes, you can take a loan against your PPF balance between years 3-6. Loan amount is limited to 25% of the balance at the end of the 2nd preceding year. For example, in year 4, you can borrow against year 2 balance. Interest rate on PPF loan is 1% above the PPF rate (currently 8.1%). Partial withdrawals are allowed from year 7 onwards (up to 50% of balance at end of 4th year).",
  },
  {
    question: "What happens to PPF if the account holder dies?",
    answer:
      "On death of the account holder (before maturity), the balance is paid to the legal heir/nominee tax-free. If the nominee is a non-resident, tax implications may vary. If the deceased had self-contributed (not from EPF), the nominee gets the balance. Life Insurance can be claimed if the PPF was linked. The account is closed and not inherited.",
  },
]

const keyFeatures = [
  {
    title: "EEE Tax Status",
    description:
      "Exempt-Exempt-Exempt - contributions, interest, and maturity are all tax-free under Section 80C.",
  },
  {
    title: "15-Year Lock-in",
    description:
      "Minimum maturity period is 15 years, extendable in 5-year blocks with partial withdrawal option.",
  },
  {
    title: "Sovereign Guarantee",
    description:
      "Backed by Government of India - zero risk investment with guaranteed returns.",
  },
  {
    title: "Flexible Investment",
    description:
      "Minimum ₹500/year, maximum ₹1.5 lakh/year. Can invest in single or multiple installments.",
  },
  {
    title: "Nomination Facility",
    description:
      "Can nominate up to 3 persons. Mandatory nomination for account holders.",
  },
  {
    title: "Loan & Withdrawal",
    description:
      "Loan allowed from year 3-6. Partial withdrawal allowed from year 7 onwards.",
  },
]

const taxBenefits = [
  {
    section: "Section 80C",
    benefit: "Up to ₹1.5 lakh deduction on contributions",
    status: "Exempt",
  },
  {
    section: "Interest Income",
    benefit: "Annual interest completely tax-free",
    status: "Exempt",
  },
  {
    section: "Maturity Amount",
    benefit: "Entire corpus paid tax-free on maturity",
    status: "Exempt",
  },
  {
    section: "TDS",
    benefit: "No TDS deducted on interest or maturity",
    status: "Exempt",
  },
]

const howToSteps = [
  "Enter your monthly contribution amount. Minimum is ₹500/month (₹6,000/year), maximum is ₹12,500/month (₹1.5 lakh/year).",
  "Enter any existing PPF balance from previous years. This adds to your total contribution and earns interest.",
  "Current PPF interest rate is 7.1% p.a. (set by Government, reviewed quarterly). This is the rate your balance grows at.",
  "Enter the number of years. Minimum is 15 years, but you can extend in 5-year blocks after maturity.",
  "View your projected maturity amount, total contributions, and interest earned. The chart shows year-by-year growth.",
]

function PPFCalculator() {
  const [monthlyContribution, setMonthlyContribution] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("contribution")) || 5000
    }
    return 5000
  })

  const [currentBalance, setCurrentBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("balance")) || 0
    }
    return 0
  })

  const [annualRate] = useState(7.1)

  const [years, setYears] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("years")) || 15
    }
    return 15
  })

  const result = useMemo(
    () =>
      calculatePPF({ monthlyContribution, currentBalance, annualRate, years }),
    [monthlyContribution, currentBalance, annualRate, years]
  )

  const totalContribution = currentBalance + monthlyContribution * 12 * years
  const gainPercent =
    totalContribution > 0
      ? (
          ((result.maturityAmount - totalContribution) / totalContribution) *
          100
        ).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "PPF Calculator" },
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
          PPF Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate your Public Provident Fund (PPF) maturity amount and
          interest earnings. PPF offers EEE tax status - contributions qualify
          for 80C deduction, interest is tax-free, and maturity proceeds are
          completely tax-free. Plan your 15-year long-term savings with
          guaranteed returns.
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
          Enter PPF details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Monthly Contribution (₹)"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            min={500}
            max={12500}
          />

          <CurrencyInput
            label="Existing Balance (₹)"
            value={currentBalance}
            onChange={setCurrentBalance}
            min={0}
          />

          <div className="rounded-lg bg-green-50 p-4 sm:col-span-2 dark:bg-green-950/30">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="size-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-700 dark:text-green-300">
                Current PPF Rate: 7.1% p.a. (FY 2025-26)
              </span>
            </div>
          </div>

          <SliderField
            label="Investment Period"
            value={years}
            onChange={setYears}
            min={15}
            max={35}
            step={1}
            formatValue={(v) => `${v} Years`}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Your PPF projected returns
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Maturity Amount (Total Value)
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.maturityAmount)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.maturityAmount)}
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Total Contributions"
            value={formatCompactCurrency(totalContribution)}
            subtitle={`${monthlyContribution * 12} × ${years} years`}
          />
          <ResultCard
            label="Interest Earned"
            value={formatCompactCurrency(result.totalInterest)}
            subtitle={`${gainPercent}% gain over ${years} years`}
            variant="gain"
          />
          <ResultCard
            label="PPF Rate"
            value="7.1%"
            subtitle="Current FY 2025-26 rate"
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
            Year-by-Year Growth
          </p>
          <PayoffChart
            data={result.yearlyBreakdown.map((row) => ({
              year: row.year,
              baseAmount: row.contributions,
              growthAmount: row.interest,
            }))}
            baseLabel="Contributions"
            growthLabel="Interest Earned"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            contribution: monthlyContribution,
            balance: currentBalance,
            years,
          }}
        />

        <div className="mt-8 rounded-xl bg-secondary/50 p-5">
          <div className="flex items-start gap-3">
            <IconCalculator className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                How PPF Interest is Calculated
              </p>
              <p className="text-sm text-muted-foreground">
                PPF uses annual compound interest calculated on the lowest
                balance between the 5th and last day of each month. Interest is
                credited annually at the end of each financial year. For maximum
                returns, invest early in the financial year (preferably in
                April) and maintain the balance throughout the year.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            PPF Key Features
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {keyFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h4 className="font-semibold text-foreground">
                  {feature.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            PPF Tax Benefits (EEE Status)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-foreground">
                    Tax Aspect
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Benefit
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {taxBenefits.map((tb, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">
                      {tb.section}
                    </td>
                    <td className="py-3">{tb.benefit}</td>
                    <td className="py-3 font-medium text-green-600">
                      {tb.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Step-by-Step Guide
          </p>
          <div className="flex flex-col gap-3">
            {howToSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <FAQSection items={faqs} />

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/tools/epf-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            EPF Calculator <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/compound-interest-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Compound Interest <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/tax-regime-comparison"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Tax Regime Comparison <IconChevronRight className="size-4" />
          </Link>
        </div>
      </div>
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
