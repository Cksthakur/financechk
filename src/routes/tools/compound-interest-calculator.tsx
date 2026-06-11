import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import {
  IconCalculator,
  IconChevronRight,
  IconInfoCircle,
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
import { calculateCompoundInterest } from "@/lib/calculators/compound-interest"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/compound-interest-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "Compound Interest Calculator India - Calculate FD, Savings & Investment Returns",
      description:
        "Free online compound interest calculator for India. Calculate compound interest on fixed deposits, savings accounts, PPF, NSC and other investments. Compare yearly returns and plan your financial goals with accurate projections.",
      path: "/tools/compound-interest-calculator",
    }),
  component: CompoundInterestCalculator,
})

const faqs = [
  {
    question: "What is compound interest and how does it work in India?",
    answer:
      "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. In India, it's widely used in Fixed Deposits (FD), Public Provident Fund (PPF), National Savings Certificate (NSC), and savings accounts. The key advantage is that your interest earns interest, creating exponential growth over time. For example, ₹1 lakh at 7% compound interest becomes ₹2.16 lakh in 10 years.",
  },
  {
    question:
      "What is the difference between simple interest and compound interest?",
    answer:
      "Simple interest is calculated only on the principal amount: SI = P × r × t. Compound interest calculates interest on principal plus accumulated interest: CI = P × (1 + r/n)^(nt) - P. Over a 10-year period at 8% p.a., ₹1 lakh grows to ₹2.08 lakh with compound interest vs ₹1.80 lakh with simple interest — a difference of ₹28,000. The longer the period, the greater the difference.",
  },
  {
    question: "Which Indian investments use compound interest?",
    answer:
      "Most Indian investment products use compound interest: Fixed Deposits (quarterly compounding), PPF (annual compounding), NSC (annual compound), Senior Citizen Savings Scheme (quarterly), Sukanya Samriddhi Yojana (annual), and bank savings accounts (daily/monthly). Each has different compounding frequencies and tax treatments. PPF offers EEE (Exempt-Exempt-Exempt) tax status, making it particularly attractive.",
  },
  {
    question: "How does compounding frequency affect my returns?",
    answer:
      "More frequent compounding yields higher returns. For example, ₹1 lakh at 8% p.a.: yearly compounding gives ₹2.16 lakh in 10 years, while monthly compounding gives ₹2.20 lakh — about ₹4,000 more. The difference is more pronounced at higher rates and longer tenures. Most Indian FDs offer quarterly compounding by default, while some banks allow monthly compounding at slightly lower rates.",
  },
  {
    question: "Is compound interest tax-free in India?",
    answer:
      "It depends on the investment. PPF interest is completely tax-free (EEE status). NSC interest is taxable but qualifies for tax deduction under Section 80C. Bank FD interest is taxable at your income tax slab rate and requires TDS if interest exceeds ₹40,000/year. Senior Citizen Savings Scheme interest is taxable but eligible for Section 80D deduction. The effective post-tax return is what matters for your investment decision.",
  },
  {
    question: "How to calculate compound interest for Fixed Deposits in India?",
    answer:
      "For Indian FDs, use the formula: A = P × (1 + r/4)^(4t) for quarterly compounding, which is standard for most banks. SBI, HDFC, ICICI all compound interest quarterly. For example, ₹5 lakh FD at 7% for 5 years with quarterly compounding gives approximately ₹7.10 lakh. Use our FD calculator for precise calculations with your specific bank's rates.",
  },
  {
    question: "What is the rule of 72 in compound interest?",
    answer:
      "The Rule of 72 is a quick formula to estimate how long it takes to double your money: Years to double = 72 ÷ Interest Rate. At 8% p.a., your money doubles in approximately 9 years (72÷8=9). At 10% p.a., it doubles in about 7.2 years. This is useful for quick mental calculations but is only an approximation — exact doubling time at 8% is 9.01 years.",
  },
  {
    question:
      "Should I choose compound interest or simple interest investments?",
    answer:
      "For long-term wealth creation (5+ years), compound interest investments like PPF, FDs, and bonds outperform simple interest instruments. However, some scenarios favor simple interest: short-term loans, certain debentures, or when you need regular interest payouts rather than reinvestment. For most Indian investors, PPF and FDs with compound interest are the foundation of safe investment planning.",
  },
]

const keyConcepts = [
  {
    title: "Principal (P)",
    description:
      "The initial amount of money you invest or deposit. In India, minimum FD deposits start from ₹1,000, while PPF allows minimum ₹500 per year.",
  },
  {
    title: "Rate of Interest (r)",
    description:
      "The annual interest rate offered by the investment. Current FD rates range from 6-8%, PPF offers 7.1%, while senior citizen FDs offer 0.5% extra.",
  },
  {
    title: "Time Period (t)",
    description:
      "The duration for which your money remains invested. PPF has a 15-year lock-in, FDs can range from 7 days to 10 years. Longer periods mean more compounding benefits.",
  },
  {
    title: "Compounding Frequency (n)",
    description:
      "How often interest is calculated and added to your principal. Indian FDs typically compound quarterly (n=4), while PPF compounds annually (n=1).",
  },
]

const investmentComparisons = [
  {
    name: "Fixed Deposit (FD)",
    rate: "6.5% - 7.5%",
    compounding: "Quarterly",
    tax: "Taxable (TDS applies)",
    liquidity: "Low (penalty on early withdrawal)",
    bestFor: "Conservative investors, senior citizens",
  },
  {
    name: "Public Provident Fund (PPF)",
    rate: "7.1%",
    compounding: "Annual",
    tax: "Completely tax-free (EEE)",
    liquidity: "Very low (15-year lock-in)",
    bestFor: "Long-term tax-saving goals",
  },
  {
    name: "Savings Account",
    rate: "2.5% - 4%",
    compounding: "Monthly",
    tax: "Taxable",
    liquidity: "High (instant access)",
    bestFor: "Emergency funds, daily expenses",
  },
  {
    name: "Senior Citizen Savings Scheme",
    rate: "8.2%",
    compounding: "Quarterly",
    tax: "Taxable (TDS may apply)",
    liquidity: "Low (5-year lock-in)",
    bestFor: "Retirees seeking guaranteed returns",
  },
  {
    name: "NSC (National Savings Certificate)",
    rate: "7.7%",
    compounding: "Annual",
    tax: "Taxable (but qualifies for 80C)",
    liquidity: "Low (6-year lock-in)",
    bestFor: "Tax-saving investments for parents",
  },
]

const howToSteps = [
  "Enter your principal amount — the initial sum you want to invest. For FDs, minimum is typically ₹1,000; for PPF, minimum annual contribution is ₹500.",
  "Enter the expected annual interest rate. Current FD rates are around 6.5-7.5%, PPF is 7.1%, senior citizen FDs offer 8%. Higher rates mean higher returns.",
  "Select compounding frequency. Quarterly is standard for FDs, annual for PPF, monthly for savings accounts. More frequent compounding yields better returns.",
  "Enter investment tenure. Longer periods maximize compound growth — 10 years at 7% more than doubles your money. PPF has a minimum 15-year tenure.",
  "Review the year-by-year breakdown to see exactly how your money grows and when you'll reach your financial goals.",
]

type CompoundingFrequency = "yearly" | "half-yearly" | "quarterly" | "monthly"

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("principal")) || 100000
    }
    return 100000
  })

  const [annualRate, setAnnualRate] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("rate")) || 7
    }
    return 7
  })

  const [years, setYears] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("years")) || 10
    }
    return 10
  })

  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>("quarterly")

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        principal,
        annualRate,
        years,
        compoundingFrequency,
      }),
    [principal, annualRate, years, compoundingFrequency]
  )

  const effectiveRate = Math.pow(result.totalAmount / principal, 1 / years) - 1
  const gainPercent =
    result.totalInterest > 0
      ? ((result.totalInterest / principal) * 100).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Compound Interest Calculator" },
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
          Compound Interest Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate compound interest on FDs, PPF, savings accounts and other
          Indian investments. See how your money grows exponentially with
          quarterly, monthly, or yearly compounding. Compare different
          investment options and plan your financial goals with accurate
          projections.
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
          Enter investment details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Principal Amount (₹)"
              value={principal}
              onChange={setPrincipal}
              min={1000}
            />
          </div>

          <SliderField
            label="Annual Interest Rate"
            value={annualRate}
            onChange={setAnnualRate}
            min={1}
            max={15}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Investment Period"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            step={1}
            formatValue={(v) => `${v} Years`}
          />

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Compounding Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {(["yearly", "half-yearly", "quarterly", "monthly"] as const).map(
                (freq) => (
                  <button
                    key={freq}
                    onClick={() => setCompoundingFrequency(freq)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      compoundingFrequency === freq
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {freq === "yearly" && "Yearly (Annually)"}
                    {freq === "half-yearly" && "Half-Yearly"}
                    {freq === "quarterly" && "Quarterly (FD Standard)"}
                    {freq === "monthly" && "Monthly"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Your investment growth
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
            {formatCompactCurrency(result.totalAmount)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.totalAmount)}
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Principal Invested"
            value={formatCompactCurrency(principal)}
            subtitle="Your initial investment"
          />
          <ResultCard
            label="Interest Earned"
            value={formatCompactCurrency(result.totalInterest)}
            subtitle={`${gainPercent}% return over ${years} years`}
            variant="gain"
          />
          <ResultCard
            label="Effective Annual Rate"
            value={`${(effectiveRate * 100).toFixed(2)}%`}
            subtitle="What you actually earn per year"
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
              baseAmount: row.principal,
              growthAmount: row.interest,
            }))}
            baseLabel="Principal"
            growthLabel="Interest Earned"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            principal,
            rate: annualRate,
            years,
            frequency: compoundingFrequency,
          }}
        />

        <div className="mt-8 rounded-xl bg-secondary/50 p-5">
          <div className="flex items-start gap-3">
            <IconCalculator className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Compound Interest Formula
              </p>
              <code className="block rounded bg-card p-3 font-mono text-sm text-foreground">
                A = P × (1 + r/n)^(n×t)
              </code>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div>
                  <span className="font-medium text-foreground">A</span> = Final
                  amount (Maturity value)
                </div>
                <div>
                  <span className="font-medium text-foreground">P</span> =
                  Principal (Initial investment)
                </div>
                <div>
                  <span className="font-medium text-foreground">r</span> =
                  Annual interest rate (as decimal)
                </div>
                <div>
                  <span className="font-medium text-foreground">n</span> =
                  Compounding frequency per year
                </div>
                <div>
                  <span className="font-medium text-foreground">t</span> = Time
                  in years
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Key Concepts Explained
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h4 className="font-semibold text-foreground">
                  {concept.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Compare Indian Investment Options
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-foreground">
                    Investment
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Current Rate
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Compounding
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Tax Treatment
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {investmentComparisons.map((inv, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">
                      {inv.name}
                    </td>
                    <td className="py-3">{inv.rate}</td>
                    <td className="py-3">{inv.compounding}</td>
                    <td className="py-3">{inv.tax}</td>
                    <td className="py-3">{inv.bestFor}</td>
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

        <div className="mt-6 rounded-xl bg-blue-50 p-5 dark:bg-blue-950/30">
          <div className="flex items-start gap-3">
            <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold text-foreground">
                Pro Tip: The Rule of 72
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                To quickly estimate how long your money takes to double, divide
                72 by your interest rate. At 8% annual compound interest: 72 ÷ 8
                = 9 years to double your money. This is useful for quick mental
                calculations but is only an approximation.
              </p>
            </div>
          </div>
        </div>

        <FAQSection items={faqs} />

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/tools/sip-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            SIP Calculator <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/fd-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            FD Calculator <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/ppf-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            PPF Calculator <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/lumpsum-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Lumpsum Calculator <IconChevronRight className="size-4" />
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
