import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateMcxPosition } from "@/lib/calculators/mcx-position-sizer"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/mcx-crude-position-sizer")({
  head: () =>
    generateSeoMeta({
      title: "MCX Crude Oil Position Sizer & Risk Calculator",
      description:
        "The professional's tool for risk management. Calculate exact lot sizes for Mega and Mini crude oil contracts based on your stop-loss.",
      path: "/tools/mcx-crude-position-sizer",
    }),
  component: McxPositionSizer,
})

const faqs = [
  {
    question: "What is the lot size for MCX Crude Oil?",
    answer:
      "MCX offers two main crude oil contracts: The regular (Mega) contract has a lot size of 100 barrels. The Mini (CRUDEOILM) contract has a lot size of 10 barrels. A 1-point move equals ₹100 profit/loss in the Mega contract and ₹10 in the Mini contract.",
  },
  {
    question: "How is the margin calculated for crude oil?",
    answer:
      "Margin requirements fluctuate based on market volatility (VIX). Typically, exchanges block SPAN margin plus an exposure margin. For crude oil, this usually translates to approximately 15% - 25% of the total contract value. Always check your broker's exact margin requirements before trading.",
  },
  {
    question: "Why does the calculator suggest 0 lots?",
    answer:
      "If the calculator suggests 0 lots, it means taking even 1 lot would exceed your defined risk percentage, or you do not have enough capital to meet the margin requirements for a single lot. You must either increase your risk percentage, increase your stop loss (tighten it), or add capital.",
  },
  {
    question: "What is position sizing?",
    answer:
      "Position sizing is the most critical risk management tool in trading. It tells you exactly how many lots you should trade so that if your stop loss hits, you only lose a predetermined, safe percentage of your capital (usually 1-2%).",
  },
]

const howToSteps = [
  "Enter your total trading account capital (e.g., ₹5,00,000).",
  "Set your risk tolerance per trade (professional traders risk 1% to 2% max).",
  "Enter your planned Entry Price for the crude oil contract (e.g., 6500).",
  "Enter your strict Stop Loss Price (e.g., 6460).",
  "The calculator will instantly show how many Mega or Mini lots you can safely trade to protect your capital.",
]

function McxPositionSizer() {
  const [accountCapital, setAccountCapital] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("cap")) || 500000
      )
    return 500000
  })
  const [riskPercentage, setRiskPercentage] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("risk")) || 1.5
      )
    return 1.5
  })
  const [entryPrice, setEntryPrice] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("entry")) || 6500
      )
    return 6500
  })
  const [stopLossPrice, setStopLossPrice] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("sl")) || 6470
      )
    return 6470
  })

  const result = useMemo(
    () =>
      calculateMcxPosition({
        accountCapital,
        riskPercentage,
        entryPrice,
        stopLossPrice,
      }),
    [accountCapital, riskPercentage, entryPrice, stopLossPrice]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "MCX Crude Oil Position Sizer" },
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
          MCX Crude Oil Position Sizer & Risk Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          The professional's tool for surviving the commodity market. Calculate
          exactly how many Mega or Mini crude oil lots to trade based on your
          capital and stop-loss.
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
          Risk Parameters
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Trading Account Capital"
              value={accountCapital}
              onChange={setAccountCapital}
              max={1_00_00_000}
            />
          </div>
          <div className="sm:col-span-2">
            <SliderField
              label="Risk per Trade (%)"
              value={riskPercentage}
              onChange={setRiskPercentage}
              min={0.1}
              max={10}
              step={0.1}
              formatValue={(v) => `${Number(v).toFixed(1)}%`}
            />
          </div>

          <CurrencyInput
            label="Entry Price"
            value={entryPrice}
            onChange={setEntryPrice}
            max={20000}
          />
          <CurrencyInput
            label="Stop Loss Price"
            value={stopLossPrice}
            onChange={setStopLossPrice}
            max={20000}
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-secondary p-4 text-center">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Max Allowed Risk
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-fc-loss-text">
              {formatCurrency(result.maxRiskAmount)}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-4 text-center">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Stop Loss Points
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-foreground">
              {result.pointsRisk} pts
            </p>
          </div>
        </div>

        <ResultGrid cols={2}>
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Mega Contract (100 bbl)
              </p>
              <p className="text-xs text-muted-foreground">
                ₹100 risk per point, per lot
              </p>
            </div>
            <div className="mt-auto">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Allowed Lots
              </p>
              <p
                className={`mt-1 font-mono text-4xl font-bold ${result.megaLotsAllowed > 0 ? "text-fc-gain" : "text-muted-foreground"}`}
              >
                {result.megaLotsAllowed}
              </p>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Actual Risk
                </p>
                <p className="font-mono text-sm font-medium">
                  {formatCurrency(result.megaActualRisk)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Margin Needed
                </p>
                <p className="font-mono text-sm font-medium">
                  {formatCompactCurrency(result.megaMarginRequired)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Mini Contract (10 bbl)
              </p>
              <p className="text-xs text-muted-foreground">
                ₹10 risk per point, per lot
              </p>
            </div>
            <div className="mt-auto">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Allowed Lots
              </p>
              <p
                className={`mt-1 font-mono text-4xl font-bold ${result.miniLotsAllowed > 0 ? "text-foreground" : "text-muted-foreground"}`}
              >
                {result.miniLotsAllowed}
              </p>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Actual Risk
                </p>
                <p className="font-mono text-sm font-medium">
                  {formatCurrency(result.miniActualRisk)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Margin Needed
                </p>
                <p className="font-mono text-sm font-medium">
                  {formatCompactCurrency(result.miniMarginRequired)}
                </p>
              </div>
            </div>
          </div>
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            cap: accountCapital,
            risk: riskPercentage,
            entry: entryPrice,
            sl: stopLossPrice,
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
            Survival of the Fittest: Why MCX Crude Oil Position Sizing is
            Non-Negotiable
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
              The Multi Commodity Exchange (MCX) of India is home to some of the
              most volatile price action in the world, and Crude Oil is its
              undisputed king. With intraday swings of 100+ points being a
              routine occurrence, retail traders often find themselves wiped out
              within a single session. The primary reason for this isn't wrong
              technical analysis—it is{" "}
              <strong className="font-semibold text-foreground">
                over-leveraging
              </strong>
              .
            </p>
            <p>
              Many traders view margin provided by their broker as a suggestion
              of how many lots they <em className="italic">should</em> trade. In
              reality, the margin is merely a regulatory minimum. True
              professionalism in trading starts with{" "}
              <strong className="font-semibold text-foreground">
                Risk per Trade
              </strong>
              .
            </p>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              1. The 1% Rule: The Professional Benchmark
            </h3>
            <p>
              A professional commodity trader never risks more than 1% or 2% of
              their total account capital on any single trade. If you have a ₹5
              Lakh trading account, your 1% risk limit is ₹5,000. This means if
              your stop-loss hits, your account balance should only drop to
              ₹4,95,000.
            </p>
            <p>
              The problem is that the MCX Crude Oil "Mega" contract has a lot
              size of 100 barrels. If your technical setup requires a 60-point
              stop loss to give the trade "room to breathe," 1 Mega lot would
              result in a ₹6,000 loss—violating your 1% risk rule. This is where
              our calculator becomes your most valuable asset. It forces you to
              see that for a 60-point SL, you{" "}
              <strong className="font-semibold text-foreground">must</strong>{" "}
              drop down to the Mini contract (CRUDEOILM) and trade exactly 8
              mini lots (risking ₹4,800).
            </p>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              2. Margin Sufficiency vs. Risk Allowance
            </h3>
            <p>
              SEBI's peak margin requirements for commodities are strict. For a
              Crude Oil contract trading at ₹6,500, the contract value is ₹6.5
              Lakhs. The exchange blocks approximately 20% to 25% of this as
              margin (SPAN + Exposure). This means you need roughly ₹1.3 Lakhs
              to trade just one lot.
            </p>
            <p>Our calculator performs a dual-check:</p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong className="font-semibold text-foreground">
                  Risk Check:
                </strong>{" "}
                How many lots can your "Risk Capital" afford based on your
                stop-loss points?
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Margin Check:
                </strong>{" "}
                How many lots can your "Wallet" actually afford to buy from the
                broker?
              </li>
            </ul>
            <p>
              The calculator returns the <em className="italic">minimum</em> of
              these two numbers. If your risk allows 5 lots but your capital
              only meets the margin for 2, the tool will strictly suggest 2
              lots.
            </p>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              3. Mega (CRUDEOIL) vs Mini (CRUDEOILM) Dynamics
            </h3>
            <p>
              The introduction of the Mini contract was a game-changer for
              retail risk management in India.
            </p>
            <div className="my-8 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    Mega Contract
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Lot size of 100. ₹100 profit/loss per point move. Best for
                    accounts above ₹10 Lakhs or for high-conviction trades with
                    very tight stop losses.
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    Mini Contract
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Lot size of 10. ₹10 profit/loss per point move. Essential
                    for small accounts or when market volatility requires very
                    wide stop losses.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              4. Surviving High-Volatility Events
            </h3>
            <p>
              Trading during the US Energy Information Administration (EIA)
              inventory releases or during geopolitical tensions in the Middle
              East requires extreme caution. Volatility often spikes, requiring
              you to widen your stop losses to 80-100 points to avoid being
              "whipsawed" by market noise.
            </p>
            <p>
              When volatility increases, your position size{" "}
              <strong className="font-semibold text-foreground">must</strong>{" "}
              decrease. Use this calculator live during the evening sessions to
              adjust your sizing. If you widen your stop loss from 40 to 80
              points, you must cut your number of lots in half to keep your
              absolute rupee risk identical.
            </p>

            <div className="my-8 rounded-2xl border border-fc-gain/20 bg-fc-gain-bg p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-fc-gain-text text-muted-foreground uppercase">
                Maximize Your Edge
              </h4>
              <p className="text-fc-gain-text">
                Position sizing is the only part of trading you have 100%
                control over. The market decides the move, but you decide the
                damage. Combine this sizing logic with our{" "}
                <a
                  href="/blog/mcx-crude-oil-intraday-trading-strategy"
                  className="font-bold underline"
                >
                  MCX Crude Oil Strategy
                </a>{" "}
                to build a sustainable trading career.
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
            Position sizing is only one pillar of trading success. To build a
            consistent edge in the MCX market, you must understand the "Golden
            Window" of institutional liquidity and the highly profitable
            Wednesday EIA inventory play.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/mcx-crude-oil-intraday-trading-strategy"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              MCX Crude Oil Strategy: The Professional Blueprint
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
            name: "MCX Crude Oil Position Sizer",
            url: "https://financechk.com/tools/mcx-crude-position-sizer",
            description:
              "The definitive risk management tool for MCX Crude Oil. Calculate exact lot sizes for Mega and Mini contracts based on your account capital and stop loss.",
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
            name: "How to calculate position size for MCX Crude Oil",
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
