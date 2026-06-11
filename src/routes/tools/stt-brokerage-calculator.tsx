import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type { Segment } from "@/lib/calculators/brokerage"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateBrokerage } from "@/lib/calculators/brokerage"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/stt-brokerage-calculator")({
  head: () =>
    generateSeoMeta({
      title: "STT & Brokerage Calculator (April 2026 Updates)",
      description:
        "Calculate your exact net profit, Securities Transaction Tax (STT), and break-even points. Updated with the latest 2024 and 2026 budget hikes.",
      path: "/tools/stt-brokerage-calculator",
    }),
  component: BrokerageCalculator,
})

const segments: Array<{ value: Segment; label: string }> = [
  { value: "delivery", label: "Equity Delivery" },
  { value: "intraday", label: "Equity Intraday" },
  { value: "futures", label: "F&O Futures" },
  { value: "options", label: "F&O Options" },
]

const faqs = [
  {
    question: "What is the new STT rate for F&O (April 2026)?",
    answer:
      "Following the latest regulatory updates effective April 2026, the Securities Transaction Tax (STT) on the sale of options has been hiked to 0.1% of the premium value. For futures, the STT on the sale side stands at 0.02% of the total contract turnover. These hikes are part of the government's measure to curb excessive retail speculation in the derivatives segment.",
  },
  {
    question: "Why is my break-even point important?",
    answer:
      "The break-even point is the most critical metric for an active trader. It tells you the exact number of points the underlying asset (stock or index) must move in your favor just to cover your non-trading costs like STT, Brokerage, and Exchange fees. If you enter an option at ₹100 and your break-even is 1.5 points, you only start making a 'Net Profit' if you sell above ₹101.50.",
  },
  {
    question: "How much is GST on stock market charges?",
    answer:
      "In India, GST is levied at a flat rate of 18% on the sum of your Brokerage fees, Exchange Transaction Charges, and SEBI turnover fees. Crucially, GST is NOT charged on STT (Securities Transaction Tax) or Stamp Duty, as those are already government taxes.",
  },
  {
    question: "Are these charges the same across all brokers?",
    answer:
      "Statutory charges—STT, Stamp Duty, GST, and SEBI fees—are identical across all brokers in India as they are mandated by law. The only variable is the 'Brokerage' itself. Discount brokers like Zerodha, Upstox, and Groww usually charge a flat ₹20 per trade, whereas full-service bank brokers often charge a percentage of your turnover.",
  },
]

const howToSteps = [
  "Select your trading segment (Equity Delivery, Intraday, Futures, or Options).",
  "Enter the Average Buy Price per share or unit.",
  "Enter the Average Sell Price per share or unit.",
  "Enter the total Quantity (for F&O, multiply the lot size by the number of lots).",
  "Review the 'Trade Summary' to see your Net Profit/Loss after all taxes and your exact break-even points.",
]

function BrokerageCalculator() {
  const [segment, setSegment] = useState<Segment>(() => {
    if (typeof window !== "undefined") {
      const type = new URLSearchParams(window.location.search).get(
        "segment"
      ) as Segment
      if (
        type === "delivery" ||
        type === "intraday" ||
        type === "futures" ||
        type === "options"
      )
        return type
    }
    return "options"
  })
  const [buyPrice, setBuyPrice] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("buy")) || 100
      )
    return 100
  })
  const [sellPrice, setSellPrice] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("sell")) || 120
      )
    return 120
  })
  const [quantity, setQuantity] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("qty")) || 1000
      )
    return 1000
  })

  const result = useMemo(
    () =>
      calculateBrokerage({
        buyPrice,
        sellPrice,
        quantity,
        segment,
      }),
    [buyPrice, sellPrice, quantity, segment]
  )

  const isProfit = result.netPnL >= 0

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "STT & Brokerage Calculator" },
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
          STT & Brokerage Calculator (April 2026 Updates)
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate your exact net profit, Securities Transaction Tax (STT), and
          break-even points. Updated with the latest 2024 and 2026 budget hikes
          for F&O and Equity.
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
          Trade Details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Trading Segment
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {segments.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSegment(s.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    segment === s.value
                      ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <CurrencyInput
            label="Buy Price"
            value={buyPrice}
            onChange={setBuyPrice}
            max={10_00_000}
          />
          <CurrencyInput
            label="Sell Price"
            value={sellPrice}
            onChange={setSellPrice}
            max={10_00_000}
          />
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Total Quantity (Shares or Units)"
              value={quantity}
              onChange={setQuantity}
              max={10_000_000}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Trade Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: isProfit ? "var(--fc-gain-bg)" : "var(--fc-loss-bg)",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Net {isProfit ? "Profit" : "Loss"}
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              isProfit ? "text-fc-gain-text" : "text-fc-loss-text"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {isProfit ? "+" : "-"}
            {formatCurrency(Math.abs(result.netPnL))}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            After deducting{" "}
            <strong className="text-foreground">
              {formatCurrency(result.totalTaxAndCharges)}
            </strong>{" "}
            in total statutory taxes & charges.
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Points to Break Even"
            value={`${result.breakevenPoints.toFixed(2)} pts`}
            subtitle="Price move needed to cover costs"
          />
          <ResultCard
            label="Total Turnover"
            value={formatCompactCurrency(result.turnover)}
            subtitle="Buy value + Sell value"
          />
        </ResultGrid>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Detailed Tax & Charges Breakdown
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Brokerage Fees</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(result.brokerage)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                STT (Securities Transaction Tax)
              </span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(result.stt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Exchange Transaction Charges
              </span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(result.exchangeTxnCharge)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(result.gst)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SEBI Turnover Fees</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(result.sebiCharge)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stamp Duty</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(result.stampDuty)}
              </span>
            </div>

            <div
              className="mt-2 flex justify-between pt-3"
              style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
            >
              <span className="text-sm font-semibold text-foreground">
                Total Taxes & Charges
              </span>
              <span className="font-mono text-lg font-bold text-foreground">
                {formatCurrency(result.totalTaxAndCharges)}
              </span>
            </div>
          </div>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            segment,
            buy: buyPrice,
            sell: sellPrice,
            qty: quantity,
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
            How to use this STT & Brokerage calculator
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
            Decoding the April 2026 STT Hike: A Survival Guide for F&O Traders
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
              Trading in the Indian stock market is no longer just about getting
              your direction right. In the current regulatory environment, your
              greatest enemy isn't market volatility—it is the{" "}
              <strong className="font-semibold text-foreground">
                cost of execution
              </strong>
              . Following the historic Union Budget 2024 and subsequent SEBI
              mandates in early 2026, the statutory charges levied on every
              trade have reached a level where a "Gross Profit" on your terminal
              can easily result in a "Net Loss" in your bank account.
            </p>
            <p>
              Securities Transaction Tax (STT) is a direct tax levied by the
              Government of India on every transaction executed on recognized
              domestic stock exchanges. Over recent years, the Finance Ministry
              has systematically hiked STT to deliberately cool down the
              explosive retail participation in the highly risky Futures &
              Options (F&O) segment.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              1. Options Traders: The 0.1% Premium Trap
            </h3>
            <p>
              Following the April 2026 hike, STT on the sale of options was
              increased significantly to{" "}
              <strong className="font-semibold text-foreground">0.1%</strong> of
              the option premium. Unlike equity delivery where STT is charged on
              both buy and sell transactions, in the options segment, STT is
              only levied when you <em className="italic">sell</em> (exit a long
              position or initiate a short position).
            </p>
            <p>
              Because STT is levied on the total turnover of the premium, it
              disproportionately impacts scalpers. For example, if you buy a
              Nifty option at ₹100 and sell it at ₹102, your gross profit is ₹2
              per unit. However, the STT alone will eat up a significant chunk
              of that ₹2 move. After adding brokerage, GST, and exchange
              charges, you might find that you actually{" "}
              <strong className="text-fc-loss-text">lost money</strong> on a
              winning trade.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              2. Futures Traders: The Hidden Impact of High Turnover
            </h3>
            <p>
              STT on the sale of futures contracts now stands at{" "}
              <strong className="font-semibold text-foreground">0.02%</strong>{" "}
              of the trade price. While this percentage sounds small compared to
              options, it is calculated on the{" "}
              <em className="italic">full underlying asset value</em>.
            </p>
            <p>
              If you trade 1 lot of Nifty Futures at a value of ₹25 Lakhs, your
              STT on the sell side will be ₹500. For an active day trader
              executing 5-10 trades a day, you are surrendering thousands of
              rupees to the government daily, regardless of whether your P&L for
              the day is green or red.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              3. The Math of Break-Even Points
            </h3>
            <p>
              Our calculator's most powerful output is the{" "}
              <strong className="font-semibold text-foreground">
                Break-even Points
              </strong>
              . This represents the minimum price movement required in the
              underlying asset just to achieve a net profit of ₹0.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong className="font-semibold text-foreground">
                  Equity Delivery:
                </strong>{" "}
                Has high STT (0.1% on both sides) but zero brokerage with most
                discount brokers. Your break-even is usually around 0.22% of the
                price.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  F&O Options:
                </strong>{" "}
                Break-even is highly sensitive to the premium. For deep
                out-of-the-money (OTM) options with low premiums, taxes can be
                20-30% of your entire trade value.
              </li>
            </ul>

            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Maximize Your Trading Efficiency
              </h4>
              <p className="text-foreground">
                Before you execute another trade, run the numbers. If your
                strategy relies on capturing 5-10 points on Bank Nifty options,
                but your break-even is 4 points, your edge is almost
                non-existent. For a deeper look at how to structure your trading
                business and file ITR-3 to claim these charges as expenses, read
                our{" "}
                <a
                  href="/blog/f-and-o-tax-guide-itr-3"
                  className="font-bold text-primary underline"
                >
                  F&O Tax Guide
                </a>
                .
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
            Statutory charges are only half the story. Understanding how to
            report your trades to the IT department is crucial for long-term
            profitability. Learn about audit rules, business expenses, and the
            April 2026 STT hike impact.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/f-and-o-tax-guide-itr-3"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              F&O Tax Guide: Filing ITR-3 and Claiming Expenses
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
              to="/blog/zerodha-vs-groww-vs-angel-one-brokerage-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Zerodha vs Groww vs Angel One: 2025 Comparison
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
            name: "STT & Brokerage Calculator",
            url: "https://financechk.com/tools/stt-brokerage-calculator",
            description:
              "Calculate precise STT, Brokerage, GST, and Net PnL for Equity and F&O trading in India. Updated for April 2026 tax hikes.",
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
            name: "How to calculate your trading taxes and break-even points",
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
