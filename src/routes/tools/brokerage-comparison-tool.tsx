import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type { TradeSegment } from "@/lib/calculators/brokerage-comparison"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateBrokerageComparison } from "@/lib/calculators/brokerage-comparison"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/brokerage-comparison-tool")({
  head: () =>
    generateSeoMeta({
      title: "Discount vs. Full-Service Brokerage Comparison",
      description:
        "Compare the long-term compounding impact of percentage-based brokerage versus flat-fee discount brokers like Zerodha or Upstox.",
      path: "/tools/brokerage-comparison-tool",
    }),
  component: BrokerageComparisonTool,
})

const segments: Array<{ value: TradeSegment; label: string }> = [
  { value: "delivery", label: "Equity Delivery" },
  { value: "intraday", label: "Equity Intraday" },
  { value: "futures", label: "F&O Futures" },
  { value: "options", label: "F&O Options" },
]

const faqs = [
  {
    question: "What is a Discount Broker vs Full-Service Broker?",
    answer:
      "A discount broker (like Zerodha, Upstox, Groww) charges a low, flat fee (usually ₹20 per executed order) or zero brokerage for delivery trades. A full-service broker (like ICICI Direct, HDFC Securities, Kotak Securities) typically charges a percentage of your total trade turnover, which can lead to massive fees for large-value trades.",
  },
  {
    question: "Are there other hidden charges besides brokerage?",
    answer:
      "Yes. Brokerage is only the fee paid to your broker. Every trade on an Indian exchange also incurs statutory charges: STT (Securities Transaction Tax), Exchange Transaction Charges, SEBI turnover fees, Stamp Duty, and 18% GST. However, these government-mandated charges are identical across all brokers; the only way to save money is by reducing the brokerage fee.",
  },
  {
    question:
      "Do full-service brokers offer better platforms to justify the higher cost?",
    answer:
      "Historically, yes. But today, the technology platforms provided by top discount brokers are often superior, faster, and more reliable than traditional bank-backed systems. Full-service brokers justify their premiums primarily through relationship managers, branch networks, and proprietary research reports, which most modern traders find redundant.",
  },
  {
    question: "How is the 'Opportunity Cost' calculated in this tool?",
    answer:
      "Opportunity cost represents the future wealth you are surrendering by paying high fees. If you save ₹50,000 a year by switching to a discount broker and invest those savings in a simple index fund earning a historical 12% CAGR, we calculate how much that capital would be worth after 10 years of compounding.",
  },
]

const howToSteps = [
  "Select the trading segment you are most active in (e.g., Equity Intraday or F&O Options).",
  "Enter the average number of trades (buy + sell) you execute in a single month.",
  "Enter the average value (turnover) of a single trade (e.g., ₹2,00,000).",
  "The tool will instantly project your yearly brokerage costs across both broker models.",
  "View the 10-year compounding 'Opportunity Cost' to see the true impact on your long-term wealth.",
]

function BrokerageComparisonTool() {
  const [segment, setSegment] = useState<TradeSegment>(() => {
    if (typeof window !== "undefined") {
      const type = new URLSearchParams(window.location.search).get(
        "segment"
      ) as TradeSegment
      if (
        type === "delivery" ||
        type === "intraday" ||
        type === "futures" ||
        type === "options"
      )
        return type
    }
    return "delivery"
  })
  const [tradesPerMonth, setTradesPerMonth] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("trades")) || 20
      )
    return 20
  })
  const [avgTradeValue, setAvgTradeValue] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("value")) ||
        100000
      )
    return 100000
  })

  const result = useMemo(
    () =>
      calculateBrokerageComparison({
        segment,
        tradesPerMonth,
        avgTradeValue,
      }),
    [segment, tradesPerMonth, avgTradeValue]
  )

  const isSaving = result.yearlySavings > 0

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Brokerage Comparison Tool" },
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
          Discount vs. Full-Service Brokerage Comparison Tool
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Compare the devastating compounding effect of percentage-based
          brokerage versus flat-fee discount brokers. See exactly how much
          future wealth you are losing to bank-backed brokers.
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
          Trading Profile
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Primary Trading Segment
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

          <SliderField
            label="Trades per Month"
            value={tradesPerMonth}
            onChange={setTradesPerMonth}
            min={1}
            max={500}
            step={1}
            formatValue={(v) => `${Number(v).toFixed(0)} trades`}
          />

          <CurrencyInput
            label="Average Value per Trade"
            value={avgTradeValue}
            onChange={setAvgTradeValue}
            max={1_00_00_000}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          The Financial Impact
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: isSaving ? "var(--fc-gain-bg)" : "var(--fc-surface-2)",
            boxShadow: isSaving
              ? undefined
              : "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Potential Yearly Savings
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              isSaving ? "text-fc-gain-text" : "text-foreground"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCurrency(Math.max(0, result.yearlySavings))}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            By switching from a traditional full-service broker to a flat-fee
            discount model.
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Full-Service Fees (Yearly)"
            value={formatCompactCurrency(result.fullServiceYearly)}
            subtitle="At 0.55% / 0.05% per trade"
          />
          <ResultCard
            label="Discount Fees (Yearly)"
            value={formatCompactCurrency(result.discountBrokerYearly)}
            subtitle="At flat ₹20 or zero"
          />
        </ResultGrid>

        {isSaving && (
          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  The 10-Year Opportunity Cost
                </p>
                <p className="text-xs text-muted-foreground">
                  If you invested these savings in a 12% CAGR fund
                </p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-fc-amber">
                Wealth surrended
              </span>
            </div>
            <div className="mt-2">
              <p className="mt-1 font-mono text-3xl font-bold text-foreground">
                {formatCurrency(result.opportunityCost10Years)}
              </p>
            </div>
          </div>
        )}

        <ShareResult
          className="mt-6"
          params={{
            segment,
            trades: tradesPerMonth,
            value: avgTradeValue,
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
            How to use this comparison calculator
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
            The Hidden Cost of Full-Service Brokers: A 10-Year Mathematical
            Reality
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
              When a retail investor in India opens their first demat account,
              they often default to the "convenience" of their primary banking
              partner (e.g., HDFC, ICICI, or Kotak). These are known as{" "}
              <strong className="font-semibold text-foreground">
                Full-Service Brokers
              </strong>
              . While they provide a seamless 3-in-1 account, their pricing
              model is built on an archaic percentage-based system that quietly
              destroys long-term wealth compounding.
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              The Fatal Flaw of Percentage Brokerage
            </h3>
            <p>
              Assume you are an active investor buying 100 shares of Reliance
              Industries at ₹3,000 each. Your total trade turnover is ₹3,00,000.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong className="font-semibold text-foreground">
                  Full-Service Broker (0.55% Delivery Rate):
                </strong>{" "}
                You pay <strong className="text-fc-loss-text">₹1,650</strong>{" "}
                just to execute the buy order. When you eventually sell those
                shares, you pay another ₹1,650. Your total transaction cost for
                this one trade is a staggering ₹3,300.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Discount Broker (Zerodha/Upstox):
                </strong>{" "}
                Equity delivery is free. You pay exactly{" "}
                <strong className="text-fc-gain-text">₹0</strong> in brokerage
                for the exact same transaction.
              </li>
            </ul>
            <p>
              Now, imagine you are a semi-active trader executing just 10 such
              trades a month. Over a year, the bank-backed broker will drain
              over ₹4,00,000 from your capital in fees alone.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              The Devastating Opportunity Cost
            </h3>
            <p>
              The true tragedy of high brokerage isn't the money lost today—it
              is the{" "}
              <strong className="font-semibold text-foreground">
                Opportunity Cost
              </strong>{" "}
              of what that capital could have become.
            </p>
            <p>
              If you save ₹1,00,000 a year by switching to a flat-fee discount
              broker, and you automatically deploy those savings into a simple
              Nifty 50 Index Fund earning a conservative 12% CAGR, that money
              will compound into{" "}
              <strong className="font-semibold text-foreground">
                ₹19.3 Lakhs
              </strong>{" "}
              over a decade. By refusing to switch, you aren't just paying a
              "convenience fee"; you are effectively handing over nearly ₹20
              Lakhs of your future retirement corpus to the bank's shareholders.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              STATUTORY CHARGES: The Constant Factor
            </h3>
            <p>
              Brokers often confuse clients by mixing their fees with government
              taxes. It is vital to remember that statutory charges like{" "}
              <a
                href="/tools/stt-brokerage-calculator"
                className="font-bold text-primary underline"
              >
                STT (Securities Transaction Tax)
              </a>
              , Exchange Transaction Fees, and Stamp Duty are mandated by law.
              They are identical across every broker in India. The *only*
              variable you can optimize to protect your capital is the brokerage
              commission itself.
            </p>

            <div className="my-8 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Professional Verdict
              </h4>
              <p className="text-foreground">
                The era of needing a relationship manager for stock market
                research is over. Information is democratized, and the
                technology stacks of discount brokers like Zerodha are now far
                more robust than traditional bank portals. If your yearly
                brokerage exceeds ₹5,000, you are mathematically harming your
                future self. Switch to a discount model and redirect those fees
                into your{" "}
                <a
                  href="/tools/sip-calculator"
                  className="font-bold text-primary underline"
                >
                  SIP portfolio
                </a>{" "}
                instead.
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
            Choosing a broker is about more than just the flat fee. Hidden DP
            charges, AMC costs, and the speed of the trading terminal (like Kite
            vs. others) can impact your peace of mind and profitability. Read
            our deep-dive comparison to find the best fit for your trading
            style.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/zerodha-vs-groww-vs-angel-one-brokerage-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Zerodha vs Groww vs Angel One: 2025 Hidden Charges Comparison
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
            name: "Brokerage Comparison Tool",
            url: "https://financechk.com/tools/brokerage-comparison-tool",
            description:
              "The definitive calculator to compare percentage-based bank brokers against flat-fee discount brokers. Calculate 10-year compounding opportunity costs and yearly savings.",
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
            name: "How to compare discount and full-service brokers",
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
