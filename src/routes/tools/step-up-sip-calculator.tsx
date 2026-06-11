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
import { PayoffChart } from "@/components/finance/payoff-chart"
import { calculateStepUpSip } from "@/lib/calculators/investments"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/step-up-sip-calculator")({
  head: () =>
    generateSeoMeta({
      title: "Step-Up SIP Calculator — Wealth Accelerator",
      description:
        "Accelerate your wealth creation by increasing your SIP amount every year. Compare Step-Up SIP vs normal SIP returns.",
      path: "/tools/step-up-sip-calculator",
    }),
  component: StepUpSipCalculator,
})

function StepUpSipCalculator() {
  const [initialMonthlyInvestment, setInitialMonthlyInvestment] = useState(
    () => {
      if (typeof window !== "undefined")
        return (
          Number(new URLSearchParams(window.location.search).get("amount")) ||
          10000
        )
      return 10000
    }
  )
  const [expectedReturnRate, setExpectedReturnRate] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("rate")) || 12
      )
    return 12
  })
  const [stepUpPercentage, setStepUpPercentage] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("step")) || 10
      )
    return 10
  })
  const [tenureYears, setTenureYears] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("tenure")) || 15
      )
    return 15
  })

  const result = useMemo(
    () =>
      calculateStepUpSip({
        initialMonthlyInvestment,
        expectedReturnRate,
        stepUpPercentage,
        tenureYears,
      }),
    [
      initialMonthlyInvestment,
      expectedReturnRate,
      stepUpPercentage,
      tenureYears,
    ]
  )

  const gainPercent =
    result.totalInvested > 0
      ? ((result.estimatedReturns / result.totalInvested) * 100).toFixed(1)
      : "0"

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Step-Up SIP Calculator" },
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
          Step-Up SIP Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Accelerate your wealth creation by increasing your SIP amount every
          year in line with your salary hike.
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
          Investment details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Initial Monthly SIP Amount"
            value={initialMonthlyInvestment}
            onChange={setInitialMonthlyInvestment}
            max={10_00_000}
          />

          <SliderField
            label="Annual Step-Up (%)"
            value={stepUpPercentage}
            onChange={setStepUpPercentage}
            min={0}
            max={50}
            step={1}
            formatValue={(v) => `${v}%`}
          />

          <SliderField
            label="Expected Annual Return"
            value={expectedReturnRate}
            onChange={setExpectedReturnRate}
            min={1}
            max={30}
            step={0.5}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Investment Period"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={40}
            step={1}
            formatValue={(v) => `${v} yrs`}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Projected Returns
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total corpus
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.totalCorpus)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(result.totalCorpus)}
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Total Invested"
            value={formatCompactCurrency(result.totalInvested)}
            subtitle={`With ${stepUpPercentage}% annual hike`}
          />
          <ResultCard
            label="Wealth Gained"
            value={formatCompactCurrency(result.estimatedReturns)}
            subtitle={`${gainPercent}% absolute gain`}
            variant="gain"
          />
        </ResultGrid>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Wealth Growth Trajectory
          </p>
          <PayoffChart
            data={result.schedule.map((row) => ({
              year: row.year,
              baseAmount: row.invested,
              growthAmount: row.returns,
            }))}
            baseLabel="Amount Invested"
            growthLabel="Wealth Gained"
          />
        </div>

        <ShareResult
          className="mt-6"
          params={{
            amount: initialMonthlyInvestment,
            rate: expectedReturnRate,
            step: stepUpPercentage,
            tenure: tenureYears,
          }}
        />

        {/* Detailed Projection Table */}
        <div className="mt-8 rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-4 font-medium">Year</th>
                  <th className="px-4 py-4 text-right font-medium">
                    Monthly SIP
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    Total Invested
                  </th>
                  <th className="px-4 py-4 text-right font-medium text-foreground">
                    Total Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.schedule.map((row, i) => (
                  <tr
                    key={row.year}
                    className={`transition-colors hover:bg-muted/50 ${i % 2 === 0 ? "bg-card" : "bg-secondary/10"}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      Year {row.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(
                        row.year === 1
                          ? initialMonthlyInvestment
                          : Math.round(
                              initialMonthlyInvestment *
                                Math.pow(
                                  1 + stepUpPercentage / 100,
                                  row.year - 1
                                )
                            )
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.invested)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(row.corpus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
            <li
              className="flex gap-4 text-muted-foreground"
              style={{
                fontSize: "18px",
                lineHeight: 1.6,
                letterSpacing: "0.18px",
              }}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
                1
              </span>
              <span className="pt-1">
                <strong>Punch in your base SIP:</strong> Enter the amount you
                are comfortably investing every month right now.
              </span>
            </li>
            <li
              className="flex gap-4 text-muted-foreground"
              style={{
                fontSize: "18px",
                lineHeight: 1.6,
                letterSpacing: "0.18px",
              }}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
                2
              </span>
              <span className="pt-1">
                <strong>Set the annual bump:</strong> Typically, you should
                match this to your expected yearly salary increment. (10% is a
                safe nationwide average).
              </span>
            </li>
            <li
              className="flex gap-4 text-muted-foreground"
              style={{
                fontSize: "18px",
                lineHeight: 1.6,
                letterSpacing: "0.18px",
              }}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
                3
              </span>
              <span className="pt-1">
                <strong>Estimate returns & tenure:</strong> Indian equity mutual
                funds historically deliver around 12% over long horizons (10+
                years).
              </span>
            </li>
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
            The Mathematics of a Step-Up SIP: Why It Crushes a Regular SIP
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
              Most Indian investors start a Systematic Investment Plan (SIP)
              early in their careers and leave the monthly amount unchanged for
              decades. This is a fatal flaw in retirement planning because it
              completely ignores{" "}
              <strong className="font-semibold text-foreground">
                Lifestyle Creep
              </strong>{" "}
              and{" "}
              <strong className="font-semibold text-foreground">
                Salary Increments
              </strong>
              .
            </p>
            <p>
              A Step-Up SIP (also known as a Top-Up SIP) allows you to
              automatically increase your monthly investment amount by a fixed
              percentage every year. This simple, automated behavior aligns your
              investments directly with your annual salary appraisals.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              The 10% Step-Up Magic
            </h3>
            <p>
              Let's look at the raw math. Assume you start a standard SIP of
              ₹10,000 per month for 20 years at an expected return of 12%.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong className="font-semibold text-foreground">
                  Regular SIP:
                </strong>{" "}
                You invest a total of ₹24 Lakhs over 20 years. Your final corpus
                is approximately{" "}
                <strong className="font-semibold text-foreground">
                  ₹1 Crore
                </strong>
                .
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  10% Step-Up SIP:
                </strong>{" "}
                You increase your ₹10,000 SIP by just 10% every year. Year 2 it
                becomes ₹11,000/mo. Year 3 it becomes ₹12,100/mo. You end up
                investing a total of ₹68 Lakhs over 20 years. Your final corpus
                skyrockets to{" "}
                <strong className="font-semibold text-foreground">
                  ₹2.12 Crores
                </strong>
                .
              </li>
            </ul>
            <p>
              By simply matching your SIP increment to a standard corporate
              salary hike (10%), you have more than doubled your absolute wealth
              generated, without ever feeling a "pinch" in your monthly budget.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              Beating the Invisible Enemy: Inflation
            </h3>
            <p>
              ₹10,000 today holds significantly more purchasing power than
              ₹10,000 will hold 15 years from now. If you do not increase your
              SIP amount annually, the real value of your investments is
              silently shrinking against inflation every single month. A Step-Up
              SIP acts as a perfect hedge against inflation, ensuring that your
              capital deployment scales at the same rate as the cost of living.
            </p>

            <div className="my-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                When should you cap your Step-Up?
              </h4>
              <p className="text-foreground">
                A common fear is that compounding 10% annually will eventually
                make the monthly SIP amount unaffordable. Most mutual fund
                platforms (like Zerodha Coin or Groww) allow you to set a{" "}
                <strong className="font-semibold text-foreground">
                  "Max Cap"
                </strong>
                . For example, you can step up a ₹10k SIP by 10% annually until
                the monthly amount reaches ₹50,000, after which it will flatline
                at ₹50k for the remainder of the tenure.
              </p>
            </div>
          </div>
        </section>

        <FAQSection
          items={[
            {
              question: "What is a Step-Up SIP?",
              answer:
                "A Step-Up SIP allows you to automatically increase your monthly investment amount by a fixed percentage every year. It aligns perfectly with your annual salary increments and significantly boosts your final corpus compared to a normal SIP.",
            },
            {
              question:
                "How does a 10% annual step-up impact the final corpus?",
              answer:
                "A 10% annual step-up can nearly double your final corpus over a 20-year period compared to a regular SIP. Because you are adding more principal during your peak earning years, the absolute wealth generated is massively accelerated.",
            },
            {
              question:
                "Is there a penalty if I cannot step-up my SIP in a given year?",
              answer:
                "No. You have complete flexibility. A step-up SIP is not a legally binding contract. If you face a financial crunch, you can pause the step-up or reduce your SIP amount through your broker or mutual fund platform without any penalties.",
            },
          ]}
        />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Deepen Your Knowledge
          </h3>
          <p className="mb-6 text-muted-foreground">
            A Step-Up SIP is the ultimate hedge against lifestyle creep. By
            automating your investment growth alongside your salary hikes, you
            can reach your retirement goals years earlier. Compare the math
            against standard SIPs and lump sum strategies.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/sip-vs-lumpsum-vs-step-up-comparison"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              SIP vs Lump Sum vs Step-Up: The Ultimate Math Comparison
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
            name: "Step-Up SIP Calculator",
            url: "https://financechk.com/tools/step-up-sip-calculator",
            description:
              "Calculate mutual fund SIP returns with annual step-up increments.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          }),
        }}
      />
    </ToolLayout>
  )
}
