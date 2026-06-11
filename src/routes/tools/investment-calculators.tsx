import { Link, createFileRoute } from "@tanstack/react-router"
import {
  IconArrowLeft,
  IconCalculator,
  IconChartBar,
  IconCoins,
  IconPigMoney,
  IconShieldCheck,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react"
import { FAQSection } from "@/components/finance/faq-section"
import { ToolLongformHowTo } from "@/components/finance/tool-longform-howto"
import { ToolCard } from "@/components/finance/tool-card"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/investment-calculators")({
  head: () =>
    generateSeoMeta({
      title: "Investment Calculators India - SIP, FD, RD, PPF, Lumpsum",
      description:
        "Free online investment calculators for India. Calculate SIP returns, FD maturity, RD savings, PPF, and lumpsum investment growth.",
      path: "/tools/investment-calculators",
    }),
  component: InvestmentCalculatorsPage,
})

const investmentTools = [
  {
    title: "Compound Interest Calculator",
    description:
      "Calculate compound interest on FDs, PPF, savings accounts. Compare different compounding frequencies.",
    href: "/tools/compound-interest-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Investment",
  },
  {
    title: "PPF Calculator",
    description:
      "Calculate Public Provident Fund maturity amount with 7.1% tax-free returns. EEE tax benefits.",
    href: "/tools/ppf-calculator",
    icon: <IconShieldCheck className="size-5" />,
    category: "Investment",
  },
  {
    title: "EPF Calculator",
    description:
      "Calculate Employees' Provident Fund balance with 8.25% tax-free returns. Includes VPF options.",
    href: "/tools/epf-calculator",
    icon: <IconShieldCheck className="size-5" />,
    category: "Investment",
  },
  {
    title: "EPF / VPF Calculator",
    description:
      "Project PF corpus at retirement with salary increment, employer split and voluntary PF top-up.",
    href: "/tools/epf-vpf-calculator",
    icon: <IconShieldCheck className="size-5" />,
    category: "Investment",
  },
  {
    title: "SIP Calculator",
    description:
      "Calculate future value of monthly mutual fund investments with compound interest.",
    href: "/tools/sip-calculator",
    icon: <IconPigMoney className="size-5" />,
    category: "Investment",
  },
  {
    title: "SIP Calculator ₹1,000 Monthly",
    description:
      "Start investing with just ₹1,000/month. See your wealth grow over time.",
    href: "/tools/sip-calculator-1000-monthly",
    icon: <IconWallet className="size-5" />,
    category: "Investment",
  },
  {
    title: "SIP Calculator ₹10,000 Monthly",
    description:
      "Calculate returns on ₹10,000 monthly SIP. Perfect for mid-income investors.",
    href: "/tools/sip-calculator-10000-monthly",
    icon: <IconWallet className="size-5" />,
    category: "Investment",
  },
  {
    title: "Step-up SIP Calculator",
    description:
      "Calculate SIP returns with annual increase in investment amount.",
    href: "/tools/step-up-sip-calculator",
    icon: <IconTrendingUp className="size-5" />,
    category: "Investment",
  },
  {
    title: "Lumpsum Calculator",
    description: "Calculate one-time investment growth with compound interest.",
    href: "/tools/lumpsum-calculator",
    icon: <IconChartBar className="size-5" />,
    category: "Investment",
  },
  {
    title: "Fixed Deposit Calculator",
    description:
      "Calculate FD maturity value with quarterly compounding used by Indian banks.",
    href: "/tools/fd-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Investment",
  },
  {
    title: "SBI FD Calculator",
    description:
      "Calculate SBI Fixed Deposit returns with current interest rates.",
    href: "/tools/fd-calculator-sbi",
    icon: <IconCalculator className="size-5" />,
    category: "Investment",
  },
  {
    title: "HDFC FD Calculator",
    description: "Calculate HDFC Bank FD returns with senior citizen rates.",
    href: "/tools/fd-calculator-hdfc",
    icon: <IconCalculator className="size-5" />,
    category: "Investment",
  },
  {
    title: "Recurring Deposit Calculator",
    description:
      "Calculate RD maturity with monthly deposits and quarterly compounding.",
    href: "/tools/rd-calculator",
    icon: <IconPigMoney className="size-5" />,
    category: "Investment",
  },
  {
    title: "SWP Calculator",
    description: "Calculate systematic withdrawal plan for retirement income.",
    href: "/tools/swp-calculator",
    icon: <IconTrendingUp className="size-5" />,
    category: "Investment",
  },
  {
    title: "ELSS Calculator",
    description:
      "Calculate Section 80C tax savings and long-term corpus from ELSS SIP investing.",
    href: "/tools/elss-calculator",
    icon: <IconCoins className="size-5" />,
    category: "Investment",
  },
  {
    title: "Emergency Fund Calculator",
    description:
      "Estimate emergency corpus target and compare post-tax returns across parking options.",
    href: "/tools/emergency-fund-calculator",
    icon: <IconShieldCheck className="size-5" />,
    category: "Investment",
  },
  {
    title: "Sukanya Samriddhi Calculator",
    description:
      "Project SSY maturity amount with 15-year deposits and age-based contribution window.",
    href: "/tools/sukanya-samriddhi-calculator",
    icon: <IconShieldCheck className="size-5" />,
    category: "Investment",
  },
]

const investmentHubFaqs = [
  {
    question: "What should a beginner use first: SIP, FD, or PPF calculator?",
    answer:
      "Start with emergency-fund and SIP calculators first, then use FD/PPF for stability allocation. Product choice should follow your goal timeline and risk comfort, not generic return numbers.",
  },
  {
    question: "Why compare post-tax returns before choosing an instrument?",
    answer:
      "Pre-tax returns can be misleading. Two products with similar headline returns can produce very different post-tax outcomes depending on holding period, slab, and withdrawal timing.",
  },
  {
    question: "How often should I update my investment assumptions?",
    answer:
      "Review assumptions at least every quarter or after major changes in income, expenses, interest rates, or asset allocation strategy.",
  },
  {
    question: "Can I combine these calculators for retirement planning?",
    answer:
      "Yes. Use SIP/lumpsum for growth projection, EPF/PPF for retirement safety layer, and SWP to model future withdrawal sustainability.",
  },
  {
    question: "How do I avoid unrealistic corpus expectations?",
    answer:
      "Model conservative, base, and optimistic return scenarios. Also include step-up contribution plans and inflation-adjusted targets to avoid overestimating final purchasing power.",
  },
]

function InvestmentCalculatorsPage() {
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
              <IconChartBar className="size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Investment Calculators
              </h1>
              <p className="text-muted-foreground">
                17 calculators for SIP, FD, RD, PPF, EPF, and more
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {investmentTools.map((tool) => (
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
            Build wealth with a system, not with one-off return chasing
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
              Investment success in India is usually less about finding one
              perfect product and more about building a repeatable process:
              emergency buffer, disciplined contribution, tax-aware allocation,
              and periodic rebalancing. That is why this hub groups calculators
              by outcome instead of marketing labels.
            </p>
            <p>
              Use SIP, step-up SIP, and lumpsum tools to model accumulation.
              Then layer PPF, EPF/VPF, and FD projections for stability and
              cash-flow confidence. If your goal is retirement income, combine
              growth calculators with SWP assumptions so you can see not only
              corpus creation, but also drawdown behavior.
            </p>
            <p>
              The key mistake to avoid is comparing instruments only on quoted
              return. Liquidity, lock-in, taxation, and behavioral comfort
              matter as much as CAGR. When you evaluate these together, your
              plan becomes more durable through market cycles.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Practical sequence for most households
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Set emergency corpus target and parking split.</li>
                <li>Start base SIP aligned to core long-term goals.</li>
                <li>Add step-up contribution as income grows.</li>
                <li>
                  Balance with PF/PPF/FD for stability and tax efficiency.
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Inputs that improve planning quality
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Realistic return range instead of single-point assumptions.
                </li>
                <li>Annual step-up percentage tied to salary growth.</li>
                <li>Goal timeline and expected inflation impact.</li>
                <li>
                  Tax slab and withdrawal horizon for post-tax comparison.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <FAQSection items={investmentHubFaqs} />
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-muted/50 p-6">
          <h2 className="mb-3 text-lg font-semibold">Related Categories</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/tools/tax-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconCalculator className="size-4" />
              Tax Calculators
            </Link>
            <Link
              to="/tools/loan-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconChartBar className="size-4" />
              Loan EMI
            </Link>
          </div>
        </div>

        <section className="mt-14">
          <ToolLongformHowTo
            toolName="Investment Calculators"
            category="investment"
            updated="April 2026"
          />
        </section>
      </div>
    </div>
  )
}
