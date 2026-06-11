import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import type { MouseEvent } from "react"
import type { SttTradeType } from "@/lib/calculators/stt"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateStt } from "@/lib/calculators/stt"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

const tradeTypeOptions: Array<{ label: string; value: SttTradeType }> = [
  { label: "Equity Delivery", value: "equity-delivery" },
  { label: "Intraday Equity", value: "intraday-equity" },
  { label: "Futures", value: "futures" },
  { label: "Options Sell", value: "options-sell" },
  { label: "Options Exercise", value: "options-exercise" },
]

const tradeTypeVariantContent: Record<
  SttTradeType,
  {
    heading: string
    intro: string
    schemaName: string
  }
> = {
  "equity-delivery": {
    heading: "STT Calculator for Equity Delivery (0.1% Buy + Sell)",
    intro:
      "Estimate STT on delivery trades across buy and sell legs with precise side-wise breakup and rounded final value.",
    schemaName: "Equity Delivery STT Calculator",
  },
  "intraday-equity": {
    heading: "STT Calculator for Intraday Equity (0.025% Sell Side)",
    intro:
      "Calculate intraday equity STT on sell-side turnover at updated rates with quick taxable-base clarity.",
    schemaName: "Intraday STT Calculator",
  },
  futures: {
    heading: "STT Calculator for Futures (0.05% Sell Side)",
    intro:
      "Compute futures STT at current sell-side rates and compare tax impact across turnover scenarios.",
    schemaName: "Futures STT Calculator",
  },
  "options-sell": {
    heading: "STT Calculator for Options Sell (0.15% on Premium)",
    intro:
      "Estimate STT for option-premium sell trades with accurate taxable base and rounded final payable.",
    schemaName: "Options Sell STT Calculator",
  },
  "options-exercise": {
    heading: "STT Calculator for Options Exercise (0.15% Intrinsic)",
    intro:
      "Calculate STT on exercised options using intrinsic value so your settlement-side tax estimate is reliable.",
    schemaName: "Options Exercise STT Calculator",
  },
}

const defaultSttFormValues = {
  buyValue: 0,
  sellValue: 150000,
  intrinsicValue: 0,
}

const tradeTypeSeoContent: Record<
  SttTradeType,
  {
    title: string
    description: string
    path: string
    keywords: Array<string>
  }
> = {
  "equity-delivery": {
    title: "Equity Delivery STT Calculator 2026 | 0.1% Buy + Sell",
    description:
      "Calculate STT for equity delivery trades at 0.1% on buy and sell turnover with complete side-wise breakup.",
    path: "/tools/stt-calculator/equity-delivery",
    keywords: [
      "equity delivery stt calculator",
      "stt on delivery trades",
      "0.1 percent stt buy sell",
      "delivery trade stt calculation",
    ],
  },
  "intraday-equity": {
    title: "Intraday STT Calculator 2026 | 0.025% Sell Side",
    description:
      "Estimate intraday equity STT at 0.025% on sell-side turnover with instant taxable-base and payable output.",
    path: "/tools/stt-calculator/intraday-equity",
    keywords: [
      "intraday stt calculator",
      "stt on intraday equity",
      "0.025 percent stt intraday",
      "intraday sell side stt",
    ],
  },
  futures: {
    title: "Futures STT Calculator 2026 | 0.05% Sell Side",
    description:
      "Calculate STT on futures sell turnover at 0.05% with clean cost breakdown for F&O planning.",
    path: "/tools/stt-calculator/futures",
    keywords: [
      "futures stt calculator",
      "stt on futures 0.05",
      "fo futures stt calculation",
      "futures sell side stt",
    ],
  },
  "options-sell": {
    title: "Options STT Calculator 2026 | 0.15% on Premium",
    description:
      "Compute STT for options sell trades at 0.15% on premium with updated FY 2026-27 rates.",
    path: "/tools/stt-calculator/options-sell",
    keywords: [
      "options stt calculator india",
      "stt on options premium",
      "0.15 percent options stt",
      "options sell stt calculation",
    ],
  },
  "options-exercise": {
    title: "Options Exercise STT Calculator 2026 | 0.15% Intrinsic",
    description:
      "Estimate exercised-options STT at 0.15% on intrinsic value with accurate rounding and cost visibility.",
    path: "/tools/stt-calculator/options-exercise",
    keywords: [
      "options exercise stt calculator",
      "stt on intrinsic value options",
      "exercised option stt india",
      "how to calculate stt on exercised options",
    ],
  },
}

function isSttTradeType(value: string | undefined): value is SttTradeType {
  return tradeTypeOptions.some((option) => option.value === value)
}

function getTradeTypeSeoContent(tradeType: string | undefined) {
  if (isSttTradeType(tradeType)) {
    return tradeTypeSeoContent[tradeType]
  }

  return {
    title:
      "STT Calculator 2026 - Securities Transaction Tax on Equity, F&O & Intraday",
    description:
      "Calculate STT (Securities Transaction Tax) for FY 2026-27 on equity delivery (0.1%), intraday (0.025%), futures (0.05%) and options (0.15%) at new Budget 2026 rates. Free instant calculator with breakdown.",
    path: "/tools/stt-calculator",
    keywords: [
      "STT calculator",
      "securities transaction tax calculator",
      "STT calculator 2026",
      "F&O STT calculator online",
      "options STT calculator India",
      "futures STT calculator",
      "intraday STT calculator",
      "equity delivery STT calculator",
      "how to calculate STT on options",
      "STT on futures 0.05% calculator",
      "STT rate 2026-27",
      "STT calculator for F&O traders India",
    ],
  }
}

export const Route = createFileRoute("/tools/stt-calculator/{-$tradeType}")({
  beforeLoad: ({ params }) => {
    if (params.tradeType && !isSttTradeType(params.tradeType)) {
      throw notFound()
    }
  },
  head: ({ params }) => {
    const seo = getTradeTypeSeoContent(params.tradeType)

    return generateSeoMeta({
      title: seo.title,
      description: seo.description,
      path: seo.path,
      keywords: seo.keywords,
    })
  },
  component: SttCalculatorPage,
})

const faqs = [
  {
    question: "What is the new STT rate on options from April 2026?",
    answer:
      "From April 2026, options STT increased to 0.15% on premium (up from 0.1%). For exercised options, STT is 0.15% on intrinsic value. Use this calculator to compute accurate STT for your options trades.",
  },
  {
    question: "How is STT calculated on futures sell side?",
    answer:
      "For futures, STT is charged only on the sell side at 0.05% (increased from 0.02% in Budget 2026). The buy side has no STT. Enter your sell turnover to calculate exact STT payable.",
  },
  {
    question: "Is STT charged on both buy and sell for equity delivery?",
    answer:
      "Yes, for equity delivery trades, STT is charged at 0.1% on BOTH buy and sell turnover. This is why delivery trades have higher STT cost than intraday. Use this calculator to estimate both legs.",
  },
  {
    question: "Can STT be claimed as a tax deduction?",
    answer:
      "STT is not a deduction under Income Tax Act. However, if classified as business income, STT paid can be added to cost of acquisition. Consult your CA for treatment in your ITR.",
  },
  {
    question: "Does STT apply to commodity derivatives on MCX?",
    answer:
      "No, MCX commodity derivatives use GST-based taxes, not STT. This calculator covers NSE equity and index F&O. For MCX, check your broker for commodity-specific charges.",
  },
]

const howToSteps = [
  "Choose trade type: equity delivery, intraday, futures, options sell, or options exercise.",
  "Enter trade values from your order or broker contract note.",
  "For options exercise, enter intrinsic value to compute exercise-side STT.",
  "Review rate, taxable base, buy-side and sell-side STT breakup.",
  "Compare scenarios using shared links before placing your next trade.",
]

function SttCalculatorPage() {
  const { tradeType } = Route.useParams()
  const hasVariantPath = isSttTradeType(tradeType)
  const selectedTradeType: SttTradeType = hasVariantPath
    ? tradeType
    : "options-sell"
  const seoContent = getTradeTypeSeoContent(tradeType)
  const currentPagePath = seoContent.path

  const pageHeading = hasVariantPath
    ? tradeTypeVariantContent[selectedTradeType].heading
    : "STT Calculator - Updated F&O Rates from 1 April 2026"
  const pageIntro = hasVariantPath
    ? tradeTypeVariantContent[selectedTradeType].intro
    : "Use this securities transaction tax calculator to estimate STT on equity delivery, intraday, futures and options with clear side-wise visibility."

  const [buyValue, setBuyValue] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("buy")) ||
        defaultSttFormValues.buyValue
      )
    }

    return defaultSttFormValues.buyValue
  })

  const [sellValue, setSellValue] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("sell")) ||
        defaultSttFormValues.sellValue
      )
    }

    return defaultSttFormValues.sellValue
  })

  const [intrinsicValue, setIntrinsicValue] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("intrinsic")) ||
        defaultSttFormValues.intrinsicValue
      )
    }

    return defaultSttFormValues.intrinsicValue
  })

  const isFormDirty =
    buyValue !== defaultSttFormValues.buyValue ||
    sellValue !== defaultSttFormValues.sellValue ||
    intrinsicValue !== defaultSttFormValues.intrinsicValue

  const handleVariantSwitch = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.pathname === window.location.pathname) {
      return
    }

    if (!isFormDirty) {
      return
    }

    const shouldContinue = window.confirm(
      "You have unsaved inputs. Switching STT segment will clear the current form. Continue?"
    )

    if (!shouldContinue) {
      event.preventDefault()
    }
  }

  const result = useMemo(
    () =>
      calculateStt({
        tradeType: selectedTradeType,
        buyValue,
        sellValue,
        intrinsicValue,
      }),
    [selectedTradeType, buyValue, sellValue, intrinsicValue]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "STT Calculator" },
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
          {pageHeading}
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          {pageIntro}
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

        <div className="mb-5 flex flex-wrap gap-2">
          {tradeTypeOptions.map((option) => (
            <Link
              key={option.value}
              to="/tools/stt-calculator/{-$tradeType}"
              params={{ tradeType: option.value }}
              onClick={handleVariantSwitch}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedTradeType === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {selectedTradeType === "equity-delivery" && (
            <CurrencyInput
              label="Buy Value"
              value={buyValue}
              onChange={setBuyValue}
              min={0}
              max={500000000}
            />
          )}

          {selectedTradeType !== "options-exercise" && (
            <CurrencyInput
              label="Sell Value"
              value={sellValue}
              onChange={setSellValue}
              min={0}
              max={500000000}
              className={
                selectedTradeType === "equity-delivery" ? "" : "sm:col-span-2"
              }
            />
          )}

          {selectedTradeType === "options-exercise" && (
            <CurrencyInput
              label="Intrinsic Value"
              value={intrinsicValue}
              onChange={setIntrinsicValue}
              min={0}
              max={500000000}
              className="sm:col-span-2"
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          STT Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total STT
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalStt)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.totalStt)}
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Rate"
            value={`${result.ratePercent}%`}
            subtitle="Applied STT rate"
          />
          <ResultCard
            label="Buy-side STT"
            value={formatCompactCurrency(result.buySideStt)}
            subtitle="Applicable for delivery"
          />
          <ResultCard
            label="Sell-side STT"
            value={formatCompactCurrency(result.sellSideStt)}
            subtitle="As per segment rules"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Taxable Base"
            value={formatCompactCurrency(result.taxableBase)}
            subtitle="Value used for STT"
          />
          <ResultCard
            label="Rounding"
            value={result.roundingNote}
            subtitle="Computation note"
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            buy: buyValue,
            sell: sellValue,
            intrinsic: intrinsicValue,
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
            Securities transaction tax calculator coverage
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
              This STT calculator is built for high-intent use cases such as
              "futures STT calculator", "options STT calculator India", and
              "intraday STT calculator". It helps traders validate statutory
              deductions before checking net P&amp;L.
            </p>
            <p>
              If you are searching for an F&amp;O STT calculator online, use
              this page to compare sell-side tax impact across futures and
              options, then connect results with brokerage and total charges
              tools.
            </p>
            <p>
              For filing and reconciliation, match the final amount with your
              contract-note rounding method. Small differences may occur based
              on leg-level versus aggregate-level rounding.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Trading & Tax Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Use these tools to account for full trade-level costs.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/stt-brokerage-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              STT & Brokerage Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/fo-brokerage-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              F&O Brokerage Calculator
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
            name: hasVariantPath
              ? tradeTypeVariantContent[selectedTradeType].schemaName
              : "STT Calculator 2026",
            url: `https://financechk.com${currentPagePath}`,
            description: seoContent.description,
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
