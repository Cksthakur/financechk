import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import type {
  BrokerageModel,
  Exchange,
  FoInstrumentType,
} from "@/lib/calculators/fo-brokerage"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { SliderField } from "@/components/finance/slider-field"
import { calculateFoBrokerage } from "@/lib/calculators/fo-brokerage"
import { formatCompactCurrency, formatPercent } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/fo-brokerage-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "F&O Brokerage Calculator India | Futures & Options Charges - STT, GST, SEBI, Exchange",
      description:
        "Calculate total futures and options trading cost including brokerage, STT, exchange charges, SEBI fee, GST and stamp duty with break-even movement.",
      path: "/tools/fo-brokerage-calculator",
      keywords: [
        "F&O brokerage calculator",
        "futures options brokerage calculator India",
        "options trading charges calculator",
        "NSE F&O transaction charges calculator",
        "total trading cost F&O India",
        "GST on F&O brokerage calculator",
        "Nifty options brokerage calculator",
      ],
    }),
  component: FoBrokerageCalculatorPage,
})

const faqs = [
  {
    question: "What are all the charges when buying Nifty options?",
    answer:
      "It includes brokerage, STT, exchange transaction charge, SEBI fee, GST and stamp duty so you can see the all-in trade cost.",
  },
  {
    question: "How is STT calculated on options in 2026?",
    answer:
      "Options STT is applied on sell-side premium turnover in this model. Check updated official circulars periodically because regulatory rates can change.",
  },
  {
    question: "Does stamp duty vary by state for F&O trades?",
    answer:
      "Yes, stamp duty treatment can vary by segment and jurisdiction. This calculator gives a practical estimate, but broker contract note remains final reference.",
  },
  {
    question: "What is the SEBI turnover fee rate on F&O?",
    answer:
      "SEBI turnover fee is modeled as a small per-turnover regulatory cost and added into total charges with brokerage, exchange and taxes.",
  },
  {
    question: "How much does one lot of Nifty futures cost in charges?",
    answer:
      "Enter lot-adjusted quantity, buy price and sell price. The calculator instantly returns all-in charges and break-even points for that trade setup.",
  },
]

const howToSteps = [
  "Select futures or options segment.",
  "Enter buy price, sell price and total quantity (lot-adjusted).",
  "Pick exchange and brokerage model (flat or percentage).",
  "Tune brokerage inputs to match your broker plan.",
  "Review total charges, net P&L and break-even in points and percent.",
]

function FoBrokerageCalculatorPage() {
  const [instrumentType, setInstrumentType] = useState<FoInstrumentType>(() => {
    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("segment")
      if (value === "futures") return "futures"
    }
    return "options"
  })

  const [buyPrice, setBuyPrice] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("buy")) || 210
      )
    }
    return 210
  })

  const [sellPrice, setSellPrice] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("sell")) || 235
      )
    }
    return 235
  })

  const [quantity, setQuantity] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("qty")) || 750
      )
    }
    return 750
  })

  const [exchange, setExchange] = useState<Exchange>(() => {
    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("exchange")
      if (value === "bse") return "bse"
    }
    return "nse"
  })

  const [brokerageModel, setBrokerageModel] = useState<BrokerageModel>(() => {
    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("brokerage")
      if (value === "percent") return "percent"
    }
    return "flat"
  })

  const [brokerageFlatPerOrder, setBrokerageFlatPerOrder] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("flat")) || 20
      )
    }
    return 20
  })

  const [brokeragePercentPerOrder, setBrokeragePercentPerOrder] = useState(
    () => {
      if (typeof window !== "undefined") {
        return (
          Number(new URLSearchParams(window.location.search).get("percent")) ||
          0.03
        )
      }
      return 0.03
    }
  )

  const result = useMemo(
    () =>
      calculateFoBrokerage({
        instrumentType,
        buyPrice,
        sellPrice,
        quantity,
        brokerageModel,
        brokerageFlatPerOrder,
        brokeragePercentPerOrder,
        exchange,
      }),
    [
      instrumentType,
      buyPrice,
      sellPrice,
      quantity,
      brokerageModel,
      brokerageFlatPerOrder,
      brokeragePercentPerOrder,
      exchange,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "F&O Brokerage Calculator" },
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
          F&O Charges Calculator - All-in Trading Cost for Futures & Options
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Use this futures options brokerage calculator India traders use to
          estimate total trading cost before executing positions.
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
          Trade Inputs
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              ["futures", "Futures"],
              ["options", "Options"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setInstrumentType(value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                instrumentType === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Buy Price"
            value={buyPrice}
            onChange={setBuyPrice}
            min={0}
            max={1000000}
          />
          <CurrencyInput
            label="Sell Price"
            value={sellPrice}
            onChange={setSellPrice}
            min={0}
            max={1000000}
          />
          <CurrencyInput
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={10000000}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Exchange
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["nse", "NSE"],
                  ["bse", "BSE"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setExchange(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    exchange === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="pt-4 sm:col-span-2"
            style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
          >
            <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Brokerage settings
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {(
                [
                  ["flat", "Flat"],
                  ["percent", "Percent"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setBrokerageModel(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    brokerageModel === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <CurrencyInput
                label="Flat Brokerage per Order"
                value={brokerageFlatPerOrder}
                onChange={setBrokerageFlatPerOrder}
                min={0}
                max={20}
              />
              <SliderField
                label="Percentage Brokerage per Order"
                value={brokeragePercentPerOrder}
                onChange={setBrokeragePercentPerOrder}
                min={0}
                max={0.2}
                step={0.005}
                formatValue={(v) => `${v.toFixed(3)}%`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Charges Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background:
              result.netPnL >= 0 ? "var(--fc-gain-bg)" : "var(--fc-loss-bg)",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Net P&L after charges
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              result.netPnL >= 0 ? "text-fc-gain-text" : "text-fc-loss-text"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.netPnL)}
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Total Charges"
            value={formatCompactCurrency(result.totalCharges)}
            subtitle="All-in trading cost"
            variant="loss"
          />
          <ResultCard
            label="Brokerage"
            value={formatCompactCurrency(result.brokerage)}
            subtitle="Buy + sell orders"
          />
          <ResultCard
            label="STT"
            value={formatCompactCurrency(result.stt)}
            subtitle="Segment-specific"
          />
        </ResultGrid>

        <ResultGrid cols={4} className="mt-3">
          <ResultCard
            label="Exchange"
            value={formatCompactCurrency(result.exchangeCharge)}
          />
          <ResultCard
            label="SEBI"
            value={formatCompactCurrency(result.sebiCharge)}
          />
          <ResultCard label="GST" value={formatCompactCurrency(result.gst)} />
          <ResultCard
            label="Stamp Duty"
            value={formatCompactCurrency(result.stampDuty)}
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Break-even (Points)"
            value={result.breakEvenPoints.toFixed(2)}
            subtitle="Required move per unit"
          />
          <ResultCard
            label="Break-even (%)"
            value={formatPercent(result.breakEvenPercent, 2)}
            subtitle="On buy price"
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            segment: instrumentType,
            buy: buyPrice,
            sell: sellPrice,
            qty: quantity,
            exchange,
            brokerage: brokerageModel,
            flat: brokerageFlatPerOrder,
            percent: brokeragePercentPerOrder,
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
            F&amp;O transaction charges calculator detail
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
              This F&amp;O brokerage calculator targets high-intent queries like
              "options trading charges calculator" and "NSE F&amp;O transaction
              charges calculator". It consolidates statutory and broker costs in
              one view.
            </p>
            <p>
              Instead of checking brokerage and taxes separately, you get one
              all-in charge number with break-even movement. That helps with
              position sizing, scalping thresholds and strategy viability.
            </p>
            <p>
              For execution-grade validation, compare calculator output with
              your broker contract note and exchange updates.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Trading Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Combine this with cost and tax tools for realistic strategy
            planning.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/stt-calculator/{-$tradeType}"
              params={{}}
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              STT Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/stt-brokerage-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              STT & Brokerage Calculator
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
            "@type": "WebApplication",
            name: "F&O Brokerage Calculator",
            url: "https://financechk.com/tools/fo-brokerage-calculator",
            description:
              "Estimate complete futures and options charges and break-even movement.",

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
