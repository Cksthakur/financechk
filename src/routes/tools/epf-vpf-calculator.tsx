import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateEPF } from "@/lib/calculators/epf"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/epf-vpf-calculator")({
  head: () =>
    generateSeoMeta({
      title: "EPF VPF Calculator India | PF Corpus at Retirement",
      description:
        "Project EPF and VPF retirement corpus with employee + employer contribution, EPF interest compounding and EPS split. Free PF corpus calculator.",
      path: "/tools/epf-vpf-calculator",
      keywords: [
        "EPF calculator India",
        "EPF corpus calculator retirement",
        "VPF calculator India",
        "PF balance projection calculator",
        "EPF interest calculator 2025-26",
        "EPF maturity amount calculator",
        "UAN EPF balance estimator",
      ],
    }),
  component: EpfVpfCalculatorPage,
})

const faqs = [
  {
    question: "What is the current EPF interest rate for FY 2025-26?",
    answer:
      "Use the latest officially notified EPF rate for your planning year. This calculator is prefilled with 8.25% based on the provided dataset context and lets you model long-term PF corpus.",
  },
  {
    question: "Is EPF maturity amount tax-free?",
    answer:
      "EPF is generally treated as a tax-efficient retirement instrument under specified conditions. Final tax treatment can depend on contribution and withdrawal rules applicable at the time of exit.",
  },
  {
    question: "How much does employer contribute to EPF vs EPS?",
    answer:
      "Employer statutory contribution is split between EPF and EPS components. This calculator separately tracks EPF-side contribution and EPS contribution estimate for retirement planning.",
  },
  {
    question: "Can I increase PF contribution beyond 12% via VPF?",
    answer:
      "Yes. VPF allows higher employee-side contribution beyond statutory minimum. Use the VPF slider to see how additional contribution impacts final retirement corpus.",
  },
  {
    question: "How is EPF interest calculated - monthly or annually?",
    answer:
      "EPF interest is credited using EPFO rules over contribution balances. This calculator uses an annualized projection model for planning, not claim-settlement exact accounting.",
  },
]

const howToSteps = [
  "Enter current monthly Basic + DA used for PF calculation.",
  "Set annual salary increment to project future PF contributions.",
  "Select employee contribution percentage and extra VPF percentage.",
  "Set current PF balance and years to retirement.",
  "Review employee + employer contribution, interest and final PF corpus.",
]

function EpfVpfCalculatorPage() {
  const [monthlySalary, setMonthlySalary] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("salary")) ||
        50000
      )
    }
    return 50000
  })

  const [annualSalaryIncrement, setAnnualSalaryIncrement] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("increment")) ||
        8
      )
    }
    return 8
  })

  const [currentBalance, setCurrentBalance] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("balance")) || 0
      )
    }
    return 0
  })

  const [employeeContributionPercent, setEmployeeContributionPercent] =
    useState(() => {
      if (typeof window !== "undefined") {
        return (
          Number(new URLSearchParams(window.location.search).get("empPct")) ||
          12
        )
      }
      return 12
    })

  const [vpfAdditionalPercent, setVpfAdditionalPercent] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("vpfPct")) || 0
      )
    }
    return 0
  })

  const [yearsToRetirement, setYearsToRetirement] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("years")) || 20
      )
    }
    return 20
  })

  const annualRate = 8.25

  const employeeContribution =
    monthlySalary * ((employeeContributionPercent + vpfAdditionalPercent) / 100)

  const employerTotalContribution = monthlySalary * 0.12
  const employerEpsContribution = Math.min(monthlySalary, 15000) * 0.0833
  const employerEpfContribution = Math.max(
    employerTotalContribution - employerEpsContribution,
    0
  )

  const result = useMemo(
    () =>
      calculateEPF({
        monthlySalary,
        employeeContribution,
        employerContribution: employerEpfContribution,
        currentBalance,
        annualRate,
        years: yearsToRetirement,
        annualSalaryIncrement,
      }),
    [
      monthlySalary,
      employeeContribution,
      employerEpfContribution,
      currentBalance,
      annualRate,
      yearsToRetirement,
      annualSalaryIncrement,
    ]
  )

  const pensionableSalary = Math.min(monthlySalary, 15000)
  const epsPensionEstimateMonthly =
    yearsToRetirement >= 10 ? (pensionableSalary * yearsToRetirement) / 70 : 0

  const monthlyCombinedContribution =
    employeeContribution + employerEpfContribution

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "EPF / VPF Calculator" },
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
          EPF & VPF Calculator - Retirement Corpus from PF Contributions
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Use this EPF calculator India page to project PF corpus at retirement,
          including employee contribution, employer EPF share, VPF top-up and
          annual compounding.
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
          PF Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Monthly Basic + DA"
            value={monthlySalary}
            onChange={setMonthlySalary}
            min={0}
            max={5000000}
          />
          <CurrencyInput
            label="Current PF Balance"
            value={currentBalance}
            onChange={setCurrentBalance}
            min={0}
            max={100000000}
          />

          <SliderField
            label="Annual Salary Increment"
            value={annualSalaryIncrement}
            onChange={setAnnualSalaryIncrement}
            min={0}
            max={20}
            step={0.5}
            formatValue={(v) => `${v}%`}
          />
          <SliderField
            label="Years to Retirement"
            value={yearsToRetirement}
            onChange={setYearsToRetirement}
            min={1}
            max={40}
            step={1}
            formatValue={(v) => `${v} years`}
          />

          <SliderField
            label="Employee PF Contribution"
            value={employeeContributionPercent}
            onChange={setEmployeeContributionPercent}
            min={12}
            max={100}
            step={1}
            formatValue={(v) => `${v}%`}
          />
          <SliderField
            label="Additional VPF"
            value={vpfAdditionalPercent}
            onChange={setVpfAdditionalPercent}
            min={0}
            max={88}
            step={1}
            formatValue={(v) => `${v}%`}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          EPF Projection Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Projected PF Corpus at Retirement
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalBalance)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.totalBalance)} with EPF rate {annualRate}%
          </p>
        </div>

        <ResultGrid cols={4}>
          <ResultCard
            label="Monthly Combined PF"
            value={formatCompactCurrency(monthlyCombinedContribution)}
            subtitle="Employee + employer EPF"
          />
          <ResultCard
            label="Employee Contribution"
            value={formatCompactCurrency(result.totalEmployeeContributions)}
            subtitle="Including VPF"
          />
          <ResultCard
            label="Employer EPF"
            value={formatCompactCurrency(result.totalEmployerContributions)}
            subtitle="EPF component only"
          />
          <ResultCard
            label="Interest Earned"
            value={formatCompactCurrency(result.totalInterest)}
            subtitle="Compounding gain"
            variant="gain"
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="EPS Contribution Total"
            value={formatCompactCurrency(result.epsPensionContributionTotal)}
            subtitle="Estimated pension bucket"
          />
          <ResultCard
            label="EPS Pension Estimate"
            value={
              epsPensionEstimateMonthly > 0
                ? `${formatCurrency(Math.round(epsPensionEstimateMonthly))}/mo`
                : "Service < 10 years"
            }
            subtitle="Simplified formula: Pensionable salary × service / 70"
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Salary/Month
                  </th>
                  <th className="px-4 py-4 text-right font-medium">Employee</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Employer EPF
                  </th>
                  <th className="px-4 py-4 text-right font-medium">EPS</th>
                  <th className="px-4 py-4 text-right font-medium">Interest</th>
                  <th className="px-4 py-4 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.yearlyBreakdown.map((row) => (
                  <tr
                    key={row.year}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      Year {row.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.monthlySalary)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {formatCurrency(row.employeeContrib)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {formatCurrency(row.employerContrib)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.epsContrib)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fc-gain-text">
                      +{formatCurrency(row.interest)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                      {formatCurrency(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            salary: monthlySalary,
            increment: annualSalaryIncrement,
            balance: currentBalance,
            empPct: employeeContributionPercent,
            vpfPct: vpfAdditionalPercent,
            years: yearsToRetirement,
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
            How this EPF corpus calculator works
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
            EPF and VPF rules used
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <ul className="ml-6 list-disc space-y-2">
              <li>EPF interest rate reference: 8.25% p.a.</li>
              <li>Employee PF contribution baseline: 12% of Basic + DA</li>
              <li>
                Employer EPF share: 3.67% equivalent after EPS split logic
              </li>
              <li>
                Employer EPS share: 8.33% up to salary ceiling of INR 15,000
              </li>
              <li>Additional VPF contribution modeled on employee side</li>
            </ul>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Retirement Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Compare PF corpus planning with other retirement income tools.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/swp-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              SWP Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/gratuity-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Gratuity Calculator
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
            "@type": "SoftwareApplication",
            name: "EPF VPF Calculator India",
            description:
              "Project retirement corpus from EPF and VPF contributions with employer split and annual growth.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/epf-vpf-calculator",

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
