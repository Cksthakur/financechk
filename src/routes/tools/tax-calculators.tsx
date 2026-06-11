import { Link, createFileRoute } from "@tanstack/react-router"
import {
  IconArrowLeft,
  IconCalculator,
  IconChartBar,
  IconGift,
  IconHome,
  IconHomeDollar,
  IconPigMoney,
  IconReceiptTax,
  IconScale,
  IconTrendingUp,
} from "@tabler/icons-react"
import { FAQSection } from "@/components/finance/faq-section"
import { ToolLongformHowTo } from "@/components/finance/tool-longform-howto"
import { ToolCard } from "@/components/finance/tool-card"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/tax-calculators")({
  head: () =>
    generateSeoMeta({
      title:
        "Tax Calculators India - Income Tax, GST, Capital Gains Calculators",
      description:
        "Free online tax calculators for India. Calculate income tax, compare old vs new regime, LTCG/STCG tax, freelancer tax, and more. Updated for FY 2026-27.",
      path: "/tools/tax-calculators",
    }),
  component: TaxCalculatorsPage,
})

const taxTools = [
  {
    title: "HRA Calculator",
    description:
      "Calculate House Rent Allowance exemption under Section 10(13A). Check metro vs non-metro benefits.",
    href: "/tools/hra-calculator",
    icon: <IconHome className="size-5" />,
    category: "Tax",
  },
  {
    title: "Gratuity Calculator",
    description:
      "Calculate gratuity amount and tax exemption. Check eligibility and retirement benefits.",
    href: "/tools/gratuity-calculator",
    icon: <IconGift className="size-5" />,
    category: "Tax",
  },
  {
    title: "Old vs New Tax Regime Comparison",
    description:
      "Compare tax liability under both regimes. Supports FY 2020-21 to FY 2026-27 with accurate slab rates.",
    href: "/tools/tax-regime-comparison",
    icon: <IconReceiptTax className="size-5" />,
    category: "Tax",
  },
  {
    title: "Section 87A Marginal Relief Calculator",
    description:
      "Check rebate eligibility and marginal relief when income is around the 87A threshold.",
    href: "/tools/section-87a-marginal-relief-calculator",
    icon: <IconReceiptTax className="size-5" />,
    category: "Tax",
  },
  {
    title: "New vs Old Regime Break-Even Finder",
    description:
      "Find the section 80C break-even point where old and new regime tax outgo converges.",
    href: "/tools/new-vs-old-regime-break-even",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "Advance Tax Calculator",
    description:
      "Estimate quarterly advance tax due, shortfall and indicative interest impact.",
    href: "/tools/advance-tax-calculator",
    icon: <IconReceiptTax className="size-5" />,
    category: "Tax",
  },
  {
    title: "Rent Receipt Generator",
    description:
      "Generate month-wise rent receipts for HRA claims with PAN checks above annual rent thresholds.",
    href: "/tools/rent-receipt-generator",
    icon: <IconHome className="size-5" />,
    category: "Tax",
  },
  {
    title: "Tax Proof Pack Generator",
    description:
      "Build a payroll-ready checklist with missing-proof alerts, email draft, and month-wise reminder plan.",
    href: "/tools/tax-proof-pack-generator",
    icon: <IconReceiptTax className="size-5" />,
    category: "Tax",
  },
  {
    title: "Income Tax Notice Reply Generator",
    description:
      "Generate structured response drafts for 143(1), 139(9), demand 156 and AIS mismatch notices.",
    href: "/tools/income-tax-notice-reply-generator",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "Form 16 Tax Crosscheck",
    description:
      "Cross-check Form 16 taxable income and TDS, then generate discrepancy notes and payroll follow-up email draft.",
    href: "/tools/form-16-tax-crosscheck",
    icon: <IconReceiptTax className="size-5" />,
    category: "Tax",
  },
  {
    title: "Salary Hike Tax Impact Calculator",
    description:
      "Estimate post-hike tax impact, monthly net increase, and get a 90-day payroll action plan.",
    href: "/tools/salary-hike-tax-impact-calculator",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "Income Tax Calculator ₹5 Lakh",
    description:
      "Tax calculator specifically for ₹5 lakh annual salary. Pre-filled with accurate deductions.",
    href: "/tools/income-tax-calculator-5-lakh",
    icon: <IconPigMoney className="size-5" />,
    category: "Tax",
  },
  {
    title: "Income Tax Calculator ₹7 Lakh",
    description:
      "Tax calculator for ₹7 lakh salary. See exactly how much tax you pay.",
    href: "/tools/income-tax-calculator-7-lakh",
    icon: <IconPigMoney className="size-5" />,
    category: "Tax",
  },
  {
    title: "IT Employee Tax Calculator",
    description:
      "Tax saving tips for IT professionals. Optimize 80C, 80D, NPS deductions.",
    href: "/tools/income-tax-calculator-it-employee",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "Doctor Tax Calculator",
    description:
      "Tax calculator for doctors with medical equipment and insurance deductions.",
    href: "/tools/income-tax-calculator-doctor",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "Government Employee Tax Calculator",
    description:
      "Tax saving tips for government employees. GPF, NPS, HRA benefits explained.",
    href: "/tools/income-tax-calculator-government-employee",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "Freelancer Tax Calculator (44ADA)",
    description:
      "Calculate presumptive tax for freelancers. Save up to 50% on taxable income.",
    href: "/tools/freelancer-tax-calculator",
    icon: <IconScale className="size-5" />,
    category: "Tax",
  },
  {
    title: "LTCG & STCG Calculator",
    description:
      "Calculate capital gains tax on equity, mutual funds, real estate, and gold.",
    href: "/tools/ltcg-stcg-calculator",
    icon: <IconTrendingUp className="size-5" />,
    category: "Tax",
  },
  {
    title: "Home Loan Tax Benefit Calculator",
    description:
      "Estimate Section 24(b) and Section 80C deductions from your annual home-loan payments.",
    href: "/tools/home-loan-tax-benefit-calculator",
    icon: <IconHomeDollar className="size-5" />,
    category: "Tax",
  },
  {
    title: "Depreciation Calculator (SLM & WDV)",
    description:
      "Calculate yearly depreciation schedule using straight-line and written-down-value methods.",
    href: "/tools/depreciation-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Tax",
  },
]

const taxHubFaqs = [
  {
    question: "Which tax calculator should I open first?",
    answer:
      "Start with tax-regime comparison, then use 87A/marginal-relief and break-even tools. After that, run income-source specific tools like HRA, capital gains, or freelancer tax.",
  },
  {
    question: "Is this updated for current slabs and rebate logic?",
    answer:
      "Yes, pages are maintained for current financial-year assumptions. Always validate final filing with your source documents and latest government notifications.",
  },
  {
    question: "Can I use these tools for payroll communication?",
    answer:
      "Yes. Use generators like tax-proof pack and Form 16 crosscheck to prepare cleaner payroll submissions and escalation notes with supporting context.",
  },
  {
    question: "How do I avoid underpaying or overpaying tax during the year?",
    answer:
      "Run quarterly checks using advance-tax, salary-impact, and capital-gains tools. This helps smooth cash flow and reduces year-end surprises.",
  },
  {
    question:
      "Are these calculators useful for freelancers and professionals too?",
    answer:
      "Yes. The 44ADA-focused freelancer tools and deduction planning utilities are designed for variable income and documentation-light tax workflows.",
  },
]

function TaxCalculatorsPage() {
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
              <IconReceiptTax className="size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Tax Calculators
              </h1>
              <p className="text-muted-foreground">
                16 calculators for Indian tax planning
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {taxTools.map((tool) => (
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
            Tax planning in India: use calculators as a workflow, not as
            isolated tools
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
              Many taxpayers run just one calculator and assume the job is done.
              In reality, tax outcomes are linked across salary structure,
              deductions, capital gains, advance tax, and filing quality. A
              better approach is to sequence the calculators in the same order
              as real financial decisions.
            </p>
            <p>
              Begin by estimating baseline liability under both regimes. Then
              test deduction sensitivity with break-even and rebate tools. After
              you lock the regime direction, move to source-specific pages such
              as HRA, home-loan benefit, freelancer presumptive tax, and capital
              gains. This avoids common errors like optimizing 80C in a year
              where new regime is still cheaper.
            </p>
            <p>
              If your income is not linear through the year, quarterly reviews
              are essential. Salary hikes, bonus payouts, ESOP events, and
              portfolio redemptions can shift tax liability materially. Use
              advance-tax and salary-impact calculators to avoid large
              final-quarter cash outflows and interest exposure.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                What high-intent users usually need
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Old vs new regime answer with deduction break-even context.
                </li>
                <li>
                  Capital-gains estimate with holding-period and exemption
                  impact.
                </li>
                <li>
                  Advance-tax schedule to prevent interest and cash-flow shocks.
                </li>
                <li>
                  Payroll-ready documentation plan for smoother proof
                  submission.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Before filing, verify these items
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Form 16, AIS, and Form 26AS consistency on income and TDS.
                </li>
                <li>
                  Deduction proofs, declaration timing, and employer acceptance.
                </li>
                <li>Capital-gain statement accuracy for each sale lot.</li>
                <li>
                  Notice-response readiness for mismatch or defective return
                  scenarios.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <FAQSection items={taxHubFaqs} />
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-muted/50 p-6">
          <h2 className="mb-3 text-lg font-semibold">Related Categories</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/tools/loan-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconHomeDollar className="size-4" />
              Loan EMI
            </Link>
            <Link
              to="/tools/investment-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconChartBar className="size-4" />
              Investment
            </Link>
            <Link
              to="/tools/trading-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconTrendingUp className="size-4" />
              Trading
            </Link>
          </div>
        </div>

        <section className="mt-14">
          <ToolLongformHowTo
            toolName="Tax Calculators"
            category="tax"
            updated="April 2026"
          />
        </section>
      </div>
    </div>
  )
}
