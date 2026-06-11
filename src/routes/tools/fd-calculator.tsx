import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { calculateFD } from "@/lib/calculators/investments"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/fd-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Fixed Deposit (FD) Calculator India - Quarterly Compounding",
      description:
        "Free online FD calculator for Indian banks. Calculate fixed deposit maturity value with quarterly compounding. Compare SBI, HDFC, ICICI FD rates and plan your investment returns.",
      path: "/tools/fd-calculator",
    }),
  component: FdCalculator,
})

const faqs = [
  {
    question: "How is FD interest calculated in India?",
    answer:
      "Most banks in India calculate Fixed Deposit interest using quarterly compounding. This means the interest earned in the first quarter is added to your principal, and in the next quarter, you earn interest on both your original principal and the accumulated interest.",
  },
  {
    question: "Is FD interest taxable?",
    answer:
      "Yes. The interest earned on your Fixed Deposit is fully taxable as 'Income from Other Sources' according to your income tax slab rate. Banks also deduct a 10% TDS if your interest income exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year.",
  },
  {
    question: "Can I break my FD before maturity?",
    answer:
      "Yes, you can prematurely withdraw your FD, but banks typically charge a penalty of 0.5% to 1% on the applicable interest rate for the duration the deposit was actually held.",
  },
]

const howToSteps = [
  "Enter the total lump sum amount you want to deposit in the bank.",
  "Enter the annual interest rate offered by the bank.",
  "Select the tenure of the fixed deposit in years.",
  "Choose how often the bank compounds the interest (Quarterly is the standard for most Indian banks).",
  "View your guaranteed maturity amount and total interest earned.",
]

function FdCalculator() {
  const [principal, setPrincipal] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("principal")) ||
        100000
      )
    return 100000
  })
  const [interestRate, setInterestRate] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 7.0
      )
    return 7.0
  })
  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("tenure")) || 5
      )
    return 5
  })
  const [compoundingFrequency, setCompoundingFrequency] = useState<
    1 | 2 | 4 | 12
  >(() => {
    if (typeof window !== "undefined") {
      const f = Number(new URLSearchParams(window.location.search).get("freq"))
      if (f === 1 || f === 2 || f === 4 || f === 12) return f
    }
    return 4 // Quarterly is default
  })

  const result = useMemo(
    () =>
      calculateFD({
        principal,
        interestRate,
        tenureYears,
        compoundingFrequency,
      }),
    [principal, interestRate, tenureYears, compoundingFrequency]
  )

  const gainPercent =
    result.totalInvested > 0
      ? ((result.estimatedReturns / result.totalInvested) * 100).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Fixed Deposit (FD) Calculator" },
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
          Fixed Deposit (FD) Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate the exact maturity value and interest earned on your bank
          fixed deposit with quarterly compounding accuracy.
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
          Deposit Details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Total Deposit Amount"
              value={principal}
              onChange={setPrincipal}
              max={10_00_00_000}
            />
          </div>

          <SliderField
            label="Annual Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={3}
            max={12}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Tenure (Years)"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={20}
            step={1}
            formatValue={(v) => `${v} yrs`}
          />

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Compounding Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Yearly", value: 1 },
                { label: "Half-Yearly", value: 2 },
                { label: "Quarterly", value: 4 },
                { label: "Monthly", value: 12 },
              ].map((freq) => (
                <button
                  key={freq.value}
                  onClick={() =>
                    setCompoundingFrequency(freq.value as 1 | 2 | 4 | 12)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    compoundingFrequency === freq.value
                      ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Note: Indian banks typically use Quarterly compounding.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Guaranteed Returns
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Maturity Value
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalCorpus)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.totalCorpus)}
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Principal Amount"
            value={formatCompactCurrency(result.totalInvested)}
            subtitle="Original deposit"
          />
          <ResultCard
            label="Total Interest Earned"
            value={formatCompactCurrency(result.estimatedReturns)}
            subtitle={`${gainPercent}% absolute gain`}
            variant="gain"
          />
        </ResultGrid>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            FD Growth Trajectory
          </p>
          <PayoffChart
            data={result.schedule.map((row) => ({
              year: row.year,
              baseAmount: row.invested,
              growthAmount: row.returns,
            }))}
            baseLabel="Principal"
            growthLabel="Interest Earned"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            principal,
            rate: interestRate,
            tenure: tenureYears,
            freq: compoundingFrequency,
          }}
        />

        {/* Detailed Projection Table */}
        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Principal
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Interest Earned
                  </th>
                  <th className="px-4 py-4 text-right font-medium text-foreground">
                    Maturity Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.schedule.map((row, i) => (
                  <tr
                    key={row.year}
                    className={`transition-colors hover:bg-muted/50 ${i % 2 === 0 ? "bg-card" : "bg-secondary/10"}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      Year {row.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.invested)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fc-gain-text">
                      +{formatCurrency(row.returns)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(row.corpus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
            The Definitive Guide to Fixed Deposits (FD) in India: 2025 Edition
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
              Fixed Deposits (FDs) have remained the absolute bedrock of Indian
              household savings for over seven decades. Even with the meteoric
              rise of equity mutual funds and crypto-assets, the humble FD
              remains the ultimate safe haven for capital preservation,
              emergency fund management, and fulfilling short-term financial
              goals. Unlike market-linked instruments where your principal can
              fluctuate, a Fixed Deposit offers a 100% guarantee of your capital
              (backed by DICGC insurance up to ₹5 Lakhs per bank) and a
              guaranteed, non-negotiable rate of interest.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              1. Why Compounding Frequency is the Most Critical Variable
            </h3>
            <p>
              A common mistake most retail investors make is comparing FDs
              solely on the "Annual Interest Rate." In reality, the frequency of
              compounding dictates your actual "Effective Yield."
            </p>
            <p>
              In India, most major banks like SBI, HDFC, and ICICI use{" "}
              <strong className="font-semibold text-foreground">
                Quarterly Compounding
              </strong>{" "}
              as the default. This means every three months, the interest earned
              is calculated and added to your principal amount. In the
              subsequent quarter, you earn interest on both your original
              principal <em className="italic">and</em> the interest you earned
              in the previous period.
            </p>
            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6 font-mono text-sm text-foreground md:text-base">
              <p className="mb-2 font-bold">The FD Compounding Formula:</p>
              <p>A = P [1 + r / n] ^ (n * t)</p>
              <ul className="mt-3 list-disc pl-5 text-xs text-muted-foreground">
                <li>A = Maturity Amount</li>
                <li>P = Principal Amount</li>
                <li>r = Annual interest rate (decimal)</li>
                <li>
                  n = Number of compounding periods per year (e.g., 4 for
                  Quarterly)
                </li>
                <li>t = Number of years</li>
              </ul>
            </div>
            <p>
              Because of quarterly compounding, a 7% stated interest rate
              actually delivers an{" "}
              <strong className="font-semibold text-foreground">
                effective annualized yield of 7.18%
              </strong>
              . If you opt for Monthly Compounding, the yield is even higher,
              whereas Yearly Compounding is the least efficient. Our calculator
              simulates these exact banking standards to ensure your projections
              are accurate down to the nearest rupee.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              2. The FD Laddering Strategy: Beating Interest Rate Cycles
            </h3>
            <p>
              Fixed Deposits have one major weakness:{" "}
              <strong className="font-semibold text-foreground">
                Liquidity and Reinvestment Risk
              </strong>
              . If you lock your entire ₹10 Lakh savings into a 5-year FD at 6%
              interest, and rates jump to 8% next year, you are trapped in a
              low-yield instrument. If you break the FD to reinvest, the bank
              will charge you a 1% penalty.
            </p>
            <p>
              The solution used by sophisticated investors is{" "}
              <strong className="font-semibold text-foreground">
                FD Laddering
              </strong>
              . Instead of one large deposit, you break your capital into
              multiple FDs with staggered maturities:
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>FD 1: ₹2 Lakh for 1 year</li>
              <li>FD 2: ₹2 Lakh for 2 years</li>
              <li>FD 3: ₹2 Lakh for 3 years</li>
              <li>FD 4: ₹2 Lakh for 4 years</li>
              <li>FD 5: ₹2 Lakh for 5 years</li>
            </ul>
            <p>
              After Year 1, your first FD matures. You reinvest it for 5 years.
              After Year 2, the second matures, and you reinvest for 5 years.
              Eventually, you will have a ₹2 Lakh FD maturing{" "}
              <em className="italic">every single year</em>. This provides you
              with continuous cash flow for emergencies while ensuring your
              capital is always exposed to the prevailing long-term interest
              rates.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              3. Understanding the TDS and Taxation Rules (FY 2024-25)
            </h3>
            <p>
              FD interest is not tax-free. It is classified as "Income from
              Other Sources" and is added to your total income, taxed according
              to your applicable slab rate (10%, 20%, or 30%).
            </p>
            <p>
              <strong className="text-foreground">TDS Thresholds:</strong> Banks
              are mandated by the Income Tax Department to deduct a 10% TDS (Tax
              Deducted at Source) if the total interest earned across all
              branches of a single bank exceeds{" "}
              <strong className="font-semibold text-foreground">₹40,000</strong>{" "}
              in a financial year (the limit is ₹50,000 for Senior Citizens).
            </p>
            <p>
              If your total annual income is below the basic taxable limit (₹3
              Lakhs under the New Regime), you can submit{" "}
              <strong className="font-semibold text-foreground">
                Form 15G (for individuals) or Form 15H (for senior citizens)
              </strong>{" "}
              to the bank. This declaration legally prevents the bank from
              deducting TDS, ensuring you receive your full interest amount
              without having to wait for a refund from the IT department.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              4. FD vs. Debt Mutual Funds: The New Paradigm
            </h3>
            <p>
              Before April 1, 2023, Debt Mutual Funds were superior to FDs due
              to indexation benefits and a lower 20% tax rate. However, the
              Finance Act 2023 removed these benefits. Today, most debt mutual
              funds are taxed exactly like FDs (at slab rates).
            </p>
            <p>
              The choice now comes down to{" "}
              <strong className="font-semibold text-foreground">
                Convenience vs. Predictability
              </strong>
              . While Debt Funds offer better liquidity (no fixed tenure), FDs
              offer absolute predictability. You know exactly how much money you
              will have on a specific date in the future, making FDs superior
              for specific milestones like a wedding, a down payment, or a
              child's school fee.
            </p>

            <div className="my-6 rounded-2xl border border-fc-gain/20 bg-fc-gain-bg p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Maximize Your Returns
              </h4>
              <p className="text-fc-gain-text">
                For long-term goals (7+ years), consider moving a portion of
                your FD interest into a{" "}
                <a href="/tools/sip-calculator" className="font-bold underline">
                  Mutual Fund SIP
                </a>
                . By combining the safety of an FD principal with the growth of
                an SIP, you create a "Capital Protection" strategy that beats
                inflation while keeping your downside risk to zero.
              </p>
            </div>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Deepen Your Knowledge
          </h3>
          <p className="mb-6 text-muted-foreground">
            Fixed Deposits are safe, but they are no longer as tax-efficient as
            they used to be compared to other debt instruments. Learn how to
            ladder your FDs and understand the impact of the latest Income Tax
            Act changes on your interest income.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/income-tax-act-2025-changes"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              How 2025 Tax Changes Affect Your Bank FD Interest
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
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
            name: "Fixed Deposit (FD) Calculator",
            url: "https://financechk.com/tools/fd-calculator",
            description:
              "Calculate your bank fixed deposit maturity amount with quarterly compounding.",
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
