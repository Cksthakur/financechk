import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { CurrencyInput } from "@/components/finance/currency-input"
import { FAQSection } from "@/components/finance/faq-section"
import { GeneratorActions } from "@/components/finance/generator-actions"
import { LastUpdated } from "@/components/finance/last-updated"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { ShareResult } from "@/components/finance/share-result"
import { SliderField } from "@/components/finance/slider-field"
import { ToolLayout } from "@/components/layout/tool-layout"
import { formatCompactCurrency } from "@/lib/format"
import { generateSalaryHikeTaxImpact } from "@/lib/generators/salary-hike-tax-impact"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/tools/salary-hike-tax-impact-calculator"
)({
  head: () =>
    generateSeoMeta({
      title:
        "Salary Hike Tax Impact Calculator India | Net Take-Home Change + 90-Day Plan",
      description:
        "Estimate post-hike tax impact, additional annual tax, and monthly net gain. Generate optimization moves, payroll email draft, and 90-day action plan.",
      path: "/tools/salary-hike-tax-impact-calculator",
      keywords: [
        "salary hike tax impact calculator",
        "post hike take home calculator India",
        "salary increment tax planning",
        "bonus tax impact calculator",
        "payroll tds projection after hike",
      ],
    }),
  component: SalaryHikeTaxImpactCalculatorPage,
})

const faqs = [
  {
    question: "What is this tool useful for after appraisal?",
    answer:
      "It translates gross hike into post-tax monthly impact and gives an execution plan so your net gain is optimized, not eroded by unmanaged TDS.",
  },
  {
    question: "Does it include bonus impact?",
    answer:
      "Yes. You can enter variable pay/bonus and see how it changes estimated annual tax and monthly net increase.",
  },
  {
    question: "Can I switch old/new regime in this tool?",
    answer:
      "Yes. Pick regime to compare how the same hike behaves under current slab structures.",
  },
  {
    question: "Does this replace payroll computation?",
    answer:
      "No. It gives a reliable planning estimate. Always verify final TDS with payroll system outputs.",
  },
  {
    question: "Can I share generated action plan with payroll?",
    answer:
      "Yes. The payroll email and action checklist can be copied/downloaded directly.",
  },
]

function SalaryHikeTaxImpactCalculatorPage() {
  const [currentAnnualSalary, setCurrentAnnualSalary] = useState(1800000)
  const [hikePercent, setHikePercent] = useState(12)
  const [bonus, setBonus] = useState(200000)
  const [oldRegimeDeductions, setOldRegimeDeductions] = useState(225000)
  const [oldRegimeHomeLoanInterest, setOldRegimeHomeLoanInterest] =
    useState(180000)
  const [preferredRegime, setPreferredRegime] = useState<"old" | "new">("new")

  const result = useMemo(
    () =>
      generateSalaryHikeTaxImpact({
        currentAnnualSalary,
        hikePercent,
        bonus,
        oldRegimeDeductions,
        oldRegimeHomeLoanInterest,
        preferredRegime,
      }),
    [
      currentAnnualSalary,
      hikePercent,
      bonus,
      oldRegimeDeductions,
      oldRegimeHomeLoanInterest,
      preferredRegime,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Salary Hike Tax Impact Calculator" },
      ]}
    >
      <div className="mb-6">
        <h1
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "46px",
            letterSpacing: "-0.92px",
            lineHeight: 1.08,
          }}
        >
          Salary Hike Tax Impact Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Convert your increment into real post-tax take-home and generate a
          90-day tax optimization action plan.
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
          Salary Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Current Annual Salary"
            value={currentAnnualSalary}
            onChange={setCurrentAnnualSalary}
            min={0}
            max={100000000}
          />

          <CurrencyInput
            label="Bonus / Variable Pay"
            value={bonus}
            onChange={setBonus}
            min={0}
            max={10000000}
          />

          <SliderField
            label="Hike Percentage"
            value={hikePercent}
            onChange={setHikePercent}
            min={0}
            max={60}
            step={0.5}
            formatValue={(value) => `${value.toFixed(1)}%`}
          />

          <SliderField
            label="Preferred Regime (0 = Old, 1 = New)"
            value={preferredRegime === "old" ? 0 : 1}
            onChange={(value) =>
              setPreferredRegime(value < 0.5 ? "old" : "new")
            }
            min={0}
            max={1}
            step={1}
            formatValue={(value) => (value < 0.5 ? "Old" : "New")}
          />

          <CurrencyInput
            label="Old Regime Deductions"
            value={oldRegimeDeductions}
            onChange={setOldRegimeDeductions}
            min={0}
            max={1000000}
          />

          <CurrencyInput
            label="Old Regime Home Loan Interest"
            value={oldRegimeHomeLoanInterest}
            onChange={setOldRegimeHomeLoanInterest}
            min={0}
            max={500000}
          />
        </div>
      </div>

      <div className="mt-7 space-y-6">
        <ResultGrid>
          <ResultCard
            label="Projected Gross Annual"
            value={formatCompactCurrency(result.projectedGrossAnnual)}
            subtitle="Post hike + bonus"
          />
          <ResultCard
            label="Incremental Gross"
            value={formatCompactCurrency(result.incrementalGross)}
            subtitle="Absolute increase"
          />
          <ResultCard
            label="Additional Annual Tax"
            value={formatCompactCurrency(result.additionalTax)}
            subtitle="Estimated increase"
            variant={result.additionalTax > 0 ? "loss" : "default"}
          />
          <ResultCard
            label="Monthly Net Increase"
            value={formatCompactCurrency(result.monthlyNetIncrease)}
            subtitle="After estimated tax"
            variant={result.monthlyNetIncrease > 0 ? "gain" : "default"}
          />
        </ResultGrid>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">
            {result.summary}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Optimization Moves
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.optimizationMoves.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              90-Day Action Plan
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.actionPlan90Days.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Payroll Email Draft
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.payrollEmailDraft}
          </pre>
          <GeneratorActions
            title="Payroll Tax Projection Email"
            content={result.payrollEmailDraft}
            fileName={`salary-hike-tax-impact-email-${preferredRegime}.txt`}
            className="mt-4"
          />
        </div>

        <ShareResult
          params={{
            salary: currentAnnualSalary,
            hike: hikePercent,
            bonus,
            regime: preferredRegime,
          }}
        />
      </div>

      <div className="mt-14">
        <FAQSection items={faqs} />
      </div>
    </ToolLayout>
  )
}
