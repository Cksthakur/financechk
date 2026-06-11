import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type { AssetClass } from "@/lib/calculators/capital-gains"
import {
  AVAILABLE_FYS,
  calculateCapitalGains,
} from "@/lib/calculators/capital-gains"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/ltcg-stcg-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "LTCG STCG Tax Calculator 2026-27 | Capital Gains on Equity, Mutual Funds & Property",
      description:
        "Calculate long-term and short-term capital gains tax using updated rates, INR 1.25L equity LTCG exemption, and grandfathering logic for legacy equity purchases.",
      path: "/tools/ltcg-stcg-calculator",
      keywords: [
        "LTCG STCG tax calculator India",
        "capital gains tax calculator 2026-27",
        "long term capital gains calculator equity India",
        "LTCG calculator mutual fund",
        "STCG 20% calculator India",
        "capital gains tax calculator property India",
        "grandfathering capital gains calculator",
        "LTCG exemption 1.25 lakh calculator",
      ],
    }),
  component: CapitalGainsCalculator,
})

const assetClasses: Array<{ value: AssetClass; label: string }> = [
  { value: "equity", label: "Stocks & Equity MFs" },
  { value: "debt", label: "Debt Mutual Funds" },
  { value: "real-estate", label: "Real Estate (Property)" },
  { value: "gold", label: "Gold (SGBs, ETFs, Physical)" },
]

const faqs = [
  {
    question: "What is the LTCG tax rate on equity after Budget updates?",
    answer:
      "For listed equity and equity mutual funds, LTCG is generally taxed at 12.5% above the annual exemption threshold. Always confirm the latest Finance Act and CBDT clarifications for filing year specifics.",
  },
  {
    question: "How is the INR 1.25 lakh LTCG exemption applied?",
    answer:
      "The exemption is considered against eligible equity LTCG in aggregate for the year. This calculator applies exemption logic before computing tax for equity LTCG scenarios.",
  },
  {
    question: "What is grandfathering for pre-2018 equity?",
    answer:
      "Grandfathering protects gains accrued up to the notified historical cutoff for eligible equity holdings. This tool supports grandfathered cost handling for older equity assets.",
  },
  {
    question: "Is indexation benefit available on equity LTCG?",
    answer:
      "No. Equity LTCG computation typically does not use indexation. For non-equity assets, treatment can vary by asset class and acquisition period, so verify before filing.",
  },
  {
    question: "How is STCG different from LTCG on mutual funds?",
    answer:
      "Classification depends on holding period and fund category. Once classified, STCG and LTCG are taxed at different rates, and exemption treatment also differs.",
  },
]

const howToSteps = [
  "Select asset type: equity, debt fund, property or gold.",
  "Enter buy value, sell value and quantity where applicable.",
  "Set holding period in months to determine LTCG or STCG classification.",
  "For slab-linked scenarios, select your tax slab rate.",
  "Review gain type, tax rate, exemption impact and post-tax outcome.",
]

function CapitalGainsCalculator() {
  const [financialYear, setFinancialYear] = useState(() => {
    if (typeof window !== "undefined") {
      const fy = new URLSearchParams(window.location.search).get("fy")
      if (fy && AVAILABLE_FYS.includes(fy)) return fy
    }
    return "FY2026-27"
  })
  const [assetClass, setAssetClass] = useState<AssetClass>(() => {
    if (typeof window !== "undefined") {
      const type = new URLSearchParams(window.location.search).get(
        "asset"
      ) as AssetClass
      if (
        type === "equity" ||
        type === "debt" ||
        type === "real-estate" ||
        type === "gold"
      )
        return type
    }
    return "equity"
  })
  const [buyPrice, setBuyPrice] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("buy")) || 1000
      )
    return 1000
  })
  const [sellPrice, setSellPrice] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("sell")) || 1500
      )
    return 1500
  })
  const [quantity, setQuantity] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("qty")) || 1000
      )
    return 1000
  })
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("months")) || 15
      )
    return 15
  })
  const [taxSlabPercentage, setTaxSlabPercentage] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("slab")) || 30
      )
    return 30
  })

  const result = useMemo(
    () =>
      calculateCapitalGains({
        assetClass,
        buyPrice,
        sellPrice,
        quantity,
        holdingPeriodMonths,
        taxSlabPercentage,
        financialYear,
      }),
    [
      assetClass,
      buyPrice,
      sellPrice,
      quantity,
      holdingPeriodMonths,
      taxSlabPercentage,
      financialYear,
    ]
  )

  const isProfit = result.grossGain >= 0

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "LTCG & STCG Tax Calculator" },
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
          Capital Gains Tax Calculator - LTCG 12.5% & STCG 20%
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Use this LTCG STCG tax calculator India investors rely on to estimate
          capital gains tax across equity, mutual funds, property and gold.
        </p>
        <LastUpdated date="April 2026" author="Rajat" />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-foreground">
          Select Financial Year
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVAILABLE_FYS.map((fy) => (
            <button
              key={fy}
              onClick={() => setFinancialYear(fy)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                financialYear === fy
                  ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {fy.replace("FY", "FY ")}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl bg-card p-5 md:p-6"
        style={{
          boxShadow:
            "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
        }}
      >
        <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Investment Details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Asset Class
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {assetClasses.map((ac) => (
                <button
                  key={ac.value}
                  onClick={() => setAssetClass(ac.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    assetClass === ac.value
                      ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {ac.label}
                </button>
              ))}
            </div>
          </div>

          <CurrencyInput
            label="Buy Price (Per Unit/Total)"
            value={buyPrice}
            onChange={setBuyPrice}
            max={10_00_00_000}
          />
          <CurrencyInput
            label="Sell Price (Per Unit/Total)"
            value={sellPrice}
            onChange={setSellPrice}
            max={10_00_00_000}
          />

          {assetClass !== "real-estate" && (
            <div className="sm:col-span-2">
              <CurrencyInput
                label="Quantity (Units/Shares)"
                value={quantity}
                onChange={setQuantity}
                max={10_000_000}
              />
            </div>
          )}

          <SliderField
            label="Holding Period (Months)"
            value={holdingPeriodMonths}
            onChange={setHoldingPeriodMonths}
            min={1}
            max={120}
            step={1}
            formatValue={(v) => `${v} mo`}
          />

          <div
            className={`transition-opacity ${assetClass === "debt" || (assetClass !== "equity" && holdingPeriodMonths <= 24) ? "opacity-100" : "pointer-events-none opacity-30"}`}
          >
            <SliderField
              label="Your Tax Slab"
              value={taxSlabPercentage}
              onChange={setTaxSlabPercentage}
              min={0}
              max={30}
              step={5}
              formatValue={(v) => `${v}%`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-secondary p-4 text-center">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Gain Type
            </p>
            <p
              className={`mt-1 font-mono text-xl font-bold ${result.gainType === "LTCG" ? "text-fc-gain-text" : "text-fc-amber"}`}
            >
              {result.gainType}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-4 text-center">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Tax Rate
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-foreground">
              {result.applicableTaxRate}
            </p>
          </div>
        </div>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: isProfit ? "var(--fc-gain-bg)" : "var(--fc-loss-bg)",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Net {isProfit ? "Profit After Tax" : "Loss (No Tax)"}
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              isProfit ? "text-fc-gain-text" : "text-fc-loss-text"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {isProfit ? "+" : ""}
            {formatCurrency(result.netProfitAfterTax)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Gross Gain: {formatCurrency(result.grossGain)} · Total Tax:{" "}
            <strong className="text-foreground">
              {formatCurrency(result.totalTaxLiability)}
            </strong>
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Total Investment"
            value={formatCompactCurrency(result.totalInvestment)}
            subtitle="Buy value"
          />
          <ResultCard
            label="Total Sale Value"
            value={formatCompactCurrency(result.totalSaleValue)}
            subtitle="Sell value"
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            asset: assetClass,
            buy: buyPrice,
            sell: sellPrice,
            qty: quantity,
            months: holdingPeriodMonths,
            slab: taxSlabPercentage,
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
            The Budget 2024 Paradigm Shift: What Indian Investors Need to Know
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
              The Union Budget 2024, presented on July 23, delivered one of the
              most sweeping and controversial overhauls to capital gains
              taxation in Indian economic history. By streamlining asset classes
              and tax rates, the government sought to simplify the tax code, but
              in doing so, it fundamentally altered the profitability math for
              real estate investors and equity traders.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              1. Equity Taxation: Punishing the Speculator
            </h3>
            <p>
              The Finance Ministry decisively acted to curb the exponential rise
              of retail speculation in the stock market.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong className="font-semibold text-foreground">
                  STCG (Short-Term Capital Gains):
                </strong>{" "}
                If you sell listed shares or equity mutual funds within 12
                months, the tax rate has been hiked from 15% to a punishing{" "}
                <strong className="text-foreground">20%</strong>. This move
                directly targets day traders and short-term momentum players.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  LTCG (Long-Term Capital Gains):
                </strong>{" "}
                For assets held over 12 months, the rate increased from 10% to{" "}
                <strong className="text-foreground">12.5%</strong>. However, the
                government provided a slight cushion by increasing the tax-free
                exemption limit from ₹1 Lakh to{" "}
                <strong className="text-foreground">₹1.25 Lakhs</strong> per
                financial year.
              </li>
            </ul>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              2. The Real Estate Shock: The End of Indexation
            </h3>
            <p>
              The most significant change was the complete removal of the
              "Indexation" benefit for property sales. Historically, sellers
              could adjust their original purchase price for inflation using the
              Cost Inflation Index (CII), which drastically reduced the taxable
              profit.
            </p>
            <p>
              Now, you pay a flat{" "}
              <strong className="font-semibold text-foreground">
                12.5% tax
              </strong>{" "}
              on the absolute nominal difference between your buy and sell
              price. While the rate dropped from 20%, the inability to index for
              inflation means that for properties held for a long time (10+
              years), the absolute tax liability can be significantly higher
              under the new regime.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              3. Grandfathering Clauses for Older Properties
            </h3>
            <p>
              Following massive public pushback, the government introduced a
              crucial relief measure for properties acquired before{" "}
              <strong className="font-semibold text-foreground">
                July 23, 2024
              </strong>
              . If you are an individual or HUF, you are legally allowed to
              calculate your tax under both systems—the old 20% with indexation
              and the new 12.5% without indexation—and{" "}
              <strong className="text-foreground">
                choose whichever results in a lower tax liability
              </strong>
              .
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              4. Debt Mutual Funds: Always Short-Term
            </h3>
            <p>
              If you invest in Debt Mutual Funds (with ≤35% equity exposure)
              bought on or after April 1, 2023, the gains are no longer eligible
              for indexation or LTCG rates, regardless of how long you hold
              them. They are treated entirely as{" "}
              <strong className="font-semibold text-foreground">
                Short-Term Capital Gains
              </strong>{" "}
              and are added to your total income, taxed at your marginal income
              tax slab rate (10%, 20%, or 30%).
            </p>

            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Important: Capital Loss Set-Off Rules
              </h4>
              <p className="text-foreground">
                Don't forget that you can set off your losses! A Short-Term
                Capital Loss (STCL) can be adjusted against both STCG and LTCG.
                However, a Long-Term Capital Loss (LTCL) can{" "}
                <strong className="font-bold">only</strong> be adjusted against
                Long-Term Capital Gains. You can carry forward these losses for
                8 consecutive assessment years, provided you file your ITR on
                time.
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
            The Budget 2024 has rewritten the rules of wealth creation in India.
            Whether you are selling property or rebalancing your stock
            portfolio, understanding holding periods and set-off rules is vital
            for tax optimization.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/stock-market-capital-gains-tax-guide-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Direct Stock Market Taxation: The 2025 STCG & LTCG Guide
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
              Mutual Fund Tax Rules 2025: Navigating the 12.5% Rate
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
            name: "LTCG STCG Tax Calculator",
            url: "https://financechk.com/tools/ltcg-stcg-calculator",
            description:
              "Calculate capital gains tax for equity, mutual funds, property and gold with LTCG/STCG classification, exemption logic and FY-aware assumptions.",

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
            name: "How to calculate capital gains tax in India",
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
