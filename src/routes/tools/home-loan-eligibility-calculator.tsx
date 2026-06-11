import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type { HomeLoanInput } from "@/lib/calculators/home-loan"
import { ToolLayout } from "@/components/layout/tool-layout"
import { SliderField } from "@/components/finance/slider-field"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { AmortizationTable } from "@/components/finance/amortization-table"
import { ShareResult } from "@/components/finance/share-result"
import { calculateHomeLoan } from "@/lib/calculators/home-loan"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/home-loan-eligibility-calculator")(
  {
    head: () =>
      generateSeoMeta({
        title: "Home Loan Eligibility Calculator India - Based on Salary",
        description:
          "Free home loan eligibility calculator for Indian salaried and self-employed. Calculate maximum loan amount based on salary, FOIR, credit score. Check eligibility for SBI, HDFC, ICICI home loans.",
        path: "/tools/home-loan-eligibility-calculator",
      }),
    component: HomeLoanCalculator,
  }
)

const employerTypes = [
  { value: "salaried-private" as const, label: "Private Salaried" },
  { value: "salaried-govt" as const, label: "Government" },
  { value: "self-employed" as const, label: "Self Employed" },
]

const faqs = [
  {
    question: "How is home loan eligibility calculated from salary?",
    answer:
      "Banks use the FOIR (Fixed Obligation to Income Ratio) method. They take 50-60% of your net monthly salary, subtract existing EMIs, and calculate the maximum loan you can afford at current interest rates for the chosen tenure.",
  },
  {
    question: "What is FOIR and how does it affect my loan amount?",
    answer:
      "FOIR is the percentage of your income banks allow for all EMI payments combined. Government employees get 60%, private salaried get 55%, and self-employed get 50%. Higher FOIR means higher loan eligibility.",
  },
  {
    question: "Does my employer type affect home loan eligibility?",
    answer:
      "Yes. Government employees are considered lower risk, so banks offer them a higher FOIR (60%) and sometimes better interest rates. Self-employed applicants get a lower FOIR (50%) as their income is considered variable.",
  },
  {
    question: "How much home loan can I get on a 50,000 salary?",
    answer:
      "On a ₹50,000 monthly salary with no existing EMIs, at 8.5% interest for 20 years, you can expect approximately ₹28-32 lakhs loan eligibility depending on your employer type and the bank.",
  },
  {
    question: "Should I increase tenure to get a higher loan amount?",
    answer:
      "Increasing tenure does increase eligibility since the EMI per lakh decreases. However, you'll pay significantly more interest over the loan lifetime. Most financial advisors recommend keeping tenure under 20 years if possible.",
  },
]

const howToSteps = [
  "Enter your monthly take-home salary (net of tax deductions).",
  "Add any existing EMI obligations like car loan or personal loan.",
  "Select your employer type — government, private, or self-employed.",
  "Adjust interest rate and tenure to match your expected loan terms.",
  "View your maximum eligibility, recommended EMI, and total cost.",
]

function HomeLoanCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("salary")) ||
        50000
      )
    return 50000
  })
  const [existingEMI, setExistingEMI] = useState(() => {
    if (typeof window !== "undefined")
      return Number(new URLSearchParams(window.location.search).get("emi")) || 0
    return 0
  })
  const [interestRate, setInterestRate] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 8.5
      )
    return 8.5
  })
  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("tenure")) || 20
      )
    return 20
  })
  const [employerType, setEmployerType] = useState<
    HomeLoanInput["employerType"]
  >(() => {
    if (typeof window !== "undefined") {
      const type = new URLSearchParams(window.location.search).get("employer")
      if (type === "salaried-govt" || type === "self-employed") return type
    }
    return "salaried-private"
  })

  const result = useMemo(
    () =>
      calculateHomeLoan({
        monthlySalary,
        existingEMI,
        interestRate,
        tenureYears,
        employerType,
      }),
    [monthlySalary, existingEMI, interestRate, tenureYears, employerType]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Home Loan Eligibility Calculator" },
      ]}
    >
      {/* Page header — Playfair Display, light weight */}
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
          Home Loan Eligibility Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Find out the maximum home loan you can get based on your salary,
          existing obligations, and employer type. Uses the FOIR method used by
          Indian banks.
        </p>
        <LastUpdated date="April 2026" author="Rajat" />
      </div>

      {/* Calculator card — ElevenLabs shadow-as-border styling */}
      <div
        className="rounded-2xl bg-card p-5 md:p-6"
        style={{
          boxShadow:
            "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
        }}
      >
        <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Your details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Monthly Net Salary (Take-home)"
            value={monthlySalary}
            onChange={setMonthlySalary}
          />

          <CurrencyInput
            label="Existing Monthly EMIs"
            value={existingEMI}
            onChange={setExistingEMI}
          />

          {/* Employer type — pill toggle */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Employer Type
            </label>
            <div className="flex flex-wrap gap-2">
              {employerTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEmployerType(type.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    employerType === type.value
                      ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <SliderField
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={6}
            max={15}
            step={0.05}
            formatValue={(v) => `${Number(v).toFixed(2)}%`}
          />

          <SliderField
            label="Loan Tenure"
            value={tenureYears}
            onChange={setTenureYears}
            min={5}
            max={30}
            step={1}
            formatValue={(v) => `${Number(v).toFixed(0)} yrs`}
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Your eligibility
        </p>

        {/* Primary result — warm stone background */}
        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Maximum loan eligibility
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.maxLoanAmount)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.maxLoanAmount)}
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Monthly EMI"
            value={formatCurrency(result.recommendedEMI)}
            subtitle="Recommended EMI"
          />
          <ResultCard
            label="Total Interest"
            value={formatCompactCurrency(result.totalInterest)}
            subtitle={`Over ${tenureYears} years`}
          />
          <ResultCard
            label="Total Payment"
            value={formatCompactCurrency(result.totalPayment)}
            subtitle="Principal + Interest"
          />
        </ResultGrid>

        {/* EMI per lakh info */}
        <div className="mt-4 rounded-xl bg-secondary p-4">
          <p
            className="text-muted-foreground"
            style={{
              fontSize: "16px",
              lineHeight: 1.5,
              letterSpacing: "0.16px",
            }}
          >
            At {interestRate}% for {tenureYears} years, EMI per ₹1 lakh is{" "}
            <span className="font-mono font-semibold text-foreground">
              ₹{result.emiPerLakh}
            </span>
          </p>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            salary: monthlySalary,
            emi: existingEMI,
            rate: interestRate,
            tenure: tenureYears,
            employer: employerType,
          }}
        />

        {/* Visualizations */}
        {result.maxLoanAmount > 0 && (
          <div className="mt-8 flex flex-col gap-8">
            <div
              className="rounded-2xl bg-card p-5 md:p-6"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
              }}
            >
              <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Principal vs Interest Paid Over Time
              </p>
              <PayoffChart
                data={(() => {
                  const yearlyData = []
                  let cumPrincipal = 0
                  let cumInterest = 0
                  for (const row of result.schedule) {
                    cumPrincipal += row.principal
                    cumInterest += row.interest
                    if (
                      row.month % 12 === 0 ||
                      row.month === tenureYears * 12
                    ) {
                      yearlyData.push({
                        year: row.year,
                        baseAmount: cumPrincipal,
                        growthAmount: cumInterest,
                      })
                    }
                  }
                  return yearlyData
                })()}
                baseLabel="Principal Paid"
                growthLabel="Interest Paid"
              />
            </div>

            <AmortizationTable schedule={result.schedule} />
          </div>
        )}
      </div>

      {/* Content sections — full page anatomy */}
      <div className="mt-14 flex flex-col gap-12">
        {/* HowTo section */}
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
            The Formula Banks Use: Understanding FOIR and EMI per Lakh
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              When you apply for a home loan, Indian banks (like SBI, HDFC, or
              ICICI) do not assign you a loan amount based on your gut feeling.
              They use a strict, legally compliant mathematical framework called{" "}
              <strong className="font-semibold text-foreground">
                FOIR (Fixed Obligation to Income Ratio)
              </strong>
              . This ratio ensures that you do not over-leverage yourself and
              helps the bank manage its credit risk.
            </p>
            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6 font-mono text-sm text-foreground md:text-base">
              <p className="mb-2">
                Max Monthly EMI = (Net Monthly Salary × FOIR) - Existing EMIs
              </p>
              <p>
                Total Loan Eligibility = (Max Monthly EMI / EMI per Lakh) ×
                1,00,000
              </p>
            </div>
            <p>
              <strong className="text-foreground">Worked Example:</strong> If
              your net take-home salary is ₹1,00,000 and you work for a private
              MNC, a typical bank will assign you a FOIR of 55%. This means they
              believe you can safely spend ₹55,000 on EMIs every month. If you
              already have a car loan of ₹15,000, your available capacity for a
              home loan EMI is ₹40,000. Our calculator uses this exact logic to
              reverse-calculate your total principal eligibility.
            </p>
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
            Why Your Employer Category Dictates Your Loan Size
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              In the eyes of a credit manager, not all incomes are equal. Banks
              categorize applicants into specific risk buckets based on the
              perceived stability of their employment. This categorization
              directly impacts the{" "}
              <strong className="font-semibold text-foreground">
                FOIR percentage
              </strong>{" "}
              applied to your salary.
            </p>
            <ul className="ml-6 list-disc space-y-4">
              <li>
                <strong className="font-semibold text-foreground">
                  Government Employees (60% FOIR):
                </strong>{" "}
                They enjoy the highest eligibility. Because the income is backed
                by the sovereign, job security is absolute, and increments are
                guaranteed, banks allow them to spend up to 60% of their income
                on debt.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Private Salaried (55% FOIR):
                </strong>{" "}
                The standard benchmark for employees in reputed MNCs or
                Category-A private firms. Income is stable, but job security is
                subject to market cycles, so banks slightly tighten the belt.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Self-Employed (50% FOIR):
                </strong>{" "}
                Business owners and freelancers face the most scrutiny. Due to
                the inherent volatility of business revenue, banks
                conservatively cap the EMI capacity at 50% and often require at
                least 3 years of consistently growing ITR filings.
              </li>
            </ul>
            <p>
              By selecting your correct employer type in our tool, you are
              getting a real-world approximation of what a bank's internal
              credit scoring system will actually approve.
            </p>
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
            How to Legally Increase Your Loan Eligibility
          </h2>
          <div
            className="flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              If our calculator shows your eligibility is slightly lower than
              the price of the property you want to buy, do not panic. There are
              five structural ways to boost your borrowing capacity:
            </p>
            <ol className="ml-6 list-decimal space-y-4">
              <li>
                <strong className="font-semibold text-foreground">
                  Add a Co-Applicant:
                </strong>{" "}
                By adding your working spouse, parent, or even a sibling as a
                co-borrower, you can club both incomes together. This instantly
                doubles your FOIR limit and significantly spikes your
                eligibility.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Increase the Tenure:
                </strong>{" "}
                Extending your loan from 15 years to 25 years reduces the "EMI
                per Lakh." Since the monthly burden drops, the bank is willing
                to lend a larger principal amount. (Caution: This increases your
                total interest outgo).
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Clear Existing Debt:
                </strong>{" "}
                Pay off your outstanding credit card debt or personal loans
                before applying. Freeing up that ₹10,000 monthly obligation
                directly adds to your home loan repayment capacity.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Declare Rental Income:
                </strong>{" "}
                If you own another property or have a side business, ensure you
                file them formally in your ITR. Banks will consider a portion of
                your rental income as part of your "Net Salary."
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Step-Up Loans:
                </strong>{" "}
                Some banks offer specific "Ghar Utsav" or Step-Up schemes for
                young professionals where the EMI is lower in the initial years
                (when your salary is lower) and increases as you grow in your
                career.
              </li>
            </ol>
            <div className="my-8 rounded-2xl border border-fc-gain/20 bg-fc-gain-bg p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-fc-gain-text uppercase">
                Pro Tip: The Interest Trap
              </h4>
              <p className="text-fc-gain-text/90">
                While increasing tenure boosts eligibility, it drastically
                increases your total cost. A 20-year loan at 9% means you pay
                back nearly{" "}
                <strong className="font-bold">2.5 times the principal</strong>.
                Use our{" "}
                <a
                  href="/tools/prepay-vs-invest"
                  className="font-bold underline"
                >
                  Prepay vs. Invest Tool
                </a>{" "}
                to plan how to close your loan faster once you actually move
                into your new home.
              </p>
            </div>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Deepen Your Knowledge
          </h3>
          <p className="mb-6 text-muted-foreground">
            Understanding your eligibility is just the first step. Different
            banks have different risk appetites. Some favor government
            employees, while others are aggressive with tech professionals. Read
            our 2025 comparison to see which bank is right for you.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/home-loan-eligibility-all-banks-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              SBI vs HDFC vs ICICI: Eligibility Criteria Compared
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

      {/* WebApplication + HowTo JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Home Loan Eligibility Calculator",
            url: "https://financechk.com/tools/home-loan-eligibility-calculator",
            description:
              "The definitive salary-based home loan eligibility calculator for India. Uses the FOIR method and employer categorization to project bank approval limits.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to calculate your home loan eligibility",
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
