import { Link, createFileRoute } from "@tanstack/react-router"
import { IconArticle, IconChevronRight } from "@tabler/icons-react"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/blog/")({
  head: () =>
    generateSeoMeta({
      title: "Financial Intelligence Blog — Indian Taxation & Strategy",
      description:
        "Deep-dive guides on Indian taxation, trading strategies, and personal finance. Built for clarity, accuracy, and actionable insights.",
      path: "/blog",
    }),
  component: BlogIndex,
})

const articles = [
  {
    title:
      "Income Tax Act 2025 Changes: How the Revised Tax Slabs Impact Salaried Employees & Freelancers",
    description:
      "A comprehensive guide to the Income Tax Act 2025 changes, new slab rates, standard deduction hikes, and capital gains tax impact on Indian taxpayers.",
    href: "/blog/income-tax-act-2025-changes",
    date: "April 2026",
    readTime: "8 min read",
    category: "Taxation",
  },
  {
    title: "Mutual Fund LTCG Tax Rules 2025: Navigating the New 12.5% Rate",
    description:
      "Understand the impact of Budget 2024 and 2025 changes on your mutual fund investments. Learn about the new LTCG rates and tax-saving strategies.",
    href: "/blog/mutual-fund-ltcg-tax-rules-2025",
    date: "April 2026",
    readTime: "7 min read",
    category: "Investment",
  },
  {
    title:
      "Home Loan Eligibility: All Major Indian Banks Compared (2025 Edition)",
    description:
      "Compare FOIR limits, LTV ratios, and eligibility criteria for HDFC, SBI, ICICI, and Axis Bank. Find out which bank offers the highest loan amount.",
    href: "/blog/home-loan-eligibility-all-banks-2025",
    date: "April 2026",
    readTime: "12 min read",
    category: "Loans",
  },
  {
    title:
      "F&O Tax Guide: How to File ITR-3 for Futures and Options Trading in India",
    description:
      "A definitive guide to Futures and Options (F&O) taxation in India. Learn how to calculate Absolute Turnover, file ITR-3, claim business expenses, and carry forward trading losses.",
    href: "/blog/f-and-o-tax-guide-itr-3",
    date: "April 2026",
    readTime: "9 min read",
    category: "Trading",
  },
  {
    title:
      "MCX Crude Oil Intraday Trading Strategy: Lot Sizes, Margins, and the US Session Edge",
    description:
      "Learn how to trade MCX Crude Oil intraday. Understand mega vs mini lot sizes, margin requirements, risk management, and the highly profitable Wednesday EIA inventory strategy.",
    href: "/blog/mcx-crude-oil-intraday-trading-strategy",
    date: "April 2026",
    readTime: "11 min read",
    category: "Commodities",
  },
  {
    title: "Freelancer Tax Guide: Mastering Section 44ADA Presumptive Taxation",
    description:
      "The complete manual for independent professionals in India. Learn how to pay tax on only 50% of your income legally under Section 44ADA.",
    href: "/blog/freelancer-tax-44ada-complete-guide",
    date: "April 2026",
    readTime: "10 min read",
    category: "Taxation",
  },
  {
    title:
      "Stock Market Capital Gains Tax Guide 2025: Equity vs. Debt vs. Gold",
    description:
      "A deep dive into the 2025 taxation rules for different asset classes. Learn about holding periods, indexation (where applicable), and tax optimization.",
    href: "/blog/stock-market-capital-gains-tax-guide-2025",
    date: "April 2026",
    readTime: "15 min read",
    category: "Investment",
  },
  {
    title: "Old vs New Tax Regime: The Definitive Comparison for 2025",
    description:
      "Stop the guesswork. We compare both regimes side-by-side with detailed calculation examples for different salary levels and deduction profiles.",
    href: "/blog/old-vs-new-tax-regime-comparison-2025",
    date: "April 2026",
    readTime: "13 min read",
    category: "Taxation",
  },
  {
    title: "SIP vs Lumpsum vs Step-Up: Which Investment Strategy Wins in 2025?",
    description:
      "Backtested results comparing the three most popular mutual fund investment methods. Find out which one fits your financial goals and risk profile.",
    href: "/blog/sip-vs-lumpsum-vs-step-up-comparison",
    date: "April 2026",
    readTime: "14 min read",
    category: "Investment",
  },
  {
    title: "Maximizing Home Loan Tax Benefits: Section 80C and 24(b) Decoded",
    description:
      "Learn how to save up to ₹5 Lakhs in taxable income using your home loan. A guide to principal and interest deductions in the 2025 tax year.",
    href: "/blog/section-80c-24b-home-loan-tax-benefits",
    date: "April 2026",
    readTime: "9 min read",
    category: "Loans",
  },
  {
    title: "Zerodha vs Groww vs Angel One: Brokerage & Charges Comparison 2025",
    description:
      "The most transparent comparison of India's top discount brokers. We factor in STT, GST, SEBI fees, and hidden transaction charges.",
    href: "/blog/zerodha-vs-groww-vs-angel-one-brokerage-2025",
    date: "April 2026",
    readTime: "11 min read",
    category: "Trading",
  },
]

function BlogIndex() {
  return (
    <div className="mx-auto max-w-(--fc-page-width) px-5 py-8 md:px-8 md:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol
          className="flex items-center gap-1 text-[15px] text-muted-foreground"
          style={{ letterSpacing: "0.15px" }}
        >
          <li>
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <IconChevronRight className="size-3 text-muted-foreground/50" />
            <span className="text-foreground">Blog</span>
          </li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-16">
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
          Financial Intelligence Blog
        </h1>
        <p
          className="mt-6 max-w-2xl text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Deep-dive guides on Indian taxation, trading strategies, and personal
          finance. Built for clarity, accuracy, and actionable insights.
        </p>
      </div>

      {/* Article List */}
      <div className="flex flex-col gap-6">
        {articles.map((article) => (
          <Link
            key={article.href}
            to={article.href}
            className="group flex flex-col gap-4 rounded-2xl bg-card p-6 transition-all hover:-translate-y-0.5 md:flex-row md:items-center md:gap-8"
            style={{
              boxShadow:
                "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
              transitionDuration: "var(--fc-duration)",
            }}
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground md:size-16">
              <IconArticle className="size-6 md:size-8" stroke={1.5} />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-foreground">
                  {article.category}
                </span>
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
              <h2 className="mb-2 text-xl leading-snug font-semibold text-foreground group-hover:text-primary md:text-2xl">
                {article.title}
              </h2>
              <p
                className="text-muted-foreground"
                style={{
                  fontSize: "16px",
                  lineHeight: 1.5,
                  letterSpacing: "0.16px",
                }}
              >
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Blog JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "FinanceChk Blog",
            url: "https://financechk.com/blog",
            description:
              "Deep-dive guides on Indian taxation, trading strategies, and personal finance.",
            blogPost: articles.map((article) => ({
              "@type": "BlogPosting",
              headline: article.title,
              description: article.description,
              url: `https://financechk.com${article.href}`,
            })),
          }),
        }}
      />
    </div>
  )
}
