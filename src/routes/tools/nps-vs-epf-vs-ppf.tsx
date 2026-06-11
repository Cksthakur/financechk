import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateRetirement } from "@/lib/calculators/retirement"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/nps-vs-epf-vs-ppf")({
  head: () =>
    generateSeoMeta({
      title: "NPS vs EPF vs PPF Calculator — Retirement Comparison",
      description:
        "Compare India's 'Big Three' retirement instruments. Project your maturity corpus, understand EEE vs EET taxation, and plan your retirement.",
      path: "/tools/nps-vs-epf-vs-ppf",
    }),
  component: NpsEpfPpfComparison,
})

const faqs = [
  {
    question: "What does EEE mean in taxation?",
    answer:
      "EEE stands for Exempt-Exempt-Exempt. It means your investment is tax-deductible under Section 80C (Exempt), the interest accumulated every year is tax-free (Exempt), and the final maturity amount on withdrawal is entirely tax-free (Exempt). Both PPF and EPF fall under this highly coveted EEE category.",
  },
  {
    question: "Is NPS fully tax-free on retirement?",
    answer:
      "No. The National Pension System (NPS) follows an EET (Exempt-Exempt-Taxable) structure. While you get tax deductions during investment and the accumulation is tax-free, at age 60, only 60% of the corpus can be withdrawn tax-free as a lumpsum. The remaining 40% MUST be used to buy an annuity, and the monthly pension you receive from that annuity is taxable as per your income tax slab.",
  },
  {
    question: "What happens if I invest more than ₹1.5 Lakhs a year in PPF?",
    answer:
      "The government strictly caps PPF deposits at ₹1,50,000 per financial year across all your PPF accounts. Any amount deposited above this limit will not earn any interest and will not be eligible for Section 80C tax deductions. The bank will usually return the excess amount without interest.",
  },
  {
    question: "Which option gives the highest returns historically?",
    answer:
      "Historically, NPS (Tier 1 Equity) has provided the highest returns, often ranging between 10% to 14%, because it is market-linked and allows up to 75% equity exposure. EPF provides a high fixed return (currently 8.25%), while PPF provides the lowest but safest fixed return (currently 7.1%).",
  },
]

const howToSteps = [
  "Enter your current age and your planned retirement age (standard is 60).",
  "Enter the amount you plan to invest every month into your retirement fund.",
  "The calculator will project your maturity corpus across NPS, EPF, and PPF using current and historical rates.",
  "Review the detailed breakdown of tax-free vs taxable components for each instrument.",
  "Decide on the right mix of risk-free debt (EPF/PPF) and market-linked growth (NPS).",
]

function NpsEpfPpfComparison() {
  const [currentAge, setCurrentAge] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("age")) || 30
      )
    return 30
  })
  const [retirementAge, setRetirementAge] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("retAge")) || 60
      )
    return 60
  })
  const [monthlyInvestment, setMonthlyInvestment] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("inv")) || 10000
      )
    return 10000
  })

  // Prevent invalid ages
  const safeCurrentAge = Math.min(Math.max(18, currentAge), 65)
  const safeRetirementAge = Math.max(safeCurrentAge + 1, retirementAge)

  const result = useMemo(
    () =>
      calculateRetirement({
        currentAge: safeCurrentAge,
        retirementAge: safeRetirementAge,
        monthlyInvestment,
      }),
    [safeCurrentAge, safeRetirementAge, monthlyInvestment]
  )

  const maxCorpus = Math.max(
    result.ppfCorpus,
    result.epfCorpus,
    result.npsCorpus
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "NPS vs EPF vs PPF Calculator" },
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
          NPS vs EPF vs PPF Calculator: Retirement Planning Master Tool
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Compare India's 'Big Three' retirement instruments. Project your
          maturity corpus, understand the 'Taxation Trap' (EEE vs EET), and plan
          your path to financial independence.
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
          Your Profile
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <SliderField
            label="Current Age"
            value={currentAge}
            onChange={setCurrentAge}
            min={18}
            max={65}
            step={1}
            formatValue={(v) => `${v} yrs`}
          />
          <SliderField
            label="Retirement Age"
            value={retirementAge}
            onChange={setRetirementAge}
            min={currentAge + 1}
            max={70}
            step={1}
            formatValue={(v) => `${v} yrs`}
          />
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Monthly Investment Amount"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              max={10_00_000}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Maturity Projections (At Age {safeRetirementAge})
        </p>

        <div className="mb-6 rounded-2xl bg-secondary p-5">
          <div className="flex flex-col gap-4">
            <ComparisonBar
              label="NPS (10% expected)"
              value={result.npsCorpus}
              maxValue={maxCorpus}
              color="bg-foreground"
            />
            <ComparisonBar
              label="EPF (8.25% fixed)"
              value={result.epfCorpus}
              maxValue={maxCorpus}
              color="bg-fc-gain"
            />
            <ComparisonBar
              label="PPF (7.1% fixed)"
              value={result.ppfCorpus}
              maxValue={maxCorpus}
              color="bg-[var(--fc-warm-gray)]"
              note={
                monthlyInvestment > 12500
                  ? "Capped at ₹1.5L/year limit"
                  : undefined
              }
            />
          </div>
        </div>

        <ResultGrid>
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  National Pension System (NPS)
                </p>
                <p className="text-xs text-muted-foreground">
                  Market-linked (Assumed 10% returns)
                </p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
                Highest Growth
              </span>
            </div>

            <div className="mt-2">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Total Corpus
              </p>
              <p className="mt-1 font-mono text-3xl font-bold text-foreground">
                {formatCurrency(result.npsCorpus)}
              </p>
            </div>

            <div className="flex gap-4 border-t border-border pt-3">
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Tax-Free Lumpsum (60%)
                </p>
                <p className="font-mono text-sm font-medium text-fc-gain-text">
                  {formatCurrency(result.npsLumpsum)}
                </p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Mandatory Annuity (40%)
                </p>
                <p className="font-mono text-sm font-medium text-fc-amber">
                  {formatCurrency(result.npsAnnuity)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Employees' Provident Fund (EPF)
                </p>
                <p className="text-xs text-muted-foreground">
                  Fixed return (Current 8.25%)
                </p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
                Best Fixed Rate
              </span>
            </div>

            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Total Corpus (Tax-Free)
                </p>
                <p className="mt-1 font-mono text-3xl font-bold text-foreground">
                  {formatCurrency(result.epfCorpus)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Public Provident Fund (PPF)
                </p>
                <p className="text-xs text-muted-foreground">
                  Fixed return (Current 7.1%)
                </p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
                Safest
              </span>
            </div>

            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Total Corpus (Tax-Free)
                </p>
                <p className="mt-1 font-mono text-3xl font-bold text-foreground">
                  {formatCurrency(result.ppfCorpus)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Invested Limit
                </p>
                <p className="font-mono text-sm font-medium">
                  {formatCompactCurrency(result.ppfTotalInvested)}
                </p>
              </div>
            </div>
          </div>
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            age: currentAge,
            retAge: retirementAge,
            inv: monthlyInvestment,
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
            How to use this retirement comparison calculator
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
            The Ultimate Guide to India's Retirement Trifecta: NPS, EPF, and PPF
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
              Planning for retirement in India typically revolves around three
              pillars heavily promoted by the government: the Employees'
              Provident Fund (EPF), the Public Provident Fund (PPF), and the
              National Pension System (NPS). While they all offer tax benefits
              under Section 80C, each instrument serves a vastly different
              purpose in a long-term portfolio.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              1. The Taxation Trap: Understanding EEE vs EET
            </h3>
            <p>
              When comparing these three options, the single biggest mistake
              investors make is solely looking at the current interest rate. The
              true deciding factor is the{" "}
              <strong className="font-semibold text-foreground">
                tax status at maturity
              </strong>
              .
            </p>
            <ul className="ml-6 list-disc space-y-4">
              <li>
                <strong className="font-semibold text-foreground">
                  EPF and PPF are EEE (Exempt-Exempt-Exempt):
                </strong>{" "}
                This is the gold standard of taxation. Your investment is
                deductible (Exempt), the interest earned every year is tax-free
                (Exempt), and the massive corpus you withdraw at retirement is
                completely tax-free (Exempt). Every rupee our calculator shows
                you for EPF and PPF is exactly what hits your bank account.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  NPS is EET (Exempt-Exempt-Taxable):
                </strong>{" "}
                NPS is more complex. While accumulation is tax-free, at age 60,
                you can only withdraw 60% of the corpus as a tax-free lumpsum.
                The remaining 40%{" "}
                <strong className="font-semibold text-foreground">must</strong>{" "}
                be used to purchase an annuity (a monthly pension plan). This
                monthly pension is treated as taxable income and taxed at your
                future income tax slab rate.
              </li>
            </ul>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              2. EPF: The Salaried Person's Automatic Millionaire Tool
            </h3>
            <p>
              If you are a salaried employee, the Employees' Provident Fund
              (EPF) is likely your largest fixed-income asset. It currently
              offers a sovereign-backed return of{" "}
              <strong className="font-semibold text-foreground">8.25%</strong>,
              which is arguably the highest risk-free, tax-free return available
              in the global economy today.
            </p>
            <p>
              If you want to accelerate your retirement, you can opt for the
              Voluntary Provident Fund (VPF), which allows you to contribute up
              to 100% of your basic salary and DA into the same account, earning
              the same 8.25% tax-free interest (subject to a ₹2.5 Lakh annual
              cap on interest taxability).
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              3. PPF: The Ultimate Safety Net for Everyone
            </h3>
            <p>
              The Public Provident Fund (PPF) is the quintessential Indian
              savings instrument. It offers a guaranteed return (currently{" "}
              <strong className="font-semibold text-foreground">7.1%</strong>)
              and absolute capital safety. The 15-year lock-in period acts as a
              forced discipline tool, preventing you from raiding your
              retirement fund for impulsive purchases.
            </p>
            <p>
              However, the government strictly caps PPF deposits at{" "}
              <strong className="font-semibold text-foreground">
                ₹1.5 Lakhs per financial year
              </strong>
              . This cap means that for high-earners, PPF alone cannot fund a
              comfortable retirement. It must be supplemented with NPS or Mutual
              Funds.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              4. NPS: The High-Growth Equity Engine
            </h3>
            <p>
              NPS is the only retirement instrument in India that allows you to
              harness the power of the stock market. By opting for "Active
              Choice," you can allocate up to{" "}
              <strong className="font-semibold text-foreground">
                75% of your portfolio to Equity (Asset Class E)
              </strong>
              .
            </p>
            <p>
              Over a 20-30 year horizon, this equity exposure typically
              generates a 10% to 14% CAGR, which outperforms the fixed returns
              of EPF and PPF by a massive margin. Furthermore, NPS offers an
              exclusive ₹50,000 tax deduction under Section 80CCD(1B), which is
              over and above the standard ₹1.5 Lakh limit of Section 80C.
            </p>

            <div className="my-8 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                The Winning Strategy
              </h4>
              <p className="text-foreground">
                Don't choose just one. A perfectly balanced Indian retirement
                portfolio uses <strong className="font-bold">EPF</strong> as the
                stable debt foundation,{" "}
                <strong className="font-bold">PPF</strong> as the long-term
                emergency bucket, and{" "}
                <strong className="font-bold">NPS (with 75% equity)</strong> to
                ensure your wealth grows faster than inflation. Run multiple
                scenarios on our calculator to see how small changes in your
                monthly investment today can result in crores of difference at
                age 60.
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
            Retirement planning in India is as much about tax efficiency as it
            is about returns. Understanding the nuances of the Income Tax Act
            2025 and how it treats different asset classes is vital for building
            a robust corpus. Read our definitive guide on the latest tax changes
            for salaried employees.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/income-tax-act-2025-changes"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Income Tax Act 2025: Retirement & Savings Impact
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
            name: "NPS vs EPF vs PPF Calculator",
            url: "https://financechk.com/tools/nps-vs-epf-vs-ppf",
            description:
              "The most detailed comparison tool for Indian retirement savings. Compare NPS, EPF, and PPF maturity corpus with updated FY 2024-25 tax rules.",
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
            name: "How to compare NPS, EPF and PPF returns",
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

function ComparisonBar({
  label,
  value,
  maxValue,
  color,
  note,
}: {
  label: string
  value: number
  maxValue: number
  color: string
  note?: string
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className="font-mono font-medium text-foreground"
          style={{ letterSpacing: "-0.02em" }}
        >
          {formatCurrency(value)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${color} bar-animate`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {note && (
        <p className="mt-1 text-[10px] text-muted-foreground/60">{note}</p>
      )}
    </div>
  )
}
