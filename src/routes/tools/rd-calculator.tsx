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
import { calculateRD } from "@/lib/calculators/investments"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/rd-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Recurring Deposit (RD) Calculator India - Monthly Compounding",
      description:
        "Free online recurring deposit calculator for Indian banks. Calculate RD maturity value with monthly deposits. Compare Post Office RD rates with bank RD schemes.",
      path: "/tools/rd-calculator",
    }),
  component: RdCalculator,
})

const howToSteps = [
  "Enter the fixed amount you want to deposit every month (e.g., ₹5,000).",
  "Enter the annual interest rate offered by your bank (currently 6.5% - 7.5% for most Indian banks).",
  "Select the tenure of the recurring deposit in years (typically 1 to 10 years).",
  "The calculator simulates Indian banking standards (quarterly compounding) to show your exact maturity amount.",
]

function RdCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("amount")) ||
        5000
      )
    return 5000
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

  const result = useMemo(
    () =>
      calculateRD({
        monthlyDeposit,
        interestRate,
        tenureYears,
      }),
    [monthlyDeposit, interestRate, tenureYears]
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
        { label: "Recurring Deposit (RD) Calculator" },
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
          Recurring Deposit (RD) Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate the exact maturity value of your monthly bank deposits using
          standard quarterly compounding used by Indian banks.
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
              label="Monthly Deposit Amount"
              value={monthlyDeposit}
              onChange={setMonthlyDeposit}
              max={10_00_000}
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
            max={10}
            step={1}
            formatValue={(v) => `${v} yrs`}
          />
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
            label="Total Invested"
            value={formatCompactCurrency(result.totalInvested)}
            subtitle={`${tenureYears * 12} monthly deposits`}
          />
          <ResultCard
            label="Total Interest Earned"
            value={formatCompactCurrency(result.estimatedReturns)}
            subtitle={`${gainPercent}% absolute gain`}
            variant="gain"
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            RD Growth Trajectory
          </p>
          <PayoffChart
            data={result.schedule.map((row) => ({
              year: row.year,
              baseAmount: row.invested,
              growthAmount: row.returns,
            }))}
            baseLabel="Amount Invested"
            growthLabel="Interest Earned"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            amount: monthlyDeposit,
            rate: interestRate,
            tenure: tenureYears,
          }}
        />

        {/* Detailed Projection Table */}
        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 text-right font-medium">Invested</th>
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
            The Complete Guide to Recurring Deposits (RD) in India: 2025
            Masterclass
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
              A Recurring Deposit (RD) is a unique and incredibly popular
              financial instrument offered by Indian banks that allows people
              with regular monthly incomes to build a significant corpus over
              time. It functions as the safe, banking-industry equivalent of a
              mutual fund SIP (Systematic Investment Plan). By depositing a
              fixed amount every single month into your RD account, you earn
              interest at the same competitive rates applicable to Fixed
              Deposits (FDs), but without the need for a large initial lump sum
              of capital.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              How RD Interest is Mathematically Calculated
            </h3>
            <p>
              Many investors fall into the trap of assuming that if they invest
              ₹10,000 a month for 12 months at a 7% interest rate, they will
              earn 7% on the total ₹1,20,000 deposited. This is mathematically
              incorrect.
            </p>
            <p>
              In an RD, every single monthly installment is treated by the bank
              as a{" "}
              <strong className="font-semibold text-foreground">
                separate term deposit
              </strong>
              . Your first month's ₹10,000 deposit earns interest for the full
              12 months. Your second month's deposit earns interest for 11
              months, and your final deposit in the 12th month earns interest
              for just 30 days. Furthermore, all major Indian banks (SBI, HDFC,
              ICICI, etc.) compound RD interest{" "}
              <strong className="font-semibold text-foreground">
                quarterly
              </strong>
              .
            </p>
            <p>
              Because of this staggered deposit timeline and the power of
              quarterly compounding, the absolute return on your total invested
              amount in an RD will always be lower than the stated annual
              interest rate when viewed as a simple percentage. Our calculator
              uses the official Indian banking algorithms to simulate this exact
              logic, showing you your true maturity value down to the last
              rupee.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              RD vs. Mutual Fund SIP: Which Path Should You Choose?
            </h3>
            <p>
              The debate between an RD and a Systematic Investment Plan (SIP)
              comes down to your life stage, your risk tolerance, and your
              goal's specific deadline.
            </p>
            <ul className="ml-6 list-disc space-y-4">
              <li>
                <strong className="font-semibold text-foreground">
                  The RD Advantage (Safety & Certainty):
                </strong>{" "}
                Use an RD for short-term, non-negotiable financial goals (1 to 3
                years). If you are saving for a child's annual school fee, a
                down payment on a car, or an upcoming family vacation, you
                cannot afford the market volatility of a mutual fund. An RD
                ensures that on the day you need the money, every rupee of your
                principal and interest is there, guaranteed.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  The SIP Advantage (Wealth & Inflation Beating):
                </strong>{" "}
                If you are investing for long-term goals (5 to 20 years) like
                retirement or a child's higher education, an SIP in equity
                mutual funds is the undisputed winner. Over a 10-year horizon,
                equity markets historically deliver 12-15% CAGR, which
                aggressively beats inflation and outperforms RDs by a massive
                margin.
              </li>
            </ul>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              Taxation and TDS Rules for Recurring Deposits (FY 2024-25)
            </h3>
            <p>
              Unlike the Public Provident Fund (PPF), which is tax-free, the
              interest earned on an RD is{" "}
              <strong className="font-semibold text-foreground">
                fully taxable
              </strong>
              . It is added to your total annual income under "Income from Other
              Sources" and taxed at your applicable slab rate (10%, 20%, or
              30%).
            </p>
            <p>
              <strong className="text-foreground">
                TDS (Tax Deducted at Source):
              </strong>{" "}
              Since 2015, the government has applied TDS rules to RDs. If the
              total interest earned across all your accounts in a single bank
              exceeds{" "}
              <strong className="font-semibold text-foreground">₹40,000</strong>{" "}
              in a financial year (the limit is ₹50,000 for Senior Citizens),
              the bank is legally required to deduct 10% TDS.
            </p>
            <p>
              If your total annual income is below the basic exemption limit (₹3
              Lakhs), you must submit{" "}
              <strong className="font-semibold text-foreground">
                Form 15G or 15H
              </strong>{" "}
              to your bank at the start of every financial year to prevent this
              automatic deduction.
            </p>

            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Professional Savings Strategy
              </h4>
              <p className="text-foreground">
                To maximize your savings without locking up all your liquidity,
                combine your RD with an emergency fund. Keep 3 months of
                expenses in a high-interest savings account and route the rest
                into a{" "}
                <a
                  href="/tools/sip-calculator"
                  className="font-bold text-primary underline decoration-muted-foreground underline-offset-4 hover:decoration-primary"
                >
                  Mutual Fund SIP
                </a>{" "}
                or a recurring deposit depending on your immediate needs.
              </p>
            </div>
          </div>
        </section>

        <FAQSection
          items={[
            {
              question: "What is a Recurring Deposit (RD)?",
              answer:
                "A Recurring Deposit allows you to save a fixed amount of money every month for a specific period, earning interest at the same rate as a Fixed Deposit (FD). It's perfect for salaried individuals looking to build a corpus safely.",
            },
            {
              question: "How is RD interest calculated?",
              answer:
                "In India, banks compound RD interest quarterly. However, since your deposits are monthly, each deposit earns interest for a different duration. The first deposit earns interest for the entire tenure, while the last deposit earns interest for just one month.",
            },
            {
              question: "Is RD interest taxable?",
              answer:
                "Yes, the interest earned on an RD is fully taxable as per your income tax slab. Additionally, banks deduct a 10% TDS if the interest earned exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year.",
            },
          ]}
        />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Deepen Your Knowledge
          </h3>
          <p className="mb-6 text-muted-foreground">
            Is an RD enough to beat inflation in the long run? While perfect for
            short-term goals, long-term wealth requires a more aggressive
            strategy. Compare the math of safe bank deposits against the
            compounding power of mutual fund SIPs.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/sip-vs-lumpsum-vs-step-up-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              RD vs. SIP: Which is Better for Your Savings?
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
            name: "Recurring Deposit (RD) Calculator",
            url: "https://financechk.com/tools/rd-calculator",
            description:
              "Calculate your bank recurring deposit maturity amount using standard quarterly compounding.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          }),
        }}
      />
    </ToolLayout>
  )
}
