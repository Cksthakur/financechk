import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import type {
  McxCommodity,
  McxTradeType,
} from "@/lib/calculators/mcx-commodity-margin"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateMcxCommodityMargin } from "@/lib/calculators/mcx-commodity-margin"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/mcx-commodity-margin-calculator")({
  head: () =>
    generateSeoMeta({
      title: "MCX Margin Calculator | CRUDEOILM, Gold, Silver P&L",
      description:
        "Calculate MCX SPAN + exposure margin, P&L per tick and trading charges for CRUDEOILM, Gold, Silver and Natural Gas.",
      path: "/tools/mcx-commodity-margin-calculator",
      keywords: [
        "MCX margin calculator",
        "CRUDEOILM margin calculator",
        "MCX crude oil lot size margin",
        "MCX commodity lot size calculator",
        "MCX P&L per tick calculator",
        "MCX commodity brokerage calculator",
      ],
    }),
  component: McxCommodityMarginCalculatorPage,
})

const commodityDefaults: Record<
  McxCommodity,
  {
    label: string
    lotSize: number
    tickValuePerLot: number
    defaultPrice: number
  }
> = {
  crudeoilm: {
    label: "CRUDEOILM",
    lotSize: 10,
    tickValuePerLot: 10,
    defaultPrice: 6500,
  },
  crudeoil: {
    label: "Crude Oil",
    lotSize: 100,
    tickValuePerLot: 100,
    defaultPrice: 6500,
  },
  gold: {
    label: "Gold",
    lotSize: 1000,
    tickValuePerLot: 100,
    defaultPrice: 7200,
  },
  "gold-mini": {
    label: "Gold Mini",
    lotSize: 100,
    tickValuePerLot: 10,
    defaultPrice: 7200,
  },
  silver: {
    label: "Silver",
    lotSize: 30,
    tickValuePerLot: 30,
    defaultPrice: 82000,
  },
  "silver-mini": {
    label: "Silver Mini",
    lotSize: 5,
    tickValuePerLot: 5,
    defaultPrice: 82000,
  },
  "natural-gas": {
    label: "Natural Gas",
    lotSize: 1250,
    tickValuePerLot: 125,
    defaultPrice: 230,
  },
}

const faqs = [
  {
    question: "What is the lot size of CRUDEOILM mini on MCX?",
    answer:
      "This calculator uses 10 barrels as CRUDEOILM mini lot size based on the provided data notes. Always confirm contract specs from your broker terminal on trade day.",
  },
  {
    question: "How much margin is needed for 1 lot of MCX Gold Mini?",
    answer:
      "Margin depends on current SPAN and exposure percentages. Enter live percentages from your broker margin screen to get a practical total margin estimate.",
  },
  {
    question: "How is P&L calculated per tick on MCX crude oil?",
    answer:
      "P&L per tick = tick value per lot × number of lots. For CRUDEOILM, 1 rupee move per barrel with lot 10 gives INR 10 per tick per lot.",
  },
  {
    question: "What are total charges for MCX commodity trading?",
    answer:
      "This tool aggregates brokerage, CTT estimate and other charges entered by you. Final bill can vary by broker and exchange circular updates.",
  },
  {
    question: "Does STT apply to MCX commodity derivatives?",
    answer:
      "Commodity derivatives use CTT (Commodity Transaction Tax) treatment for relevant contracts, not equity STT logic. This page uses CTT estimate for sell-side turnover.",
  },
]

const howToSteps = [
  "Select commodity contract (CRUDEOILM, Gold Mini, Silver Mini, etc.).",
  "Enter lots, entry price and optional exit price.",
  "Set SPAN and exposure margin percentages from broker platform.",
  "Review margin requirement, P&L per tick and realized P&L.",
  "Check total charges and post-charge net output before execution.",
]

function McxCommodityMarginCalculatorPage() {
  const [commodity, setCommodity] = useState<McxCommodity>(() => {
    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("commodity")
      if (value && value in commodityDefaults) return value as McxCommodity
    }
    return "crudeoilm"
  })

  const [lots, setLots] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("lots")) || 1
      )
    }
    return 1
  })

  const [entryPrice, setEntryPrice] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("entry")) || 6500
      )
    }
    return 6500
  })

  const [exitPrice, setExitPrice] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("exit")) || 6550
      )
    }
    return 6550
  })

  const [tradeType, setTradeType] = useState<McxTradeType>(() => {
    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("type")
      if (value === "overnight" || value === "positional") return value
    }
    return "intraday"
  })

  const [spanMarginPercent, setSpanMarginPercent] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("span")) || 8
      )
    }
    return 8
  })

  const [exposureMarginPercent, setExposureMarginPercent] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("exposure")) || 5
      )
    }
    return 5
  })

  const [brokeragePerOrder, setBrokeragePerOrder] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("brokerage")) ||
        20
      )
    }
    return 20
  })

  const [otherCharges, setOtherCharges] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("other")) || 20
      )
    }
    return 20
  })

  const defaults = commodityDefaults[commodity]

  const result = useMemo(
    () =>
      calculateMcxCommodityMargin({
        commodity,
        lots,
        lotSize: defaults.lotSize,
        tickValuePerLot: defaults.tickValuePerLot,
        entryPrice,
        exitPrice,
        tradeType,
        spanMarginPercent,
        exposureMarginPercent,
        brokeragePerOrder,
        otherCharges,
      }),
    [
      commodity,
      lots,
      defaults,
      entryPrice,
      exitPrice,
      tradeType,
      spanMarginPercent,
      exposureMarginPercent,
      brokeragePerOrder,
      otherCharges,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "MCX Commodity Margin Calculator" },
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
          MCX Commodity Margin & P&L Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Use this MCX margin calculator to estimate SPAN + exposure margin,
          tick-wise P&L and commodity trade charges for crude, gold, silver and
          natural gas contracts.
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
          Commodity Trade Inputs
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {(
            Object.entries(commodityDefaults) as Array<
              [McxCommodity, { label: string }]
            >
          ).map(([value, cfg]) => (
            <button
              key={value}
              onClick={() => {
                setCommodity(value)
                setEntryPrice(commodityDefaults[value].defaultPrice)
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                commodity === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Lots"
            value={lots}
            onChange={setLots}
            min={1}
            max={1000}
          />
          <CurrencyInput
            label="Entry Price"
            value={entryPrice}
            onChange={setEntryPrice}
            min={0}
            max={10000000}
          />
          <CurrencyInput
            label="Exit Price"
            value={exitPrice}
            onChange={setExitPrice}
            min={0}
            max={10000000}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Trade Type
            </label>
            <div className="flex flex-wrap gap-2">
              {(["intraday", "overnight", "positional"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setTradeType(v)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    tradeType === v
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <SliderField
            label="SPAN Margin %"
            value={spanMarginPercent}
            onChange={setSpanMarginPercent}
            min={1}
            max={30}
            step={0.5}
            formatValue={(v) => `${v}%`}
          />
          <SliderField
            label="Exposure Margin %"
            value={exposureMarginPercent}
            onChange={setExposureMarginPercent}
            min={0}
            max={30}
            step={0.5}
            formatValue={(v) => `${v}%`}
          />

          <CurrencyInput
            label="Brokerage Per Order"
            value={brokeragePerOrder}
            onChange={setBrokeragePerOrder}
            min={0}
            max={5000}
          />
          <CurrencyInput
            label="Other Charges"
            value={otherCharges}
            onChange={setOtherCharges}
            min={0}
            max={100000}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Margin & P&L Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background:
              result.netPnlAfterCharges !== null &&
              result.netPnlAfterCharges < 0
                ? "var(--fc-loss-bg)"
                : "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total Margin Required
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalMarginRequired)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Contract value: {formatCurrency(result.contractValue)}
          </p>
        </div>

        <ResultGrid cols={4}>
          <ResultCard
            label="Lot Size"
            value={`${result.lotSize}`}
            subtitle={`${commodityDefaults[commodity].label} units/lot`}
          />
          <ResultCard
            label="P&L Per Tick"
            value={formatCompactCurrency(result.pnlPerTick)}
            subtitle="Per 1 tick move"
          />
          <ResultCard
            label="SPAN Margin"
            value={formatCompactCurrency(result.spanMargin)}
          />
          <ResultCard
            label="Exposure Margin"
            value={formatCompactCurrency(result.exposureMargin)}
          />
        </ResultGrid>

        <ResultGrid cols={3} className="mt-3">
          <ResultCard
            label="Brokerage"
            value={formatCompactCurrency(result.brokerage)}
            subtitle="Both orders"
          />
          <ResultCard
            label="CTT Estimate"
            value={formatCompactCurrency(result.ctt)}
            subtitle="Sell side"
          />
          <ResultCard
            label="Total Charges"
            value={formatCompactCurrency(result.totalCharges)}
            subtitle="Brokerage + CTT + others"
            variant="loss"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Realized P&L"
            value={
              result.realizedPnl === null
                ? "Enter exit price"
                : formatCompactCurrency(result.realizedPnl)
            }
            subtitle="Before charges"
          />
          <ResultCard
            label="Net P&L After Charges"
            value={
              result.netPnlAfterCharges === null
                ? "Enter exit price"
                : formatCompactCurrency(result.netPnlAfterCharges)
            }
            subtitle="After estimated charges"
            variant={
              result.netPnlAfterCharges !== null &&
              result.netPnlAfterCharges < 0
                ? "loss"
                : "default"
            }
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            commodity,
            lots,
            entry: entryPrice,
            exit: exitPrice,
            type: tradeType,
            span: spanMarginPercent,
            exposure: exposureMarginPercent,
            brokerage: brokeragePerOrder,
            other: otherCharges,
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
            How this MCX margin calculator works
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
            Latest commodity notes used in this tool
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <ul className="ml-6 list-disc space-y-2">
              <li>CRUDEOILM lot size reference: 10 barrels</li>
              <li>
                CRUDEOILM tick value reference: INR 1/barrel = INR 10 per tick
              </li>
              <li>Gold Mini lot size reference: 100 grams</li>
              <li>Silver Mini lot size reference: 5 kg</li>
              <li>CTT estimate: 0.01% sell-side for non-agri commodities</li>
            </ul>
            <p>
              SPAN and exposure margins are dynamic and updated by exchange and
              brokers. Enter live values from your broker margin window for
              execution-level planning.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Trading Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Combine margin and charge views before commodity execution.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/fo-brokerage-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              F&O Brokerage Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/stt-calculator/{-$tradeType}"
              params={{}}
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              STT Calculator
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
            "@type": "SoftwareApplication",
            name: "MCX Commodity Margin Calculator",
            description:
              "Estimate MCX commodity margin, tick-wise P&L and charges for crude, gold, silver and natural gas contracts.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/mcx-commodity-margin-calculator",

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
