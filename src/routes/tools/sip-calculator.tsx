import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { SliderField } from "@/components/finance/slider-field"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { ShareResult } from "@/components/finance/share-result"
import { calculateSIP } from "@/lib/calculators/sip"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/sip-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "SIP Calculator - Systematic Investment Plan Returns Calculator India",
      description:
        "Free online SIP calculator for Indian mutual funds. Calculate estimated returns on monthly SIP investments with compound interest. Plan your financial goals with accurate projections.",
      path: "/tools/sip-calculator",
    }),
  component: SIPCalculator,
})

const faqs = [
  {
    question: "Do I have to invest exactly every month?",
    answer:
      "No, while monthly is the most popular, you can set up weekly, quarterly, or even daily SIPs. The mutual fund house will simply automatically deduct the money from your linked bank account on your chosen date.",
  },
  {
    question: "Can I stop or pause my SIP anytime?",
    answer:
      "Absolutely. An SIP is not a contract or a loan. You can pause, stop, or increase it at any time with no penalties. If you stop an SIP, your existing investments keep growing based on the market.",
  },
  {
    question: "What return rate should I casually expect?",
    answer:
      "For a pure equity mutual fund (like Flexicap or Nifty 50 Index), historical Indian market returns suggest 12% to 15% over a 10+ year horizon. For debt funds, 6% to 8% is safer.",
  },
  {
    question: "What if the stock market crashes?",
    answer:
      "That's actually when your SIP works best! Because the NAV (price) drops, your fixed ₹10k buys more mutual fund units during a crash. When the market inevitably recovers, those extra units accelerate your growth.",
  },
  {
    question: "How are SIP taxes calculated?",
    answer:
      "Every single monthly installment is treated as its own purchase. If you sell units you've held for over a year, they are Long Term Capital Gains (LTCG). Post-Budget 2024, the first ₹1.25 Lakhs of LTCG profit is tax-free, and everything above that is taxed at 12.5%.",
  },
]

const howToSteps = [
  "Enter the amount you can comfortably invest every month without stretching your budget.",
  "Pick your realistic expected return (e.g., 12% for Nifty index funds, 6% for FDs/Post Office).",
  "Set your investment timeline. The real magic of compounding usually starts after year 10.",
  "Check the chart to see when your wealth curve shifts from linear savings to exponential growth.",
]

function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("amount")) ||
        10000
      )
    return 10000
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
    () => calculateSIP({ monthlyInvestment, expectedReturnRate, tenureYears }),
    [monthlyInvestment, expectedReturnRate, tenureYears]
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
        { label: "SIP Calculator" },
      ]}
    >
      {/* Page header — Playfair Display, light weight */}
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
          SIP Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate the future value of your Systematic Investment Plan (SIP) in
          mutual funds. See how the power of compounding grows your wealth over
          time.
        </p>
        <LastUpdated date="April 2026" author="Rajat" />
      </div>

      {/* Calculator card */}
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
              label="Monthly SIP Amount"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={500}
              max={10_00_000}
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

      {/* Results */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Projected returns
        </p>

        {/* Primary result — warm stone */}
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

        <ResultGrid cols={3}>
          <ResultCard
            label="Total Invested"
            value={formatCompactCurrency(result.totalInvested)}
            subtitle={`${tenureYears} yrs × 12 × ${formatCurrency(monthlyInvestment)}`}
          />
          <ResultCard
            label="Est. Returns"
            value={formatCompactCurrency(result.estimatedReturns)}
            subtitle={`${gainPercent}% absolute gain`}
            variant="gain"
          />
          <ResultCard
            label="Wealth Multiplier"
            value={`${result.totalInvested > 0 ? (result.totalCorpus / result.totalInvested).toFixed(1) : "0"}x`}
            subtitle="Your money grew by"
          />
        </ResultGrid>

        {/* Wealth Growth Chart */}
        <div
          className="mt-8 rounded-2xl bg-card p-5 md:p-6"
          style={{
            boxShadow:
              "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
          }}
        >
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Wealth Growth Trajectory
          </p>
          <PayoffChart
            data={
              // Extract yearly snapshots from the monthly schedule
              result.schedule
                .filter(
                  (row) =>
                    row.month % 12 === 0 || row.month === tenureYears * 12
                )
                .map((row) => ({
                  year: row.year,
                  baseAmount: row.invested,
                  growthAmount: row.returns,
                }))
            }
            baseLabel="Amount Invested"
            growthLabel="Wealth Gained"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            amount: monthlyInvestment,
            rate: expectedReturnRate,
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
                    Wealth Gained
                  </th>
                  <th className="px-4 py-4 text-right font-medium text-foreground">
                    Total Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.schedule
                  .filter(
                    (row) =>
                      row.month % 12 === 0 || row.month === tenureYears * 12
                  )
                  .map((row, i) => (
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

      {/* Content sections — full page anatomy */}
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
            Why Everyone Tells You to "Just start an SIP"
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              Here's a question most new investors get wrong:{" "}
              <em className="italic">
                "Should I wait for the market to dip before I start investing?"
              </em>
            </p>
            <p>
              The answer is almost always no. Nobody can time the market
              consistently. Not retail investors, not CNBC analysts, and not
              hedge fund managers managing ₹50,000 crores. An SIP (Systematic
              Investment Plan) takes this entire anxiety off the table.
            </p>
            <p>
              You pick an amount—say, ₹10,000. It leaves your bank account on
              the 5th of every month. Done. When Nifty crashes? Your ₹10k just
              bought more mutual fund units at a discount. When it hits an
              all-time high? You buy fewer units.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              1. The 15-15-15 Rule
            </h3>
            <p>
              There's a famous rule of thumb in Indian personal finance circles:{" "}
              <strong className="font-semibold text-foreground">
                ₹15,000 a month, for 15 years, at 15% return.
              </strong>{" "}
              Let's look at the math.
            </p>
            <p>
              Your actual money invested over those 15 years is ₹27 Lakhs. But
              compound interest acts like a snowball rolling down a hill. By the
              end of year 15, your corpus is projected to touch{" "}
              <strong className="font-semibold text-foreground">
                ₹1 Crore
              </strong>
              .
            </p>
            <p>
              What's crazy is what happens if you just wait another 5 years. If
              you leave it alone for 20 years instead of 15, that ₹1 Crore
              doesn't just grow linearly—it explodes to ₹2.27 Crores. The curve
              goes vertical.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              2. SIP vs. Lump Sum
            </h3>
            <p>
              If you have ₹12 Lakhs right now, should you invest it all today,
              or split it into 12 parts and do a ₹1 Lakh SIP every month?
            </p>
            <p>
              Mathematically, history shows that dumping the lump sum
              immediately actually wins about 65% of the time, because markets
              generally go up. Leaving cash sitting in a bank account means
              missing out on gains.
            </p>
            <p>
              Psychologically, however, lump sum is terrifying. If you invest
              ₹12 Lakhs on Tuesday and the market corrects 10% on Wednesday,
              your screen suddenly shows ₹10.8 Lakhs. Most investors panic and
              sell. Staggering that investment via an SIP spreads out your entry
              points and protects your mental peace.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              3. What about Taxes? (Post-Budget 2024)
            </h3>
            <p>
              When it comes to taxation, it's crucial to remember that{" "}
              <strong className="font-semibold text-foreground">
                each monthly SIP installment has its own separate timeline.
              </strong>
            </p>
            <p>
              If you started an SIP 5 years ago and sell everything today, any
              individual monthly installments made within the last 12 months are
              considered Short-Term Capital Gains (STCG) and will be taxed at
              20%.
            </p>
            <p>
              All the installments older than 12 months fall under Long-Term
              Capital Gains (LTCG). Under the updated tax regime, the first
              ₹1.25 Lakhs of your entire LTCG profit is fully tax-exempt, and
              any profit above that is taxed at 12.5%.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Deepen Your Knowledge
          </h3>
          <p className="mb-6 text-muted-foreground">
            Is an SIP always better than a one-time investment? How does it
            compare to a Step-Up SIP over 20 years? Read our detailed comparison
            to optimize your strategy.
          </p>
          <Link
            to="/blog/sip-vs-lumpsum-vs-step-up-comparison"
            className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            SIP vs Lump Sum vs Step-Up: The Definitive Guide
            <IconChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* WebApplication + HowTo JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SIP Calculator",
            url: "https://financechk.com/tools/sip-calculator",
            description:
              "Calculate the true power of compounding. See how small, disciplined monthly investments in Indian mutual funds can grow into a massive corpus over time.",
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
            name: "How to calculate SIP returns",
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
