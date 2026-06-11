import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateUSTax } from "@/lib/calculators/us-tax"
import { formatCompactUSD, formatUSD } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/us-federal-income-tax-calculator")(
  {
    head: () =>
      generateSeoMeta({
        title:
          "US Federal Income Tax Calculator 2025 - Calculate Your Tax Liability",
        description:
          "Calculate your US federal income tax liability with our free calculator. Compare tax brackets from 2015-2025. See how the Tax Cuts and Jobs Act affects your refund.",
        path: "/tools/us-federal-income-tax-calculator",
      }),
    component: USTaxCalculator,
  }
)

const filingStatuses = [
  { value: "single", label: "Single" },
  { value: "married_joint", label: "Married Filing Jointly" },
  { value: "married_separate", label: "Married Filing Separately" },
  { value: "head_of_household", label: "Head of Household" },
] as const

const faqs = [
  {
    question: "What is the US federal income tax system?",
    answer:
      "The US uses a progressive tax system where different portions of your income are taxed at different rates. Your first dollar is taxed at the lowest rate (10%), and as your income increases, each additional dollar is taxed at higher rates (12%, 22%, 24%, 32%, 35%, and 37%).",
  },
  {
    question: "What changed in 2018 with the Tax Cuts and Jobs Act (TCJA)?",
    answer:
      "The TCJA, passed in December 2017 and effective from 2018, made several major changes: reduced the number of tax brackets from 7 to 7 (but changed rates), lowered the top rate from 39.6% to 37%, nearly doubled the standard deduction, and suspended personal exemptions through 2025.",
  },
  {
    question: "What happens to tax brackets in 2026?",
    answer:
      "Most TCJA individual tax provisions are scheduled to expire after 2025. Without congressional action, tax rates will revert to pre-2018 levels, the standard deduction will roughly halve, and personal exemptions will return. This is often called the 'tax cliff'.",
  },
  {
    question: "What is the standard deduction?",
    answer:
      "The standard deduction is a set amount that reduces your taxable income. For 2025, it's $15,000 for single filers and $30,000 for married couples filing jointly. It increased significantly in 2018 due to the TCJA.",
  },
  {
    question: "What is the difference between marginal and effective tax rate?",
    answer:
      "Your marginal tax rate is the rate on your last dollar of income (e.g., if you're in the 22% bracket, your marginal rate is 22%). Your effective tax rate is your actual tax divided by your total income, which is always lower because only portions of your income are taxed at higher rates.",
  },
]

const howToSteps = [
  "Enter your annual taxable income (wages, salary, etc.).",
  "Select your filing status (Single, Married Filing Jointly, etc.).",
  "Choose the tax year you want to calculate for.",
  "View your tax liability, effective rate, and historical comparison.",
]

function USTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("income")) ||
        75000
      )
    return 75000
  })
  const [filingStatus, setFilingStatus] = useState<
    "single" | "married_joint" | "married_separate" | "head_of_household"
  >(() => {
    if (typeof window !== "undefined") {
      const status = new URLSearchParams(window.location.search).get("status")
      if (
        status === "single" ||
        status === "married_joint" ||
        status === "married_separate" ||
        status === "head_of_household"
      )
        return status
    }
    return "single"
  })
  const [year, setYear] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("year")) || 2025
      )
    return 2025
  })

  const result = useMemo(
    () =>
      calculateUSTax({
        annualIncome,
        filingStatus,
        year,
      }),
    [annualIncome, filingStatus, year]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "US Federal Tax Calculator" },
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
          US Federal Income Tax Calculator for NRIs
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate your US federal income tax liability with historical
          comparison. Perfect for Indian NRIs working in USA. See how tax
          brackets have evolved from 2015 to 2025.
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
          Your Income Details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Annual Taxable Income ($)"
              value={annualIncome}
              onChange={setAnnualIncome}
              max={10_000_000}
              currency="USD"
              placeholder="$75,000"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Filing Status
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {filingStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilingStatus(status.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    filingStatus === status.value
                      ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <SliderField
              label="Tax Year"
              value={year}
              onChange={setYear}
              min={2015}
              max={2025}
              step={1}
              formatValue={(v) => `${v}`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Tax Computation ({year})
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total Tax Liability
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatUSD(result.currentYear.taxLiability)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Effective Tax Rate:{" "}
            <strong className="text-foreground">
              {result.currentYear.effectiveRate}%
            </strong>{" "}
            · Marginal Rate:{" "}
            <strong className="text-foreground">
              {result.currentYear.marginalRate}%
            </strong>
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Taxable Income"
            value={formatCompactUSD(result.currentYear.taxableIncome)}
            subtitle="After standard deduction"
          />
          <ResultCard
            label="Standard Deduction"
            value={formatCompactUSD(
              annualIncome - result.currentYear.taxableIncome
            )}
            subtitle={`${year} year`}
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            income: annualIncome,
            status: filingStatus,
            year: year,
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
            Tax Bracket Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Income in Bracket
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Tax
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.currentYear.brackets
                  .filter((b) => b.incomeInBracket > 0)
                  .map((bracket, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {bracket.rate}%
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatCompactUSD(bracket.incomeInBracket)}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        {formatCompactUSD(bracket.taxInBracket)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
            Historical Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Year
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Tax Liability
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Change
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Effective Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.previousYears.map((item) => (
                  <tr key={item.year} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.year}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {formatCompactUSD(item.result.taxLiability)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${item.change > 0 ? "text-fc-loss-text" : item.change < 0 ? "text-fc-gain-text" : "text-muted-foreground"}`}
                    >
                      {item.change > 0 ? "+" : ""}
                      {formatCompactUSD(item.change)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {item.result.effectiveRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            How to use this calculator
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

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Deepen Your Knowledge
          </h3>
          <p className="mb-6 text-muted-foreground">
            Understanding how US tax brackets work is essential for tax
            planning. Learn about the TCJA changes, what's expiring in 2026, and
            how to prepare.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/us-federal-income-tax-brackets-2015-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              US Federal Tax Brackets: Complete 10-Year Guide for NRIs
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/blog/us-income-tax-calculator-how-much-tax-do-i-pay"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              How Much Tax Do I Pay on $100,000 Income?
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "US Federal Income Tax Calculator for NRIs",
            url: "https://financechk.com/tools/us-federal-income-tax-calculator",
            description:
              "Free US federal income tax calculator for Indian NRIs. Calculate tax liability with 2015-2025 bracket comparison.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to calculate US federal income tax",
            step: howToSteps.map((text, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              text,
            })),
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
