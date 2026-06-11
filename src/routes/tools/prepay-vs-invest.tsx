import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { SliderField } from "@/components/finance/slider-field"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculatePrepayVsInvest } from "@/lib/calculators/prepay-vs-invest"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/prepay-vs-invest")({
  head: () =>
    generateSeoMeta({
      title:
        "Prepay Home Loan vs. Invest Calculator — The Ultimate Decision Tool",
      description:
        "Should you kill your debt or grow your wealth? Compare interest saved by prepaying your home loan against the compounding returns of a mutual fund SIP.",
      path: "/tools/prepay-vs-invest",
    }),
  component: PrepayVsInvestCalculator,
})

const faqs = [
  {
    question: "Is it better to prepay my home loan or invest?",
    answer:
      "Mathematically, if the after-tax return on your investment is higher than your home loan interest rate, investing is the better choice. Psychologically, however, many people prefer the peace of mind that comes with a debt-free life. A common compromise strategy is a 50/50 split between both options.",
  },
  {
    question: "Does the home loan tax benefit change the math?",
    answer:
      "Yes, significantly. The Section 24(b) deduction effectively lowers your 'borrowing cost.' For example, if you pay 8.5% interest but claim a ₹2 Lakh deduction in the 30% tax bracket, your 'effective' interest rate is only around 6%. This makes investing (where you can earn 12%+) even more attractive compared to prepaying.",
  },
  {
    question: "When does prepaying make more sense?",
    answer:
      "Prepaying is superior if your loan interest rate is high (e.g., above 11% for personal or car loans), if you have already exhausted your income tax benefits, if you have a very low risk appetite, or if you are nearing retirement and want to eliminate all mandatory monthly expenses.",
  },
  {
    question: "Can I do both—prepay and invest—simultaneously?",
    answer:
      "Absolutely. Many financial advisors recommend splitting your surplus cash—use 50% to systematically prepay your loan principal and 50% to start a diversified mutual fund SIP. This allows you to build wealth while simultaneously reducing your liabilities.",
  },
]

const howToSteps = [
  "Enter your current outstanding home loan amount and the remaining tenure in years.",
  "Enter the interest rate you are currently paying to the bank.",
  "Specify the extra surplus amount you can save every month (which you would either use to prepay or invest).",
  "Enter the expected annual return rate if you were to invest this surplus in mutual funds or stocks.",
  "Review the 'Verdict' banner to see exactly how many lakhs you gain or lose by choosing one option over the other.",
]

function PrepayVsInvestCalculator() {
  const [outstandingLoan, setOutstandingLoan] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("loan")) ||
        5000000
      )
    return 5000000
  })
  const [remainingTenureYears, setRemainingTenureYears] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("tenure")) || 15
      )
    return 15
  })
  const [loanInterestRate, setLoanInterestRate] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 8.5
      )
    return 8.5
  })
  const [extraMonthlyAmount, setExtraMonthlyAmount] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("extra")) ||
        10000
      )
    return 10000
  })
  const [expectedReturnRate, setExpectedReturnRate] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("return")) || 12
      )
    return 12
  })

  const result = useMemo(
    () =>
      calculatePrepayVsInvest({
        outstandingLoan,
        remainingTenureYears,
        loanInterestRate,
        extraMonthlyAmount,
        expectedReturnRate,
      }),
    [
      outstandingLoan,
      remainingTenureYears,
      loanInterestRate,
      extraMonthlyAmount,
      expectedReturnRate,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Prepay vs Invest Calculator" },
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
          Prepay Home Loan vs. Invest Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          The definitive tool to solve the biggest debate in Indian personal
          finance. Should you kill your debt or grow your wealth? Compare
          interest saved against wealth generated.
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
          Loan & Investment Details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Outstanding Loan Amount"
            value={outstandingLoan}
            onChange={setOutstandingLoan}
            max={500_00_000}
          />
          <SliderField
            label="Remaining Tenure"
            value={remainingTenureYears}
            onChange={setRemainingTenureYears}
            min={1}
            max={30}
            step={1}
            formatValue={(v) => `${Number(v).toFixed(0)} yrs`}
          />
          <SliderField
            label="Loan Interest Rate"
            value={loanInterestRate}
            onChange={setLoanInterestRate}
            min={5}
            max={15}
            step={0.1}
            formatValue={(v) => `${Number(v).toFixed(2)}%`}
          />

          <div
            className="col-span-1 pt-4 sm:col-span-2"
            style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
          >
            <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Surplus Cash
            </p>
          </div>

          <CurrencyInput
            label="Extra Monthly Amount"
            value={extraMonthlyAmount}
            onChange={setExtraMonthlyAmount}
            max={5_00_000}
          />
          <SliderField
            label="Expected Investment Return"
            value={expectedReturnRate}
            onChange={setExpectedReturnRate}
            min={5}
            max={20}
            step={0.5}
            formatValue={(v) => `${Number(v).toFixed(1)}%`}
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          The Verdict
        </p>

        {/* Winner banner */}
        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background:
              result.betterOption === "invest"
                ? "var(--fc-gain-bg)"
                : "var(--fc-warm-stone)",
            boxShadow:
              result.betterOption === "invest"
                ? undefined
                : "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {result.betterOption === "invest" ? "Investing" : "Prepaying"} is
            better by
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              result.betterOption === "invest"
                ? "text-fc-gain-text"
                : "text-foreground"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCurrency(result.netBenefit)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.betterOption === "invest"
              ? `Your investments earn more than the interest saved by prepaying the loan.`
              : `The interest saved by paying off the loan early is greater than investment returns.`}
          </p>
        </div>

        <ResultGrid cols={2}>
          {/* Option A: Prepay */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Option A: Prepay Loan
              </p>
              <p className="text-xs text-muted-foreground">
                Add ₹{formatCompactCurrency(extraMonthlyAmount)} to your EMI
              </p>
            </div>
            <div className="mt-auto">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Interest Saved
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-foreground">
                {formatCurrency(result.interestSaved)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Time Saved
              </p>
              <p className="mt-1 font-mono text-lg font-medium text-foreground">
                {Math.floor(result.tenureSavedMonths / 12)} years{" "}
                {result.tenureSavedMonths % 12} months
              </p>
            </div>
          </div>

          {/* Option B: Invest */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Option B: Invest in SIP
              </p>
              <p className="text-xs text-muted-foreground">
                Invest ₹{formatCompactCurrency(extraMonthlyAmount)} monthly at{" "}
                {expectedReturnRate}%
              </p>
            </div>
            <div className="mt-auto">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Wealth Generated
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-fc-gain">
                {formatCurrency(result.investTotalReturns)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Total Corpus
              </p>
              <p className="mt-1 font-mono text-lg font-medium text-foreground">
                {formatCurrency(result.investTotalCorpus)}
              </p>
            </div>
          </div>
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            loan: outstandingLoan,
            tenure: remainingTenureYears,
            rate: loanInterestRate,
            extra: extraMonthlyAmount,
            return: expectedReturnRate,
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
            The Prepay vs. Invest Dilemma: The Mathematical Truth
          </h2>
          <div
            className="flex flex-col gap-6 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              When you find yourself with surplus cash at the end of the
              month—or an annual corporate bonus—you face a crucial financial
              fork in the road: reduce your liabilities (debt) or increase your
              assets (investments). While the choice feels emotional, the answer
              is found in comparing the{" "}
              <strong className="font-semibold text-foreground">
                Effective Rates of Return
              </strong>{" "}
              of both options.
            </p>
            <p>
              If your home loan interest rate is 8.5%, every extra rupee you pay
              towards the principal gives you a guaranteed, risk-free, and
              tax-free return of exactly 8.5%. Because prepayments go entirely
              toward the principal (not the interest), they drastically reduce
              your loan tenure, saving you a massive amount of compound interest
              over the years.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              The Concept of "Effective Interest Rate"
            </h3>
            <p>
              However, 8.5% isn't usually your true cost of borrowing in India.
              If you are a salaried professional in the 20% or 30% tax bracket,
              the Income Tax Act (Section 24b) allows you to claim a deduction
              of up to ₹2,00,000 on home loan interest paid. This tax shield
              essentially means the government is subsidizing a portion of your
              interest.
            </p>
            <p>
              When you factor in this tax saving, an 8.5% home loan actually has
              an{" "}
              <strong className="font-semibold text-foreground">
                effective interest rate of roughly 6% to 6.5%
              </strong>
              .
            </p>
            <p>
              Now compare this to investing. If you invest that same surplus
              cash into an equity mutual fund SIP that historically generates
              12-15% annually, your money is growing at{" "}
              <em className="italic">double</em> the speed of your effective
              debt cost. Over a 15 or 20-year horizon, the exponential
              compounding effect of equity investing creates far more wealth
              than the interest saved by prepaying a subsidized home loan.
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
            Psychology vs. Mathematics: Should you prepay or invest?
          </h2>
          <div
            className="flex flex-col gap-6 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              While our calculator provides the absolute mathematical winner
              based on your inputs, personal finance is highly psychological.
              The "right" decision heavily depends on your comfort with debt,
              job security, and life stage.
            </p>
            <ul className="ml-6 list-disc space-y-4">
              <li>
                <strong className="font-semibold text-foreground">
                  When to strictly PREPAY:
                </strong>{" "}
                If the sheer thought of a ₹50 Lakh debt causes you anxiety or
                affects your mental well-being, mathematically optimal returns
                don't matter—pay it off. Prepayment is also superior if you are
                nearing retirement (and want to eliminate mandatory monthly
                outgoings), if you work in an industry with low job security, or
                if your loan is a high-interest unsecured personal loan
                (&gt;12%) where investing cannot reliably beat the debt cost.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  When to strictly INVEST:
                </strong>{" "}
                If you are in your 20s or 30s with a long runway for
                compounding, investing is almost always the winner. Equity
                markets are volatile in the short term but reliably outpace debt
                costs over 10+ year periods. Furthermore, if you are currently
                maximizing your Section 24(b) tax deduction, prepaying the loan
                actually <em className="italic">destroys</em> your tax shield,
                making investing the financially superior choice.
              </li>
            </ul>

            <div className="my-8 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                The 50/50 Strategy
              </h4>
              <p className="leading-relaxed text-foreground">
                Many savvy Indian investors choose a middle path. If you have a
                ₹20,000 monthly surplus, you can route ₹10,000 into a
                principal-reducing prepayment and ₹10,000 into a Nifty 50 Index
                Fund SIP. This gives you the satisfaction of seeing your loan
                tenure drop while simultaneously building an aggressive wealth
                corpus. Use our{" "}
                <a
                  href="/tools/sip-calculator"
                  className="font-bold text-primary underline"
                >
                  SIP Calculator
                </a>{" "}
                to see how that ₹10k monthly investment can grow over time.
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
            The math of debt-reduction vs. wealth-creation is deeply tied to
            Indian tax laws. Understanding your effective interest rate after
            Section 24(b) benefits and comparing it against long-term
            compounding is the key to financial freedom.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/section-80c-24b-home-loan-tax-benefits"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              How Home Loans Save You Lakhs in Tax: Section 80C & 24(b)
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
              to="/blog/sip-vs-lumpsum-vs-step-up-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              SIP vs Lump Sum: Which Wealth Strategy Wins?
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
            name: "Prepay Home Loan vs Invest Calculator",
            url: "https://financechk.com/tools/prepay-vs-invest",
            description:
              "The only interactive tool in India that compares home loan prepayment interest savings against mutual fund SIP returns, factoring in tax benefits and compounding.",
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
            name: "How to decide between prepaying home loan and investing",
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
