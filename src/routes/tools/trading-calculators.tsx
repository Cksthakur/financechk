import { Link, createFileRoute } from "@tanstack/react-router"
import {
  IconArrowLeft,
  IconCalculator,
  IconChartBar,
  IconTrendingUp,
} from "@tabler/icons-react"
import { FAQSection } from "@/components/finance/faq-section"
import { ToolLongformHowTo } from "@/components/finance/tool-longform-howto"
import { ToolCard } from "@/components/finance/tool-card"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/trading-calculators")({
  head: () =>
    generateSeoMeta({
      title: "Trading Calculators India - STT, Brokerage, F&O, Options",
      description:
        "Free online trading calculators for India. Calculate STT, brokerage, break-even points, options premium, and intraday margins.",
      path: "/tools/trading-calculators",
    }),
  component: TradingCalculatorsPage,
})

const tradingTools = [
  {
    title: "STT & Brokerage Calculator",
    description:
      "Calculate exact net profit and break-even points for F&O and equity trading.",
    href: "/tools/stt-brokerage-calculator",
    icon: <IconTrendingUp className="size-5" />,
    category: "Trading",
  },
  {
    title: "STT Calculator",
    description:
      "Calculate Securities Transaction Tax for equity delivery, intraday, futures and options scenarios.",
    href: "/tools/stt-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Trading",
  },
  {
    title: "F&O Brokerage Calculator",
    description:
      "Estimate complete futures and options charges with break-even points and percentages.",
    href: "/tools/fo-brokerage-calculator",
    icon: <IconTrendingUp className="size-5" />,
    category: "Trading",
  },
  {
    title: "Brokerage Comparison Tool",
    description:
      "Compare brokerage across Zerodha, Groww, Angel One, ICICI Direct, HDFC.",
    href: "/tools/brokerage-comparison-tool",
    icon: <IconChartBar className="size-5" />,
    category: "Trading",
  },
  {
    title: "MCX Crude Position Sizer",
    description:
      "Calculate exact position size for MCX crude oil futures with risk management.",
    href: "/tools/mcx-crude-position-sizer",
    icon: <IconCalculator className="size-5" />,
    category: "Trading",
  },
  {
    title: "MCX Commodity Margin Calculator",
    description:
      "Estimate SPAN + exposure margin, tick-wise P&L and charges for MCX commodity contracts.",
    href: "/tools/mcx-commodity-margin-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Trading",
  },
]

const tradingHubFaqs = [
  {
    question:
      "Which trading calculator should I use first before entering a trade?",
    answer:
      "Start with position sizing and then check all-in charges using brokerage and STT tools. This sequence helps you validate both risk per trade and realistic net outcome.",
  },
  {
    question: "Why is charge estimation critical for short-term traders?",
    answer:
      "In high-frequency or low-target setups, STT and brokerage can consume a large part of gross P&L. Pre-trade charge visibility prevents overestimating strategy edge.",
  },
  {
    question: "Can these tools help with F&O break-even planning?",
    answer:
      "Yes. Use F&O brokerage and STT calculators together to estimate break-even movement and realistic profit after statutory and broker-level charges.",
  },
  {
    question: "How often should I review assumptions in trading calculators?",
    answer:
      "Review whenever exchange or tax rules change, and at least monthly for brokerage plans, lot-size updates, and strategy-level execution costs.",
  },
  {
    question:
      "Do these calculators replace broker contract-note reconciliation?",
    answer:
      "No. Use them for planning and pre-trade scenario checks. Always reconcile final values with your broker contract notes for accounting and tax filing.",
  },
]

function TradingCalculatorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-(--fc-page-width) px-5 py-8 md:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft className="size-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <IconTrendingUp className="size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Trading Calculators
              </h1>
              <p className="text-muted-foreground">
                6 calculators for equity, F&O and commodity trading
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tradingTools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>

        <section className="mt-14">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "34px",
              letterSpacing: "normal",
              lineHeight: 1.12,
            }}
          >
            Trade planning is a cost-control problem first, signal problem
            second
          </h2>

          <div
            className="mt-5 flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              Most active traders focus on entry quality but underestimate the
              drag from charges. In real execution, your net profitability is
              driven by the combination of strike selection, lot size, turnover,
              STT, brokerage, and slippage. A setup that looks profitable before
              charges may become unviable after cost layers are applied.
            </p>
            <p>
              This category helps you model that full picture before trade
              entry. Use STT and brokerage calculators to estimate net outcomes,
              position-sizing tools to cap per-trade risk, and comparison tools
              to optimize broker selection for your activity pattern.
            </p>
            <p>
              Consistent traders usually treat calculators as a pre-trade
              checklist: define max risk, estimate total charges, confirm
              break-even, then execute. That process reduces emotional trades
              and improves strategy discipline over time.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Pre-trade checklist
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Define maximum rupee risk per trade before lot selection.
                </li>
                <li>
                  Calculate expected charges for base and stressed turnover.
                </li>
                <li>
                  Validate break-even movement against your strategy target.
                </li>
                <li>Check whether post-cost reward still justifies risk.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Common P&amp;L leakage points
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Ignoring STT differences across delivery, intraday, and
                  F&amp;O.
                </li>
                <li>Using fixed lot size regardless of volatility regime.</li>
                <li>
                  Judging strategy on gross P&amp;L instead of net contract-note
                  P&amp;L.
                </li>
                <li>
                  Not updating assumptions after brokerage plan or rule changes.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <FAQSection items={tradingHubFaqs} />
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-muted/50 p-6">
          <h2 className="mb-3 text-lg font-semibold">Related Categories</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/tools/investment-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconChartBar className="size-4" />
              Investment
            </Link>
            <Link
              to="/tools/tax-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconCalculator className="size-4" />
              Tax Calculators
            </Link>
          </div>
        </div>

        <section className="mt-14">
          <ToolLongformHowTo
            toolName="Trading Calculators"
            category="trading"
            updated="April 2026"
          />
        </section>
      </div>
    </div>
  )
}
