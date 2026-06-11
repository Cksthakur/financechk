import { Link, createFileRoute } from "@tanstack/react-router"
import {
  IconArrowLeft,
  IconCalculator,
  IconCar,
  IconChartBar,
  IconHome,
  IconHomeDollar,
} from "@tabler/icons-react"
import { FAQSection } from "@/components/finance/faq-section"
import { ToolLongformHowTo } from "@/components/finance/tool-longform-howto"
import { ToolCard } from "@/components/finance/tool-card"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/loan-calculators")({
  head: () =>
    generateSeoMeta({
      title: "Loan EMI Calculators India - Home Loan, Car Loan, Personal Loan",
      description:
        "Free online loan EMI calculators for India. Calculate home loan eligibility, EMI, prepayment savings. Compare SBI, HDFC, ICICI rates.",
      path: "/tools/loan-calculators",
    }),
  component: LoanCalculatorsPage,
})

const loanTools = [
  {
    title: "Home Loan Eligibility Calculator",
    description:
      "Find out exactly how much home loan you can get based on your salary using FOIR method.",
    href: "/tools/home-loan-eligibility-calculator",
    icon: <IconHomeDollar className="size-5" />,
    category: "Loans",
  },
  {
    title: "Home Loan - Bangalore",
    description:
      "Check home loan eligibility in Bangalore with property budget estimates.",
    href: "/tools/home-loan-eligibility-bangalore",
    icon: <IconHome className="size-5" />,
    category: "Loans",
  },
  {
    title: "Home Loan - Mumbai",
    description:
      "Mumbai home loan eligibility with property price ranges for different areas.",
    href: "/tools/home-loan-eligibility-mumbai",
    icon: <IconHome className="size-5" />,
    category: "Loans",
  },
  {
    title: "Home Loan - Hyderabad",
    description: "Calculate home loan eligibility in Hyderabad IT hub areas.",
    href: "/tools/home-loan-eligibility-hyderabad",
    icon: <IconHome className="size-5" />,
    category: "Loans",
  },
  {
    title: "Home Loan - Chennai",
    description:
      "Chennai home loan eligibility with OMR and city center property budgets.",
    href: "/tools/home-loan-eligibility-chennai",
    icon: <IconHome className="size-5" />,
    category: "Loans",
  },
  {
    title: "Home Loan - Pune",
    description:
      "Pune home loan eligibility for IT professionals in Hinjewadi and Magarpatta.",
    href: "/tools/home-loan-eligibility-pune",
    icon: <IconHome className="size-5" />,
    category: "Loans",
  },
  {
    title: "Advanced EMI Calculator",
    description:
      "Plan debt-freedom with prepayments, property taxes, and Section 24b tax rebates.",
    href: "/tools/advanced-home-loan-emi-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Loans",
  },
  {
    title: "Car Loan EMI Calculator",
    description:
      "Calculate car loan EMI, total interest, and compare financing options.",
    href: "/tools/car-loan-emi-calculator",
    icon: <IconCar className="size-5" />,
    category: "Loans",
  },
  {
    title: "Personal Loan Prepayment Calculator",
    description:
      "Calculate how much interest and tenure you save with monthly and one-time personal loan prepayments.",
    href: "/tools/personal-loan-prepayment-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Loans",
  },
  {
    title: "Personal Loan Balance Transfer Calculator",
    description:
      "Compare current loan vs transfer offer after processing fee, foreclosure charge, and tenure reset.",
    href: "/tools/personal-loan-balance-transfer-calculator",
    icon: <IconHomeDollar className="size-5" />,
    category: "Loans",
  },
  {
    title: "Home Loan Balance Transfer Calculator",
    description:
      "Compare current lender with refinance offer after processing, legal and transfer charges.",
    href: "/tools/home-loan-balance-transfer-calculator",
    icon: <IconHomeDollar className="size-5" />,
    category: "Loans",
  },
  {
    title: "Home Loan Letter Generator",
    description:
      "Generate branch-ready drafts for prepayment, ROI reduction, foreclosure/NOC and interest certificate requests.",
    href: "/tools/home-loan-letter-generator",
    icon: <IconHomeDollar className="size-5" />,
    category: "Loans",
  },
  {
    title: "Education Loan Calculator",
    description:
      "Estimate EMI after moratorium and evaluate Section 80E interest deduction impact.",
    href: "/tools/education-loan-calculator",
    icon: <IconCalculator className="size-5" />,
    category: "Loans",
  },
]

const loanHubFaqs = [
  {
    question: "Which loan calculator should I run before applying?",
    answer:
      "Begin with eligibility and EMI calculators, then evaluate prepayment and balance-transfer scenarios. This sequence gives a more realistic affordability and cost picture.",
  },
  {
    question: "Is lower EMI always better?",
    answer:
      "Not always. Lower EMI often means longer tenure and higher total interest. Compare EMI comfort with total repayment cost and prepayment flexibility.",
  },
  {
    question: "How do I decide between prepayment and investing surplus?",
    answer:
      "Use prepay-vs-invest style comparison with your expected post-tax return, loan rate, and risk tolerance. The right decision depends on both numbers and behavior.",
  },
  {
    question: "When does a balance transfer actually make sense?",
    answer:
      "A transfer is useful when rate reduction meaningfully beats processing and legal costs, and remaining tenure is long enough to recover switching costs.",
  },
  {
    question: "Can these calculators help in bank communication too?",
    answer:
      "Yes. Use letter-generator tools for prepayment, ROI reduction, foreclosure, and interest certificate requests with clearer branch-ready drafts.",
  },
]

function LoanCalculatorsPage() {
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
              <IconHomeDollar className="size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Loan EMI Calculators
              </h1>
              <p className="text-muted-foreground">
                12 calculators for home, car, personal, and education loans
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loanTools.map((tool) => (
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
            Borrow smarter: affordability first, optimization second
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
              Loan decisions are usually made in the wrong order. Many borrowers
              start with property budget or dealership offers before checking
              durable EMI affordability. A better sequence is eligibility,
              repayment resilience, and then optimization.
            </p>
            <p>
              Use eligibility and EMI calculators to establish a safe monthly
              commitment under your existing obligations. Then test stress
              cases: rate increase, delayed bonus, or temporary income dip. If
              the loan still feels manageable, move to prepayment and transfer
              calculators to improve total cost over the full tenure.
            </p>
            <p>
              For existing borrowers, optimization is often where large savings
              are unlocked. Even modest prepayments early in tenure can reduce
              interest substantially. Similarly, balance transfer can work well
              when done with a clear break-even lens and realistic fee inputs.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Checklist before committing to EMI
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Existing EMI and expense load under conservative income
                  assumptions.
                </li>
                <li>
                  Emergency corpus availability before down payment stretch.
                </li>
                <li>
                  Processing, legal, insurance, and maintenance add-ons
                  included.
                </li>
                <li>
                  Prepayment and foreclosure terms reviewed from lender policy.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                High-impact optimization opportunities
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Annual part-prepayment using bonus or variable income.</li>
                <li>Rate renegotiation requests before switching lenders.</li>
                <li>
                  Balance transfer only after clear fee-adjusted savings test.
                </li>
                <li>
                  Tax-benefit and loan-structure alignment for net effective
                  cost.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <FAQSection items={loanHubFaqs} />
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
              to="/tools/investment-calculators"
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <IconChartBar className="size-4" />
              Investment
            </Link>
          </div>
        </div>

        <section className="mt-14">
          <ToolLongformHowTo
            toolName="Loan EMI Calculators"
            category="loans"
            updated="April 2026"
          />
        </section>
      </div>
    </div>
  )
}
