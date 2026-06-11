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
import { calculateLumpSum } from "@/lib/calculators/investments"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/lumpsum-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Lump Sum Mutual Fund Calculator — Compounding Power",
      description:
        "Calculate the future value of your one-time mutual fund investment. See how compounding multiplies your wealth over the long term.",
      path: "/tools/lumpsum-calculator",
    }),
  component: LumpSumCalculator,
})

const faqs = [
  {
    question: "What exactly is a Lump Sum Investment?",
    answer:
      "A lump sum investment is the act of depositing a single, substantial amount of money into a financial instrument (like a mutual fund, ETF, or stock) all at once, rather than spreading it out over time. It is a common strategy when you receive a large influx of cash from an annual bonus, an inheritance, or the proceeds from selling a property.",
  },
  {
    question: "Is Lump Sum better than a Systematic Investment Plan (SIP)?",
    answer:
      "Mathematically, if the market trends upward over your investment horizon (which it does roughly 70% of the time), a lump sum usually outperforms an SIP. This is because your entire capital gets more time in the market to benefit from compounding. However, SIPs are psychologically safer in volatile markets because they average out your purchase price through market dips.",
  },
  {
    question: "What realistic returns can I expect from Indian mutual funds?",
    answer:
      "Historically, Nifty 50 Index funds and large-cap equity mutual funds in India have delivered 11-13% annualized returns over 10+ year horizons. Mid-cap and small-cap funds have often delivered 14-16% but come with significantly higher volatility. Debt-oriented funds typically yield between 6% to 8% pre-tax.",
  },
  {
    question: "How is a lump sum investment taxed in India?",
    answer:
      "For equity mutual funds held longer than 12 months, the gains are taxed at 12.5% (LTCG) after an annual exemption of ₹1.25 Lakhs. If held for less than a year, gains are taxed at 20% (STCG). Gains from debt funds are now added to your total income and taxed exactly at your applicable income tax slab rate.",
  },
]

const howToSteps = [
  "Enter the total, single-payment amount you wish to invest today (e.g., ₹5,00,00,000).",
  "Set your expected annual return rate (12% is a realistic historical benchmark for Indian index funds).",
  "Choose your investment period—the number of years you plan to stay invested without withdrawing.",
  "Check the chart to visualize the exponential growth of your wealth through the power of compounding.",
  "Use the Share button to save a unique link with your exact calculation for future reference.",
]

function LumpSumCalculator() {
  const [principal, setPrincipal] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("amount")) ||
        100000
      )
    return 100000
  })
  const [expectedReturnRate, setExpectedReturnRate] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 12
      )
    return 12
  })
  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("tenure")) || 10
      )
    return 10
  })

  const result = useMemo(
    () =>
      calculateLumpSum({
        principal,
        expectedReturnRate,
        tenureYears,
      }),
    [principal, expectedReturnRate, tenureYears]
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
        { label: "Lump Sum Calculator" },
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
          Lump Sum Mutual Fund Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate the future value of your one-time mutual fund investment.
          See how the power of compounding multiplies your wealth over the long
          term.
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
          Investment details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Total Investment Amount"
              value={principal}
              onChange={setPrincipal}
              max={10_00_00_000}
            />
          </div>

          <SliderField
            label="Expected Annual Return"
            value={expectedReturnRate}
            onChange={setExpectedReturnRate}
            min={1}
            max={30}
            step={0.5}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Investment Period"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={40}
            step={1}
            formatValue={(v) => `${v} yrs`}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Projected Returns
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total corpus
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
            subtitle="One-time payment"
          />
          <ResultCard
            label="Wealth Gained"
            value={formatCompactCurrency(result.estimatedReturns)}
            subtitle={`${gainPercent}% absolute gain`}
            variant="gain"
          />
        </ResultGrid>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Wealth Growth Trajectory
          </p>
          <PayoffChart
            data={result.schedule.map((row) => ({
              year: row.year,
              baseAmount: row.invested,
              growthAmount: row.returns,
            }))}
            baseLabel="Amount Invested"
            growthLabel="Wealth Gained"
          />
        </div>

        {/* Detailed Projection Table */}
        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 text-right font-medium">Invested</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Wealth Gained
                  </th>
                  <th className="px-4 py-4 text-right font-medium text-foreground">
                    Total Value
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

        <ShareResult
          className="mt-6"
          params={{
            amount: principal,
            rate: expectedReturnRate,
            tenure: tenureYears,
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
            The Raw Power of Lump Sum Investing: Why It Beats an SIP
          </h2>
          <div
            className="flex flex-col gap-6 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              When a significant amount of money hits your bank account—perhaps
              from an annual corporate bonus, an inheritance, or the proceeds
              from selling a property—you face a crucial dilemma: Should you
              invest it all today (Lump Sum), or spread it out over the next few
              months (SIP)?
            </p>
            <p>
              While an SIP (Systematic Investment Plan) is often touted as the
              "safer" option, the mathematical reality is surprisingly
              different.{" "}
              <strong className="font-semibold text-foreground">
                Lump Sum investing almost always outperforms SIP over a
                long-term horizon.
              </strong>{" "}
              This is because equity markets historically trend upward roughly
              70% of the time. By investing all your capital on Day 1, you give
              every single rupee the maximum possible time to work for you
              through compounding. In an SIP, a portion of your money sits idly
              in a savings account for months, missing out on potential market
              rallies.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              1. The "Rule of 72" Cheat Code
            </h3>
            <p>
              Professional investors use a simple mental math trick to determine
              exactly how long it takes for a lump sum investment to double in
              value.
            </p>
            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6 font-mono text-sm text-foreground md:text-base">
              <p>Years to Double = 72 ÷ Expected Annual Return Rate</p>
            </div>
            <p>
              If your mutual fund delivers a realistic{" "}
              <strong className="font-semibold text-foreground">
                12% CAGR
              </strong>
              , your ₹10 Lakhs will double to ₹20 Lakhs in exactly{" "}
              <code className="text-foreground">72 / 12 = 6 years</code>. If you
              wait another 6 years, it doubles again to ₹40 Lakhs. This
              exponential curve is why lump sum investing is the ultimate weapon
              for reaching financial independence early.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              2. Overcoming Market Timing Anxiety
            </h3>
            <p>
              The biggest enemy of lump sum investing isn't mathematics—it's{" "}
              <strong className="font-semibold text-foreground">
                Market Timing Anxiety
              </strong>
              . Investors fear that they will invest ₹10 Lakhs today and the
              market will crash 10% tomorrow. While this is a valid short-term
              fear, history shows that "Time in the Market beats Timing the
              Market." Even if you invested at the "market top" every year, you
              would still generate substantial wealth if you simply stayed
              invested for 10 years or more.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              3. The STP Strategy: The Smart Middle Path
            </h3>
            <p>
              If the thought of dumping a large sum into a volatile market keeps
              you up at night, you should use a{" "}
              <strong className="font-semibold text-foreground">
                Systematic Transfer Plan (STP)
              </strong>
              .
            </p>
            <ul className="ml-6 list-disc space-y-4">
              <li>
                Park your large lump sum in a safe Liquid Debt Fund (which
                currently yields ~6-7%).
              </li>
              <li>
                Set up an automated instruction to transfer a fixed amount
                (e.g., ₹50,000) every month into an Equity Mutual Fund.
              </li>
            </ul>
            <p>
              This strategy allows you to earn decent interest on your idle cash
              while averaging out your entry price into the stock market over
              12-24 months, effectively creating your own SIP from a lump sum.
            </p>

            <div className="my-8 rounded-2xl border border-fc-gain/20 bg-fc-gain-bg p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-fc-gain-text uppercase">
                Compounding Calculator
              </h4>
              <p className="text-fc-gain-text/90">
                Are you also making monthly contributions on top of your lump
                sum? Use our{" "}
                <a href="/tools/sip-calculator" className="font-bold underline">
                  SIP Calculator
                </a>{" "}
                to see how much more you can accumulate by adding a monthly
                discipline to your initial investment.
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
            Is a lump sum always the right move? While it mathematically wins in
            trending markets, it requires high psychological discipline. Compare
            it against standard and Step-Up SIPs to find the best risk-adjusted
            path for your capital.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/sip-vs-lumpsum-vs-step-up-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              SIP vs Lump Sum vs Step-Up: The Ultimate Math Comparison
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
            <Link
              to="/blog/mutual-fund-ltcg-tax-rules-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              How Your Lump Sum Gains are Taxed in 2025
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
            name: "Lump Sum Mutual Fund Calculator",
            url: "https://financechk.com/tools/lumpsum-calculator",
            description:
              "Calculate the compound interest growth of a one-time mutual fund investment in India. Factors in inflation and expected CAGR.",
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
            "@type": "HowTo",
            name: "How to calculate mutual fund lump sum returns",
            step: howToSteps.map((text, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              text,
            })),
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
