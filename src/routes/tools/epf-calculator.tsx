import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import {
  IconCalculator,
  IconChevronRight,
  IconShieldCheck,
} from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { SliderField } from "@/components/finance/slider-field"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { ShareResult } from "@/components/finance/share-result"
import { calculateEPF } from "@/lib/calculators/epf"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/epf-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "EPF Calculator India - Employee Provident Fund Returns & Withdrawal Guide",
      description:
        "Free online EPF calculator for India. Calculate your Employees' Provident Fund (EPF) balance, interest earned, and retirement corpus. Check PF withdrawal eligibility, VPF contributions, and tax implications. Plan your retirement savings now.",
      path: "/tools/epf-calculator",
    }),
  component: EPFCalculator,
})

const faqs = [
  {
    question: "What is EPF (Employees' Provident Fund)?",
    answer:
      "EPF is a mandatory retirement savings scheme for Indian employees where both employer and employee contribute 12% of basic salary (dearness allowance). The employee contribution goes to EPF, while employer contribution is split: 3.67% to EPF and 8.33% to EPS (Employee Pension Scheme). With over 6 crore active members, EPF is India's largest retirement fund.",
  },
  {
    question: "What is the current EPF interest rate for 2025-26?",
    answer:
      "The EPF interest rate for FY 2025-26 is 8.25% p.a. (effective from April 2024). This rate is declared by the EPFO (Employees' Provident Fund Organisation) and is reviewed annually. The rate has gradually decreased from 8.75% (2020-21) to the current 8.25%. Despite the decline, EPF remains attractive as interest is tax-free, unlike taxable FDs.",
  },
  {
    question: "What is the difference between EPF and PPF?",
    answer:
      "EPF is mandatory for salary above ₹15,000 (after Feb 2021), while PPF is voluntary. EPF offers 8.25% vs PPF's 7.1%. EPF has lower minimum contribution (₹100/month vs ₹500/month), but PPF allows extending indefinitely while EPF has limited withdrawal options. For tax-free returns, both are excellent - EPF if you have mandatory contributions, PPF for additional voluntary savings.",
  },
  {
    question: "What is VPF (Voluntary Provident Fund)?",
    answer:
      "VPF allows employees to contribute more than the mandatory 12% to their EPF account. You can contribute up to 100% of your salary (basic + DA) to VPF. The entire VPF amount earns 8.25% interest (same as regular EPF) and is completely tax-free. It's an excellent option for high earners wanting to maximize tax-free retirement savings beyond the 80C limit.",
  },
  {
    question: "When can I withdraw from my EPF account?",
    answer:
      "EPF withdrawals are allowed: 1) After 2 months of unemployment (withdraw up to 100%); 2) For home construction/ purchase (after 5 years of service); 3) For marriage/education of children (after 7 years); 4) For medical emergencies (anytime with documents); 5) At retirement (58 years) - full settlement; 6) For EMI repayment (after 10 years). Partial withdrawal limits apply based on purpose.",
  },
  {
    question: "Is EPF interest taxable?",
    answer:
      "No, EPF interest is completely tax-free. Under Section 80C, your EPF contribution (up to ₹1.5 lakh) qualifies for tax deduction. The interest earned and maturity amount are also tax-free. This makes EPF one of the most tax-efficient investment options in India, with effective post-tax return of 8.25% (vs ~5.5% for taxable FDs for highest tax bracket).",
  },
  {
    question: "How is EPF contribution calculated?",
    answer:
      "For salary up to ₹15,000/month: Employee contributes 12% of (Basic + DA), Employer contributes 12% (3.67% to EPF, 8.33% to EPS). For salary above ₹15,000: Employee contributes 12% of salary (capped at 12% of ₹15,000 = ₹1,800), Employer contributes 12% of ₹15,000 (₹1,800). The excess employer contribution beyond 12% of salary limit goes to EPS pension.",
  },
  {
    question: "What is the UAN (Universal Account Number)?",
    answer:
      "UAN is a 12-digit unique number assigned to each EPF member that remains constant throughout your career, regardless of job changes. It helps track all EPF accounts across different employers. Activate UAN at epfindia.gov.in to avail online services like balance check (via SMS - SMS 'EPFOHO' to 7738299899), claim status, and transfer EPF between accounts.",
  },
]

const keyFeatures = [
  {
    title: "8.25% Guaranteed Rate",
    description:
      "Tax-free interest rate for FY 2025-26, higher than PPF (7.1%) and FD rates.",
  },
  {
    title: "EEE Tax Status",
    description:
      "Contributions, interest, and withdrawal - all completely tax-free under Section 80C.",
  },
  {
    title: "Dual Contribution",
    description:
      "Both employer (12%) and employee (12%) contribute, effectively 24% of basic salary.",
  },
  {
    title: "VPF Option",
    description:
      "Voluntary contribution beyond mandatory 12% for higher tax-free returns.",
  },
  {
    title: "Pension Benefits",
    description:
      "8.33% of employer contribution goes to EPS, eligible for pension after retirement.",
  },
  {
    title: "Online Services",
    description:
      "Check balance via SMS, UAN portal, transfer claims, and withdrawal - all online.",
  },
]

const withdrawalPurposes = [
  {
    purpose: "Retirement (58 years)",
    percentage: "100% of balance",
    condition: "Minimum 5 years service",
  },
  {
    purpose: "Unemployment (2 months)",
    percentage: "100% of balance",
    condition: "Any duration, no service needed",
  },
  {
    purpose: "Home Construction/Purchase",
    percentage: "Up to 90%",
    condition: "After 5 years of service",
  },
  {
    purpose: "Children's Education/Marriage",
    percentage: "Up to 50%",
    condition: "After 7 years of service",
  },
  {
    purpose: "Medical Emergency",
    percentage: "Up to 6 months wages",
    condition: "Any time with medical documents",
  },
  {
    purpose: "EMI Repayment",
    percentage: "Up to 90%",
    condition: "After 10 years of service",
  },
]

const howToSteps = [
  "Enter your monthly basic salary + dearness allowance (DA). This is your salary for EPF calculation.",
  "Enter your employee contribution percentage (usually 12%). You can increase this for VPF to save more tax-free.",
  "Enter employer's contribution (usually 12%). The employer contributes equally to your EPF.",
  "Enter any existing EPF balance from previous employers (transfer all old accounts to consolidate).",
  "Enter your current interest rate (8.25% for FY 2025-26) - or use the default.",
  "Enter years of service remaining until retirement to see your projected retirement corpus.",
]

function EPFCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("salary")) || 30000
    }
    return 30000
  })

  const [employeeContribution, setEmployeeContribution] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("employee")) || 3600
    }
    return 3600
  })

  const [employerContribution, setEmployerContribution] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("employer")) || 3600
    }
    return 3600
  })

  const [currentBalance, setCurrentBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("balance")) || 0
    }
    return 0
  })

  const [annualRate] = useState(8.25)

  const [years, setYears] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("years")) || 20
    }
    return 20
  })

  const result = useMemo(
    () =>
      calculateEPF({
        monthlySalary,
        employeeContribution,
        employerContribution,
        currentBalance,
        annualRate,
        years,
      }),
    [
      monthlySalary,
      employeeContribution,
      employerContribution,
      currentBalance,
      annualRate,
      years,
    ]
  )

  const totalContributions =
    currentBalance + (employeeContribution + employerContribution) * 12 * years
  const gainPercent =
    totalContributions > 0
      ? (
          ((result.totalBalance - totalContributions) / totalContributions) *
          100
        ).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "EPF Calculator" },
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
          EPF Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate your Employees' Provident Fund (EPF) balance and retirement
          corpus. EPF offers 8.25% tax-free returns - one of the highest
          guaranteed rates in India. Check your EPF contribution, interest
          earned, and plan for retirement. Also calculate VPF (Voluntary
          Provident Fund) for additional tax-free savings beyond 80C limit.
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
          Enter EPF details
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Monthly Basic Salary + DA (₹)"
            value={monthlySalary}
            onChange={setMonthlySalary}
            min={5000}
          />
          <CurrencyInput
            label="Existing EPF Balance (₹)"
            value={currentBalance}
            onChange={setCurrentBalance}
            min={0}
          />
          <CurrencyInput
            label="Monthly Employee Contribution (₹)"
            value={employeeContribution}
            onChange={setEmployeeContribution}
            min={100}
          />
          <CurrencyInput
            label="Monthly Employer Contribution (₹)"
            value={employerContribution}
            onChange={setEmployerContribution}
            min={0}
          />
          <div className="rounded-lg bg-blue-50 p-4 sm:col-span-2 dark:bg-blue-950/30">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="size-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Current EPF Rate: 8.25% p.a. (FY 2025-26)
              </span>
            </div>
          </div>
          <SliderField
            label="Years until Retirement"
            value={years}
            onChange={setYears}
            min={1}
            max={40}
            step={1}
            formatValue={(v) => `${v} Years`}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Your EPF projected returns
        </p>
        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total EPF Balance at Retirement
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalBalance)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.totalBalance)}
          </p>
        </div>
        <ResultGrid cols={4}>
          <ResultCard
            label="Your Contributions"
            value={formatCompactCurrency(result.totalEmployeeContributions)}
            subtitle={`${employeeContribution * 12} × ${years} yrs`}
          />
          <ResultCard
            label="Employer Contributions"
            value={formatCompactCurrency(result.totalEmployerContributions)}
            subtitle={`${employerContribution * 12} × ${years} yrs`}
          />
          <ResultCard
            label="Interest Earned"
            value={formatCompactCurrency(result.totalInterest)}
            subtitle={`${gainPercent}% gain`}
            variant="gain"
          />
          <ResultCard
            label="EPF Rate"
            value="8.25%"
            subtitle="Current FY rate"
          />
        </ResultGrid>

        <div
          className="mt-8 rounded-2xl bg-card p-5 md:p-6"
          style={{
            boxShadow:
              "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
          }}
        >
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Year-by-Year Growth
          </p>
          <PayoffChart
            data={result.yearlyBreakdown.map((row) => ({
              year: row.year,
              baseAmount: row.employeeContrib + row.employerContrib,
              growthAmount: row.interest,
            }))}
            baseLabel="Total Contributions"
            growthLabel="Interest Earned"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            salary: monthlySalary,
            employee: employeeContribution,
            employer: employerContribution,
            balance: currentBalance,
            years,
          }}
        />

        <div className="mt-8 rounded-xl bg-secondary/50 p-5">
          <div className="flex items-start gap-3">
            <IconCalculator className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                EPF Contribution Breakdown
              </p>
              <p className="text-sm text-muted-foreground">
                For salary below ₹15,000: Both employee and employer contribute
                12% of basic+DA. For salary above ₹15,000: Contribution capped
                at 12% of ₹15,000 (₹1,800 each). Employer contribution above
                this limit goes to EPS pension scheme.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            EPF Key Features
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {keyFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h4 className="font-semibold text-foreground">
                  {feature.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            EPF Withdrawal Options
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-foreground">
                    Purpose
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Amount
                  </th>
                  <th className="pb-3 text-left font-medium text-foreground">
                    Condition
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {withdrawalPurposes.map((wp, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">
                      {wp.purpose}
                    </td>
                    <td className="py-3">{wp.percentage}</td>
                    <td className="py-3">{wp.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Step-by-Step Guide
          </p>
          <div className="flex flex-col gap-3">
            {howToSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <FAQSection items={faqs} />

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/tools/ppf-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            PPF Calculator <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/nps-vs-epf-vs-ppf"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            NPS vs EPF vs PPF <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/compound-interest-calculator"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Compound Interest <IconChevronRight className="size-4" />
          </Link>
        </div>
      </div>
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
