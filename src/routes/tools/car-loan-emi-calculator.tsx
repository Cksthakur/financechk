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
import { calculateLoan } from "@/lib/calculators/loans"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { PayoffChart } from "@/components/finance/payoff-chart"
import { AmortizationTable } from "@/components/finance/amortization-table"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/car-loan-emi-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Car Loan EMI Calculator — Full Amortization Schedule",
      description:
        "Calculate your auto loan EMI, view your full amortization schedule, and see exactly how much interest you pay on a depreciating asset.",
      path: "/tools/car-loan-emi-calculator",
    }),
  component: CarLoanEmiCalculator,
})

const faqs = [
  {
    question: "What is a Car Loan EMI?",
    answer:
      "An Equated Monthly Installment (EMI) is the fixed amount you pay your bank every month to clear your auto loan. It includes both the principal repayment and the interest charged on the outstanding balance.",
  },
  {
    question: "Should I take a 3-year or 7-year car loan?",
    answer:
      "A shorter tenure (3 years) means a higher monthly EMI but significantly lower total interest paid. A longer tenure (7 years) gives you a comfortable low EMI, but you end up paying lakhs more in interest for a depreciating asset. Mathematically, the shorter the tenure on a car loan, the better.",
  },
  {
    question: "Are car loan interest rates fixed or floating?",
    answer:
      "Most auto loans in India are fixed-rate loans, meaning your EMI stays exactly the same throughout the tenure, regardless of RBI repo rate changes. This is different from home loans, which are usually floating.",
  },
]

const howToSteps = [
  "Enter your total car loan amount (the amount you are borrowing, excluding your down payment).",
  "Enter the interest rate offered by the dealer or bank (typically between 8% to 12%).",
  "Set your loan tenure in years and months.",
  "Check your exact Monthly EMI and the total interest you will pay to the bank over the lifetime of the loan.",
]

function CarLoanEmiCalculator() {
  const [principalAmount, setPrincipalAmount] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("principal")) ||
        10_00_000
      )
    return 10_00_000
  })
  const [interestRate, setInterestRate] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 9.5
      )
    return 9.5
  })
  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("years")) || 5
      )
    return 5
  })
  const [tenureMonths, setTenureMonths] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("months")) || 0
      )
    return 0
  })

  const result = useMemo(
    () =>
      calculateLoan({
        principalAmount,
        interestRate,
        tenureYears,
        tenureMonths,
      }),
    [principalAmount, interestRate, tenureYears, tenureMonths]
  )

  const interestPercentage =
    result.totalPayment > 0
      ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Car Loan EMI Calculator" },
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
          Car Loan EMI Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate your auto loan EMI, view your full amortization schedule,
          and see exactly how much interest you are paying on a depreciating
          asset.
        </p>
        <LastUpdated date="April 2026" author="Rajat" />
      </div>

      {/* Calculator card */}
      <div
        className="rounded-2xl bg-card p-5 md:p-6"
        style={{
          boxShadow:
            "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
        }}
      >
        <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Auto Loan Details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Loan Amount (Principal)"
              value={principalAmount}
              onChange={setPrincipalAmount}
              max={5_00_00_000}
            />
          </div>

          <SliderField
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={7}
            max={20}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <SliderField
                label="Tenure (Years)"
                value={tenureYears}
                onChange={setTenureYears}
                min={1}
                max={10}
                step={1}
                formatValue={(v) => `${v} Yr`}
              />
            </div>
            <div className="flex-1">
              <SliderField
                label="(Months)"
                value={tenureMonths}
                onChange={setTenureMonths}
                min={0}
                max={11}
                step={1}
                formatValue={(v) => `${v} Mo`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Loan Summary
        </p>

        {/* Primary result */}
        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Monthly EMI
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.emi)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.emi)} per month
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Total Principal"
            value={formatCompactCurrency(principalAmount)}
            subtitle="Amount borrowed"
          />
          <ResultCard
            label="Total Interest Paid"
            value={formatCompactCurrency(result.totalInterest)}
            subtitle={`${interestPercentage}% of total payment`}
            variant="loss"
          />
        </ResultGrid>

        {/* Visualizations */}
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
                    row.month === result.schedule.length
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

        <ShareResult
          className="mt-6"
          params={{
            principal: principalAmount,
            rate: interestRate,
            years: tenureYears,
            months: tenureMonths,
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
            The True Cost of Financing a Depreciating Asset: Car Loan 101
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
              Unlike a home loan where the underlying asset (property) typically
              appreciates in value, a car loan finances an asset that actively
              loses value the moment you drive it out of the showroom. This
              makes car loans one of the most critical areas where middle-class
              wealth is silently eroded. In the Indian context, where cars are
              still considered status symbols, many people over-leverage
              themselves on auto debt without understanding the long-term impact
              on their net worth.
            </p>
            <p>
              Consider the{" "}
              <strong className="font-semibold text-foreground">
                Double Whammy Effect
              </strong>
              : Your car loses roughly 10% of its market value on day one (due
              to registration and road tax taxes), and depreciates by about 50%
              over the first three years of ownership. Simultaneously, you are
              paying 9% to 11% interest to the bank on the original purchase
              price.
            </p>
            <p>
              If you take a ₹10 Lakh car loan for 7 years at 10% interest, you
              will end up paying nearly ₹4 Lakhs in pure interest to the lender.
              By the time your 7-year loan is fully paid off, your car might
              only be worth ₹3 Lakhs in the used car market (like Spinny or
              Cars24). Essentially, you spent ₹14 Lakhs to own an asset worth ₹3
              Lakhs.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              The 20/4/10 Rule for Smart Car Buying
            </h3>
            <p>
              To ensure your car doesn't prevent you from reaching other
              financial goals like buying a house or retiring early, most
              financial experts recommend the "20/4/10 Rule":
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong className="font-semibold text-foreground">
                  20% Down Payment:
                </strong>{" "}
                Never take a 100% on-road loan. Paying 20% upfront ensures you
                never owe more than the car is worth in the second-hand market.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  4-Year Max Tenure:
                </strong>{" "}
                Avoid 7 or 8-year tenures. Your loan should finish while the car
                is still relatively fresh. Long tenures result in massive
                interest leakage.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  10% of Monthly Income:
                </strong>{" "}
                Your total auto-related expenses (EMI + Insurance + Fuel +
                Maintenance) should never exceed 10% of your gross monthly
                take-home pay.
              </li>
            </ul>
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
            The Dealer Trap: Flat Rate vs. Reducing Balance Rate
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
              When you walk into a dealership, the finance executive might offer
              you a car loan at an unbelievably low interest rate—say, 7%.
              Before you sign, you must ask one critical question:{" "}
              <em className="italic">
                "Is this a flat rate or a reducing balance rate?"
              </em>
            </p>
            <ul className="ml-6 list-disc space-y-4">
              <li>
                <strong className="font-semibold text-foreground">
                  Flat Interest Rate (The Trap):
                </strong>{" "}
                Under this system, the bank calculates interest on the total
                original principal amount for the entire tenure. It completely
                ignores the fact that your monthly EMIs are constantly reducing
                the principal balance. A 7% flat rate effectively behaves like a
                ~13% reducing balance rate.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Reducing Balance Rate (The Industry Standard):
                </strong>{" "}
                This is the formula our calculator uses (and what all major
                banks like HDFC, ICICI, and SBI use). Interest is calculated
                only on the outstanding principal at the end of each month. As
                you pay your EMIs, the principal drops, and your interest
                component shrinks over time.
              </li>
            </ul>
            <p>
              Always demand the full amortization schedule from the dealer and
              compare their quoted monthly EMI with the result from our
              calculator. If their EMI is higher, they are hiding a flat rate or
              heavy processing fees.
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
            Prepayment and Foreclosure Rules in India
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
              Since car loans are usually fixed-rate loans (unlike home loans),
              RBI regulations on foreclosure are slightly different.
            </p>
            <p>
              While banks cannot charge foreclosure fees on floating-rate home
              loans, they frequently charge{" "}
              <strong className="font-semibold text-foreground">
                2% to 5% as a prepayment penalty
              </strong>{" "}
              on fixed-rate car loans. Before prepaying your loan to save
              interest, use this calculator to see if the interest saved is
              significantly higher than the foreclosure penalty.
            </p>
            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Check Your Loan Eligibility
              </h4>
              <p className="text-foreground">
                Buying a car often impacts your ability to get a home loan
                later. Banks check your FOIR (Fixed Obligation to Income Ratio)
                before approving high-value loans. Use our{" "}
                <a
                  href="/tools/home-loan-eligibility-calculator"
                  className="font-semibold text-primary underline decoration-muted-foreground underline-offset-4 hover:decoration-primary"
                >
                  Home Loan Eligibility Calculator
                </a>{" "}
                to see how much your car EMI will reduce your future home buying
                power.
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
            A car is a depreciating asset, yet it's one of the biggest financial
            commitments most Indians make. Understanding the impact of
            high-interest debt on your long-term wealth is crucial. Learn how
            auto loans affect your home buying power and how to navigate the
            2025 tax landscape.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/home-loan-eligibility-all-banks-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              How Car EMIs Reduce Your Home Loan Eligibility
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
            name: "Car Loan EMI Calculator",
            url: "https://financechk.com/tools/car-loan-emi-calculator",
            description:
              "Calculate your auto loan EMI and amortization schedule.",
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
