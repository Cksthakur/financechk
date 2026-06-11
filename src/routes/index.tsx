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
import { ToolCard } from "@/components/finance/tool-card"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/")({
  head: () =>
    generateSeoMeta({
      title: "FinanceChk — Free Financial Calculators for India",
      description:
        "Free, accurate financial calculators for India. Home loan eligibility, SIP returns, tax regime comparison, and more. No signup required.",
      path: "/",
    }),
  component: HomePage,
})

const tools = [
  {
    title: "Home Loan Eligibility Calculator",
    description:
      "Find out exactly how much home loan you can get based on your salary, existing obligations, and employer type using the FOIR method.",
    href: "/tools/home-loan-eligibility-calculator",
    icon: <IconHomeDollar className="size-5" />,
    category: "Loans",
  },
  {
    title: "Advanced EMI Calculator",
    description:
      "Plan your path to debt-freedom with multiple random prepayments, property taxes, maintenance, and Section 24b income tax rebates.",
    href: "/tools/advanced-home-loan-emi-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Loans",
  },
  {
    title: "SIP Calculator",
    description:
      "Calculate the future value of your monthly mutual fund investments and see the staggering power of compound interest over time.",
    href: "/tools/sip-calculator",
    icon: <IconPigMoney className="size-5" />,
    category: "Investment",
  },
  {
    title: "STT & Brokerage Calculator",
    description:
      "Calculate your exact net profit and break-even points for F&O and Equity trading. Updated with latest April 2026 tax hikes.",
    href: "/tools/stt-brokerage-calculator",
    icon: <IconTrendingUp className="size-5" />,
    category: "Trading",
  },
  {
    title: "Section 87A Marginal Relief Calculator",
    description:
      "Check rebate eligibility and marginal relief around threshold incomes under old/new regime logic.",
    href: "/tools/section-87a-marginal-relief-calculator",
    icon: <IconReceiptTax className="size-5" />,
    category: "Tax",
  },
  {
    title: "Old vs New Tax Regime",
    description:
      "A side-by-side comparison of your tax liability under both regimes, factoring in standard deductions and all Section 80 deductions.",
    href: "/tools/tax-regime-comparison",
    icon: <IconReceiptTax className="size-5" />,
    category: "Tax",
  },
  {
    title: "Freelancer Tax Calculator",
    description:
      "The definitive tool for independent professionals to calculate presumptive tax under Section 44ADA and save up to 50% on taxable income.",
    href: "/tools/freelancer-tax-calculator",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "ELSS Calculator",
    description:
      "Plan Section 80C tax savings with projected ELSS SIP corpus and tax-adjusted net wealth outcomes.",
    href: "/tools/elss-calculator",
    icon: <IconCoins className="size-5" />,
    category: "Investment",
  },
  {
    title: "Personal Loan Prepayment Calculator",
    description:
      "Calculate interest and tenure reduction using monthly plus one-time prepayment strategy.",
    href: "/tools/personal-loan-prepayment-calculator",
    icon: <IconHomeDollar className="size-5" />,
    category: "Loans",
  },
]

const categories = [
  {
    name: "Tax Calculators",
    count: 16,
    href: "/tools/tax-calculators",
    icon: IconReceiptTax,
  },
  {
    name: "Loan EMI",
    count: 12,
    href: "/tools/loan-calculators",
    icon: IconHomeDollar,
  },
  {
    name: "Investment",
    count: 17,
    href: "/tools/investment-calculators",
    icon: IconChartBar,
  },
  {
    name: "Trading",
    count: 6,
    href: "/tools/trading-calculators",
    icon: IconTrendingUp,
  },
]

function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero — ElevenLabs inspired: massive whitespace, light heading, warm stone CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-(--fc-page-width) px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <h1
              className="text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "56px",
                letterSpacing: "-1.12px",
                lineHeight: 1.05,
              }}
            >
              Indian Finance, <br />
              <span className="text-[var(--fc-warm-gray)]">
                Perfectly Calculated.
              </span>
            </h1>
            <p
              className="mt-8 text-muted-foreground"
              style={{
                fontSize: "20px",
                lineHeight: 1.5,
                letterSpacing: "0.18px",
              }}
            >
              No signup, no popups, no “call back” forms. Build your wealth with
              precision-engineered tools designed for real Indian tax rules,
              bank algorithms, and SEBI regulations.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
                style={{
                  boxShadow:
                    "rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px",
                }}
              >
                Explore all tools
                <IconArrowRight className="size-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-[30px] px-6 py-3.5 text-[15px] font-medium text-foreground transition-all hover:bg-secondary"
                style={{
                  background: "var(--fc-warm-stone)",
                  boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
                }}
              >
                Our Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto h-px max-w-(--fc-page-width) bg-border" />

      {/* Tools grid */}
      <section id="tools" className="bg-secondary/40 py-12 md:py-16">
        <div className="mx-auto max-w-(--fc-page-width) px-5 md:px-8">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Featured Engines
              </p>
              <h2
                className="mt-3 text-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "42px",
                  letterSpacing: "normal",
                  lineHeight: 1.1,
                }}
              >
                Financial decisions <br /> backed by raw data.
              </h2>
            </div>
            <Link
              to="/tools"
              className="group flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              View all tools
              <IconChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="bg-secondary/30 py-10 md:py-12">
        <div className="mx-auto max-w-(--fc-page-width) px-5 md:px-8">
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Browse by Category
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat) => (
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

      {/* Massive Pillar Content Section for SEO */}
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-(--fc-content-width) px-5 md:px-8">
          <article className="prose prose-stone max-w-none">
            <h2
              className="text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "36px",
                lineHeight: 1.17,
                marginBottom: "2rem",
              }}
            >
              Why We Built FinanceChk: The Truth About Indian Financial Tools
            </h2>

            <div
              className="flex flex-col gap-5 text-muted-foreground"
              style={{
                fontSize: "17px",
                lineHeight: 1.7,
                letterSpacing: "0.18px",
              }}
            >
              <p>
                The Indian internet is flooded with "financial calculators."
                From bank portals to fintech startups, everyone offers an EMI or
                SIP tool. So why did we build another one? Because most existing
                tools are fundamentally designed as{" "}
                <strong className="font-semibold text-foreground">
                  lead-generation traps
                </strong>{" "}
                rather than precision calculation engines.
              </p>
              <p>
                When you use a bank's home loan eligibility tool, the math is
                often opaque, designed to give you an "optimistic" number that
                encourages you to click the "Apply Now" button and surrender
                your phone number to a telemarketing database. At FinanceChk, we
                believe that{" "}
                <strong className="font-semibold text-foreground">
                  privacy is a prerequisite for financial clarity
                </strong>
                .
              </p>

              <h3
                className="mt-8 text-2xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                1. Precision Over Approximation
              </h3>
              <p>
                Financial math in India is nuanced. A simple "7% interest" on a
                Fixed Deposit is not just 7% of your principal. Most Indian
                banks use{" "}
                <strong className="font-semibold text-foreground">
                  quarterly compounding
                </strong>
                , which results in a different effective yield. Most calculators
                ignore this.
              </p>
              <p>
                Our{" "}
                <a
                  href="/tools/fd-calculator"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  Fixed Deposit (FD) Calculator
                </a>{" "}
                and{" "}
                <a
                  href="/tools/rd-calculator"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  Recurring Deposit (RD) Calculator
                </a>{" "}
                simulate the exact algorithms used by major Indian lenders like
                SBI and HDFC. We don't approximate; we calculate.
              </p>

              <h3
                className="mt-8 text-2xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                2. Navigating the "Taxation Trap"
              </h3>
              <p>
                In a country with a dual tax regime, choosing where to park your
                retirement savings is no longer straightforward. The battle
                between{" "}
                <strong className="font-semibold text-foreground">
                  NPS, EPF, and PPF
                </strong>{" "}
                isn't just about who gives the highest return—it's about who
                takes the lowest tax at the finish line.
              </p>
              <p>
                Our{" "}
                <a
                  href="/tools/nps-vs-epf-vs-ppf"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  NPS vs EPF vs PPF Calculator
                </a>{" "}
                is the only tool that explicitly visualizes the "EEE vs EET"
                taxation status, showing you that a lower-return EEE instrument
                (like PPF) can sometimes leave more cash in your hands than a
                high-growth taxable instrument.
              </p>

              <p>
                For tax-saving investors, our{" "}
                <a
                  href="/tools/elss-calculator"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  ELSS Calculator
                </a>{" "}
                shows both expected market growth and Section 80C-adjusted net
                capital deployed. For borrowers, the{" "}
                <a
                  href="/tools/personal-loan-prepayment-calculator"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  Personal Loan Prepayment Calculator
                </a>{" "}
                and{" "}
                <a
                  href="/tools/personal-loan-balance-transfer-calculator"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  Balance Transfer Calculator
                </a>{" "}
                make debt-cost decisions transparent before you sign with any
                lender.
              </p>

              <h3
                className="mt-8 text-2xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                3. Active Trading in the Modern Era
              </h3>
              <p>
                Trading in 2026 is a game of margins and statutory charges. With
                the April 2026 hike in Securities Transaction Tax (STT), active
                options scalpers are facing a crisis of profitability.
              </p>
              <p>
                We built the{" "}
                <a
                  href="/tools/stt-brokerage-calculator"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  STT & Brokerage Calculator
                </a>{" "}
                to help traders identify their "Break-even Points" instantly. In
                the era of high-frequency trading, if you don't know exactly how
                many points the Nifty must move just to pay the government, you
                are trading with a blindfold on.
              </p>

              <h3
                className="mt-8 text-2xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                4. The "Prepay vs. Invest" Dilemma
              </h3>
              <p>
                Should you use your annual bonus to pay off your home loan or
                start a mutual fund SIP? The "correct" answer depends on your
                effective interest rate, your tax bracket, and your risk
                tolerance.
              </p>
              <p>
                Our{" "}
                <a
                  href="/tools/prepay-vs-invest"
                  className="font-medium text-primary underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-primary"
                >
                  Prepay Home Loan vs Invest Calculator
                </a>{" "}
                provides a mathematical verdict, showing you exactly how much
                future wealth you surrender by choosing safety over compounding,
                or vice-versa.
              </p>

              <div className="my-12 rounded-2xl bg-[var(--fc-warm-stone)] p-8 shadow-[rgba(78,50,23,0.04)_0px_6px_16px]">
                <h4 className="mb-4 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  A Note on E-E-A-T
                </h4>
                <p className="text-[16px] leading-relaxed text-foreground">
                  FinanceChk is built and maintained by{" "}
                  <strong className="font-bold text-foreground">
                    Rajat Das
                  </strong>
                  , a software developer and active trader with a deep
                  background in algorithmic finance. Every formula used on this
                  site is cross-referenced with official RBI notifications, SEBI
                  circulars, and the latest Finance Bills. We do not use
                  "AI-generated math"; we use hard-coded, verifiable financial
                  logic.
                </p>
              </div>

              <p>
                Financial freedom in India is a journey of a thousand
                calculations. We hope FinanceChk makes your journey a little
                more precise, a little more private, and a lot more profitable.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  to="/about"
                  className="text-sm font-bold tracking-widest text-primary uppercase hover:opacity-80"
                >
                  Read our full story & data sources →
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* WebSite + SiteLinksSearchBox + Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FinanceChk",
            url: "https://financechk.com",
            description:
              "Indian Financial Calculators built with precision. No signup, no ads, just data.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://financechk.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FinanceChk",
            url: "https://financechk.com",
            logo: "https://financechk.com/logo.png",
            description:
              "India's leading platform for precision financial tools. Built for salaried employees, freelancers, and professional traders.",
            founder: {
              "@type": "Person",
              name: "Rajat Das",
              jobTitle: "Founder & Lead Developer",
            },
            sameAs: [
              "https://twitter.com/financechk",
              "https://linkedin.com/company/financechk",
            ],
          }),
        }}
      />
    </div>
  )
}
