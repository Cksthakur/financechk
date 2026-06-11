import { Link, createFileRoute } from "@tanstack/react-router"
import {
  IconArrowRight,
  IconCalculator,
  IconChartBar,
  IconChevronRight,
  IconCoins,
  IconHomeDollar,
  IconPigMoney,
  IconReceiptTax,
  IconScale,
  IconTrendingUp,
} from "@tabler/icons-react"
import { FAQSection } from "@/components/finance/faq-section"
import { ToolLongformHowTo } from "@/components/finance/tool-longform-howto"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/")({
  head: () =>
    generateSeoMeta({
      title: "Financial Calculators India — Free Online Tools",
      description:
        "Free financial calculators for India. Calculate home loan eligibility, SIP returns, tax liability, trading profits, and more. No signup required.",
      path: "/tools",
    }),
  component: ToolsIndex,
})

const toolCategories = [
  {
    name: "Tax Calculators",
    description:
      "Calculate income tax, HRA exemption, and compare tax regimes for FY 2026-27.",
    href: "/tools/tax-calculators",
    icon: IconReceiptTax,
    count: 16,
  },
  {
    name: "Loan EMI",
    description:
      "Home loan eligibility, EMI calculators, and prepayment planning tools.",
    href: "/tools/loan-calculators",
    icon: IconHomeDollar,
    count: 12,
  },
  {
    name: "Investment",
    description:
      "SIP, FD, PPF, EPF, and lumpsum calculators for wealth creation.",
    href: "/tools/investment-calculators",
    icon: IconChartBar,
    count: 17,
  },
  {
    name: "Trading",
    description: "STT, brokerage, and position sizing calculators for traders.",
    href: "/tools/trading-calculators",
    icon: IconTrendingUp,
    count: 6,
  },
]

const featuredTools = [
  {
    title: "Home Loan Eligibility Calculator",
    description:
      "Find out exactly how much home loan you can get based on your salary, existing obligations, and employer type using the FOIR method.",
    href: "/tools/home-loan-eligibility-calculator",
    icon: <IconHomeDollar className="size-5" />,
  },
  {
    title: "Advanced EMI Calculator",
    description:
      "Plan your path to debt-freedom with multiple random prepayments, property taxes, maintenance, and Section 24b income tax rebates.",
    href: "/tools/advanced-home-loan-emi-calculator",
    icon: <IconCalculator className="size-5" />,
  },
  {
    title: "SIP Calculator",
    description:
      "Calculate the future value of your monthly mutual fund investments and see the staggering power of compound interest over time.",
    href: "/tools/sip-calculator",
    icon: <IconPigMoney className="size-5" />,
  },
  {
    title: "STT & Brokerage Calculator",
    description:
      "Calculate your exact net profit and break-even points for F&O and Equity trading. Updated with latest April 2026 tax hikes.",
    href: "/tools/stt-brokerage-calculator",
    icon: <IconTrendingUp className="size-5" />,
  },
  {
    title: "STT Calculator",
    description:
      "Estimate Securities Transaction Tax quickly for delivery, intraday, futures and options cases.",
    href: "/tools/stt-calculator",
    icon: <IconCalculator className="size-5" />,
  },
  {
    title: "Section 87A Marginal Relief",
    description:
      "Check rebate and marginal relief around the 87A threshold with special-rate income support.",
    href: "/tools/section-87a-marginal-relief-calculator",
    icon: <IconReceiptTax className="size-5" />,
  },
  {
    title: "Tax Regime Break-Even Finder",
    description:
      "Find your section 80C break-even point where old and new regime tax outgo becomes similar.",
    href: "/tools/new-vs-old-regime-break-even",
    icon: <IconScale className="size-5" />,
  },
  {
    title: "F&O Brokerage Calculator",
    description:
      "Calculate all-in futures and options charges with break-even points and percentage move.",
    href: "/tools/fo-brokerage-calculator",
    icon: <IconTrendingUp className="size-5" />,
  },
  {
    title: "Advance Tax Calculator",
    description:
      "Plan quarterly advance tax payments with due-date wise cumulative targets and shortfall checks.",
    href: "/tools/advance-tax-calculator",
    icon: <IconReceiptTax className="size-5" />,
  },
  {
    title: "Rent Receipt Generator",
    description:
      "Generate month-wise rent receipts for HRA claims with PAN checks for annual rent above Rs 1 lakh.",
    href: "/tools/rent-receipt-generator",
    icon: <IconReceiptTax className="size-5" />,
  },
  {
    title: "Tax Proof Pack Generator",
    description:
      "Build payroll-ready proof checklist, missing-document alerts, and a submission email draft.",
    href: "/tools/tax-proof-pack-generator",
    icon: <IconReceiptTax className="size-5" />,
  },
  {
    title: "Income Tax Notice Reply Generator",
    description:
      "Draft structured replies for 143(1), 139(9), demand notices and AIS mismatches in minutes.",
    href: "/tools/income-tax-notice-reply-generator",
    icon: <IconScale className="size-5" />,
  },
  {
    title: "Form 16 Tax Crosscheck",
    description:
      "Reconcile Form 16 taxable income and TDS with estimated liability and get payroll escalation draft.",
    href: "/tools/form-16-tax-crosscheck",
    icon: <IconReceiptTax className="size-5" />,
  },
  {
    title: "Salary Hike Tax Impact",
    description:
      "Turn your increment into net take-home plan with additional tax estimate and 90-day optimization checklist.",
    href: "/tools/salary-hike-tax-impact-calculator",
    icon: <IconScale className="size-5" />,
  },
  {
    title: "MCX Commodity Margin Calculator",
    description:
      "Estimate commodity SPAN + exposure margin, tick-value P&L and trade charges for MCX contracts.",
    href: "/tools/mcx-commodity-margin-calculator",
    icon: <IconTrendingUp className="size-5" />,
  },
  {
    title: "Home Loan Balance Transfer Calculator",
    description:
      "Check if switching your home loan lender saves money after processing fee, legal charges, and transfer costs.",
    href: "/tools/home-loan-balance-transfer-calculator",
    icon: <IconHomeDollar className="size-5" />,
  },
  {
    title: "Home Loan Letter Generator",
    description:
      "Generate bank-ready request letters for prepayment, ROI reduction, foreclosure and NOC workflows.",
    href: "/tools/home-loan-letter-generator",
    icon: <IconHomeDollar className="size-5" />,
  },
  {
    title: "Education Loan Calculator",
    description:
      "Estimate EMI after moratorium and evaluate Section 80E interest-deduction impact under old/new regime assumptions.",
    href: "/tools/education-loan-calculator",
    icon: <IconCalculator className="size-5" />,
  },
  {
    title: "Emergency Fund Calculator",
    description:
      "Find your ideal emergency corpus by profile risk and compare post-tax returns across savings, liquid funds, and FDs.",
    href: "/tools/emergency-fund-calculator",
    icon: <IconPigMoney className="size-5" />,
  },
  {
    title: "Sukanya Samriddhi Calculator",
    description:
      "Project SSY maturity corpus with 15-year contribution window, age-based schedule, and annual 80C benefit view.",
    href: "/tools/sukanya-samriddhi-calculator",
    icon: <IconCoins className="size-5" />,
  },
  {
    title: "EPF / VPF Calculator",
    description:
      "Project retirement PF corpus with salary growth, employer split and voluntary PF contribution.",
    href: "/tools/epf-vpf-calculator",
    icon: <IconCoins className="size-5" />,
  },
  {
    title: "Old vs New Tax Regime",
    description:
      "A side-by-side comparison of your tax liability under both regimes, factoring in standard deductions and all Section 80 deductions.",
    href: "/tools/tax-regime-comparison",
    icon: <IconReceiptTax className="size-5" />,
  },
  {
    title: "ELSS Calculator",
    description:
      "Plan your Section 80C tax-saving SIP with projected ELSS corpus, annual tax savings, and tax-adjusted wealth outcomes.",
    href: "/tools/elss-calculator",
    icon: <IconCoins className="size-5" />,
  },
  {
    title: "Personal Loan Prepayment",
    description:
      "See exactly how much interest and loan tenure you can save with monthly and one-time personal loan prepayments.",
    href: "/tools/personal-loan-prepayment-calculator",
    icon: <IconHomeDollar className="size-5" />,
  },
  {
    title: "Freelancer Tax Calculator",
    description:
      "The definitive tool for independent professionals to calculate presumptive tax under Section 44ADA and save up to 50% on taxable income.",
    href: "/tools/freelancer-tax-calculator",
    icon: <IconScale className="size-5" />,
  },
]

const toolsHubFaqs = [
  {
    question:
      "Which calculators should I use first as a salaried professional?",
    answer:
      "Start with tax regime comparison, HRA calculator, and SIP calculator. Then use emergency fund and home-loan eligibility tools based on your current goals.",
  },
  {
    question: "How often should I recheck my numbers?",
    answer:
      "A practical cycle is quarterly for investments and monthly for loan and cash-flow decisions. Recalculate immediately after salary changes, rate changes, or new liabilities.",
  },
  {
    question: "Are these tools suitable for self-employed and freelancers too?",
    answer:
      "Yes. Most calculators are profile-neutral, and some are specifically designed for freelancers, presumptive taxation, variable income planning, and irregular cash flow.",
  },
  {
    question:
      "Can I use calculator output directly for filing and bank submission?",
    answer:
      "Use these as decision support and draft support. For final filing/submission, match with Form 16, AIS/26AS, contract notes, lender communication, and CA advice where needed.",
  },
  {
    question: "What makes this tools hub useful for SEO and users?",
    answer:
      "It is organized by real financial workflows, not just formulas. You can move from planning to action with linked calculators, checklists, and practical context for India-specific decisions.",
  },
]

const workflowSteps = [
  "Define the question first: tax saving, EMI affordability, corpus target, or trade-level charges.",
  "Run the primary calculator and save a shareable scenario link for your base case.",
  "Create 2-3 alternative scenarios to compare risk, liquidity, and post-tax outcomes.",
  "Use the category hubs to validate adjacent impacts before acting (for example, tax impact after a salary hike).",
]

function ToolsIndex() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background">
        <div className="mx-auto max-w-(--fc-page-width) px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
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
              Financial calculators
            </h1>
            <p
              className="mt-6 text-muted-foreground"
              style={{
                fontSize: "20px",
                lineHeight: 1.5,
                letterSpacing: "0.18px",
              }}
            >
              Every tool uses real formulas from RBI guidelines, Income Tax Act,
              and SEBI regulations. No signup, no paywall. Every number is
              verifiable.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto h-px max-w-(--fc-page-width) bg-border" />

      {/* Category Pills */}
      <section className="bg-secondary/30 py-10 md:py-12">
        <div className="mx-auto max-w-(--fc-page-width) px-5 md:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {toolCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <cat.icon className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cat.count} tools
                    </p>
                  </div>
                </div>
                <IconChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="bg-secondary/40 py-12 md:py-16">
        <div className="mx-auto max-w-(--fc-page-width) px-5 md:px-8">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                All Calculators
              </p>
              <h2
                className="mt-3 text-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "36px",
                  letterSpacing: "normal",
                  lineHeight: 1.1,
                }}
              >
                Precision tools for <br />
                every financial decision.
              </h2>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group flex flex-col rounded-2xl bg-card p-6 transition-all hover:-translate-y-0.5"
                style={{
                  boxShadow:
                    "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
                }}
              >
                <div className="mb-4 flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                  {tool.icon}
                </div>
                <h3 className="mb-2 text-base leading-snug font-semibold text-foreground">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <div className="mt-auto flex items-center gap-1 pt-4">
                  <span className="text-sm font-medium text-primary">
                    Open tool
                  </span>
                  <IconArrowRight className="size-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-18">
        <div className="mx-auto max-w-(--fc-page-width) px-5 md:px-8">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "36px",
              letterSpacing: "normal",
              lineHeight: 1.13,
            }}
          >
            How to choose the right financial calculator
          </h2>

          <div
            className="mt-6 flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              Most users do not need more calculators. They need the right
              sequence. If your goal is tax optimization, start with regime,
              rebate, and deduction tools before running any investment product
              projections. If your goal is home ownership, check affordability
              and EMI resilience before browsing rate offers.
            </p>
            <p>
              This hub is built around that decision flow. You can enter through
              Tax, Loan, Investment, or Trading clusters, then move into deeper
              pages that solve the next question in the same workflow. That
              reduces planning errors such as over-investing before building
              emergency buffer or taking high EMI without break-even checks.
            </p>
            <p>
              Every result should be treated as scenario intelligence: best
              case, realistic case, and stress case. When you compare these
              three, choices become clearer and less emotional. You stop asking
              "What is the highest return?" and start asking "What survives rate
              changes, job risk, and tax leakage?"
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Use This Workflow
            </p>
            <ol
              className="mt-4 flex flex-col gap-3 text-muted-foreground"
              style={{
                fontSize: "17px",
                lineHeight: 1.6,
                letterSpacing: "0.17px",
              }}
            >
              {workflowSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Common Mistakes This Hub Helps Avoid
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Choosing tax regime without break-even deduction check.</li>
                <li>
                  Comparing loans only on EMI, not total cost and prepayment
                  flexibility.
                </li>
                <li>
                  Skipping post-tax return comparison in emergency corpus
                  parking.
                </li>
                <li>
                  Ignoring STT and brokerage while planning active trading
                  profitability.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Best Practices Before Acting on Results
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Keep salary slips, Form 16, loan statements, and broker
                  contract notes ready.
                </li>
                <li>
                  Run at least one conservative scenario with lower returns and
                  higher expenses.
                </li>
                <li>
                  Use shareable links to discuss the exact scenario with spouse,
                  advisor, or CA.
                </li>
                <li>
                  Review numbers again before quarter-end and major policy
                  updates.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <FAQSection items={toolsHubFaqs} />
          </div>
        </div>
      </section>

      <section className="bg-secondary/20 py-14 md:py-16">
        <div className="mx-auto max-w-(--fc-page-width) px-5 md:px-8">
          <ToolLongformHowTo
            toolName="Financial Calculators"
            category="general"
            updated="April 2026"
          />
        </div>
      </section>

      {/* CollectionPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Financial Calculators — FinanceChk",
            url: "https://financechk.com/tools",
            description:
              "Free financial calculators for India — home loan eligibility, SIP returns, tax regime comparison, and more.",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: featuredTools.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://financechk.com${tool.href}`,
                name: tool.title,
              })),
            },
          }),
        }}
      />
    </div>
  )
}
