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
import { calculateGratuity } from "@/lib/calculators/gratuity"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/gratuity-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Gratuity Calculator India 2025 | Formula & Tax Exemption",
      description:
        "Calculate gratuity payable using the Payment of Gratuity Act formula. Check eligibility, tax exemption under Section 10(10), and taxable portion.",
      path: "/tools/gratuity-calculator",
      keywords: [
        "gratuity calculator India",
        "gratuity calculation formula India",
        "gratuity calculator payment of gratuity act",
        "gratuity amount calculator 2025",
        "gratuity tax exemption 20 lakh calculator",
        "how to calculate gratuity in India",
      ],
    }),
  component: GratuityCalculator,
})

const faqs = [
  {
    question: "What is the gratuity formula under the Payment of Gratuity Act?",
    answer:
      "For employees covered under the Act, gratuity is calculated as: (Last drawn Basic + DA) × 15 × completed years of service / 26. This calculator applies the same base formula and shows the resulting tax view.",
  },
  {
    question: "Is gratuity taxable in India?",
    answer:
      "Gratuity is exempt up to the applicable limit under Section 10(10), subject to conditions. Any amount above the exempt portion is treated as taxable income in this estimate.",
  },
  {
    question: "Is gratuity eligible after 4 years and 240 days?",
    answer:
      "A common interpretation treats service of 4 years plus 240 days as near-eligibility in some cases, but treatment can depend on facts and legal position. Use this calculator for planning and verify at settlement time.",
  },
  {
    question: "What is the maximum gratuity exemption under Section 10(10)?",
    answer:
      "This page uses the data note limit of INR 20 lakh as exemption ceiling for computation context. Always validate with current law updates for your employment category.",
  },
  {
    question: "How is last drawn salary defined for gratuity calculation?",
    answer:
      "For gratuity computation, the salary base typically uses Basic plus Dearness Allowance (DA). Other allowances are generally not part of the core gratuity wage formula.",
  },
]

const howToSteps = [
  "Enter your last drawn monthly Basic salary and Dearness Allowance (DA).",
  "Choose years and months of service for completed service calculation.",
  "Select employment type (covered / not covered by the Act).",
  "Review gratuity amount, exemption, taxable portion and eligibility.",
  "Use the result to plan resignation, retirement, or settlement decisions.",
]

function GratuityCalculator() {
  const [basicSalary, setBasicSalary] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("basic")) || 50000
    }
    return 50000
  })

  const [dearnessAllowance, setDearnessAllowance] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("da")) || 0
    }
    return 0
  })

  const [yearsOfService, setYearsOfService] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("years")) || 10
    }
    return 10
  })

  const [monthsOfService, setMonthsOfService] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("months")) || 0
    }
    return 0
  })

  const [retirementType, setRetirementType] = useState<
    "resignation" | "superannuation" | "death"
  >(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const value = params.get("type")
      if (value === "superannuation" || value === "death") return value
    }
    return "resignation"
  })

  const [employmentType, setEmploymentType] = useState<
    "covered" | "not-covered"
  >(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return params.get("employment") === "not-covered"
        ? "not-covered"
        : "covered"
    }
    return "covered"
  })

  const result = useMemo(
    () =>
      calculateGratuity({
        lastDrawnBasicSalary: basicSalary,
        lastDrawnDearnessAllowance: dearnessAllowance,
        yearsOfService,
        monthsOfService,
        retirementType,
        employmentType,
      }),
    [
      basicSalary,
      dearnessAllowance,
      yearsOfService,
      monthsOfService,
      retirementType,
      employmentType,
    ]
  )

  const coveredFormulaPreview =
    ((basicSalary + dearnessAllowance) * 15 * result.effectiveYearsOfService) /
    26
  const notCoveredFormulaPreview =
    ((basicSalary + dearnessAllowance) * 15 * result.effectiveYearsOfService) /
    30

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Gratuity Calculator" },
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
          Gratuity Calculator - Formula, Tax Exemption & Eligibility
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Use this gratuity calculator India employees can use to estimate
          gratuity payable, tax exemption and taxable amount using last drawn
          Basic + DA and completed years of service.
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
          Gratuity Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Last Drawn Basic Salary"
            value={basicSalary}
            onChange={setBasicSalary}
            min={0}
            max={5000000}
          />
          <CurrencyInput
            label="Dearness Allowance (DA)"
            value={dearnessAllowance}
            onChange={setDearnessAllowance}
            min={0}
            max={5000000}
          />

          <SliderField
            label="Years of Service"
            value={yearsOfService}
            onChange={setYearsOfService}
            min={0}
            max={40}
            step={1}
            formatValue={(v) => `${v} years`}
          />
          <SliderField
            label="Additional Months"
            value={monthsOfService}
            onChange={setMonthsOfService}
            min={0}
            max={11}
            step={1}
            formatValue={(v) => `${v} months`}
          />

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Employment Type
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["covered", "Covered by Act"],
                  ["not-covered", "Not Covered by Act"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setEmploymentType(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    employmentType === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Case Type
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["resignation", "Resignation"],
                  ["superannuation", "Superannuation"],
                  ["death", "Death"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setRetirementType(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    retirementType === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Gratuity Summary
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: result.eligible
              ? "var(--fc-warm-stone)"
              : "var(--fc-loss-bg)",
            boxShadow: result.eligible
              ? "rgba(78,50,23,0.04) 0px 6px 16px"
              : undefined,
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {result.eligible ? "Estimated Gratuity" : "Eligibility Status"}
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {result.eligible
              ? formatCompactCurrency(result.gratuityAmount)
              : "Not Eligible Yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Effective completed service used: {result.effectiveYearsOfService}{" "}
            years
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Gratuity Amount"
            value={formatCompactCurrency(result.gratuityAmount)}
            subtitle={formatCurrency(result.gratuityAmount)}
          />
          <ResultCard
            label="Tax-Exempt Portion"
            value={formatCompactCurrency(result.exemptionLimit)}
            subtitle="Section 10(10) estimate"
            variant="gain"
          />
          <ResultCard
            label="Taxable Portion"
            value={formatCompactCurrency(result.taxableAmount)}
            subtitle="Added to taxable income"
            variant={result.taxableAmount > 0 ? "loss" : "default"}
          />
        </ResultGrid>

        <ResultGrid cols={2} className="mt-3">
          <ResultCard
            label="Formula (Covered)"
            value={formatCompactCurrency(coveredFormulaPreview)}
            subtitle="Salary × 15 × years / 26"
          />
          <ResultCard
            label="Formula (Not Covered)"
            value={formatCompactCurrency(notCoveredFormulaPreview)}
            subtitle="Salary × 15 × years / 30"
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            basic: basicSalary,
            da: dearnessAllowance,
            years: yearsOfService,
            months: monthsOfService,
            type: retirementType,
            employment: employmentType,
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
            How the gratuity calculation formula works
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
            Latest gratuity rules and limits
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
              <li>Covered formula: Salary × 15 × years / 26</li>
              <li>Not covered formula: Salary × 15 × years / 30</li>
              <li>
                Maximum exemption reference: INR 20,00,000 under Section 10(10)
              </li>
              <li>
                Eligibility baseline: typically 5 years of completed service
                (case-dependent)
              </li>
            </ul>
            <p>
              This gratuity amount calculator helps you test resignation,
              superannuation and death-case scenarios so you can estimate
              settlement outcomes before HR finalization.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Retirement Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Continue planning with long-term retirement corpus tools.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/epf-vpf-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              EPF / VPF Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/swp-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              SWP Calculator
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
            name: "Gratuity Calculator India",
            description:
              "Calculate gratuity payable with formula, exemption and taxable split for Indian employees.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/gratuity-calculator",

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
