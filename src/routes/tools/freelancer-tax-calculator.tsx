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
import {
  AVAILABLE_FYS,
  calculateFreelanceTax,
} from "@/lib/calculators/freelance-tax"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/freelancer-tax-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "Freelancer Tax Calculator India - Section 44ADA Presumptive Income",
      description:
        "Free online freelancer tax calculator for Indian independent professionals. Calculate tax under Section 44ADA presumptive scheme for software consultants, writers, designers. Supports FY 2026-27.",
      path: "/tools/freelancer-tax-calculator",
    }),
  component: FreelancerTaxCalculator,
})

const faqs = [
  {
    question: "What is Section 44ADA?",
    answer:
      "Section 44ADA is a presumptive taxation scheme for professionals (like IT consultants, designers, doctors, and lawyers). It allows you to declare exactly 50% of your gross receipts as your profit, without needing to maintain detailed accounting books or audit your expenses.",
  },
  {
    question: "Who is eligible for Section 44ADA?",
    answer:
      "Resident individuals and partnership firms (excluding LLPs) engaged in specified professions. The gross receipts limit was ₹50 lakhs, but Budget 2023 increased it to ₹75 lakhs, provided that your cash receipts do not exceed 5% of total gross receipts.",
  },
  {
    question: "Do I need to pay tax on the remaining 50%?",
    answer:
      "No. The government presumes that 50% of your income went toward business expenses (like internet, software, office space, travel). You only pay income tax on the remaining 50% (your presumptive profit).",
  },
  {
    question: "Can I declare more than 50% as profit?",
    answer:
      "Yes, 50% is the minimum you must declare under 44ADA. If your actual profits are higher and you wish to declare them (for example, to show higher income for a home loan application), you can declare up to 100%.",
  },
  {
    question: "Do freelancers get the ₹75,000 standard deduction?",
    answer:
      "No. The standard deduction of ₹75,000 (New Regime FY 2026-27) is exclusively available to salaried employees and pensioners. Pure freelancers filing under ITR-4 (Section 44ADA) cannot claim this deduction.",
  },
]

const howToSteps = [
  "Enter your total Gross Receipts (total payments received from clients) for the financial year.",
  "Enter the percentage you wish to declare as profit (minimum 50% required by law).",
  "Enter any other income (like savings bank interest, FD interest, or dividends).",
  "The calculator automatically computes your presumptive income and total tax liability under the New Tax Regime.",
]

function FreelancerTaxCalculator() {
  const [financialYear, setFinancialYear] = useState(() => {
    if (typeof window !== "undefined") {
      const fy = new URLSearchParams(window.location.search).get("fy")
      if (fy && AVAILABLE_FYS.includes(fy)) return fy
    }
    return "FY2026-27"
  })
  const [grossReceipts, setGrossReceipts] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("gross")) ||
        20_00_000
      )
    return 20_00_000
  })
  const [profitPercentage, setProfitPercentage] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("pct")) || 50
      )
    return 50
  })
  const [otherIncome, setOtherIncome] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("other")) || 0
      )
    return 0
  })

  const result = useMemo(
    () =>
      calculateFreelanceTax({
        grossReceipts,
        profitPercentage,
        otherIncome,
        financialYear,
      }),
    [grossReceipts, profitPercentage, otherIncome, financialYear]
  )

  const isEligible = grossReceipts <= 75_00_000

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Freelancer Tax Calculator (44ADA)" },
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
          Freelancer Tax Calculator (ITR-4)
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate your income tax exactly as per Section 44ADA (Presumptive
          Taxation). Ideal for software developers, consultants, and independent
          professionals.
        </p>
        <LastUpdated date="April 2026" author="Rajat" />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-foreground">
          Select Financial Year
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVAILABLE_FYS.map((fy) => (
            <button
              key={fy}
              onClick={() => setFinancialYear(fy)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                financialYear === fy
                  ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {fy.replace("FY", "FY ")}
            </button>
          ))}
        </div>
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
          Your Income Details
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Gross Receipts (Total Revenue)"
              value={grossReceipts}
              onChange={setGrossReceipts}
              max={1_00_00_000}
            />
            {grossReceipts > 7500000 && (
              <p className="mt-2 text-xs text-fc-loss-text">
                Warning: Section 44ADA limit is ₹75 Lakhs. If receipts exceed
                this, you must maintain books and undergo audit (ITR-3).
              </p>
            )}
          </div>

          <SliderField
            label="Profit Percentage Declared"
            value={profitPercentage}
            onChange={setProfitPercentage}
            min={50}
            max={100}
            step={1}
            formatValue={(v) => `${Number(v).toFixed(0)}%`}
          />

          <CurrencyInput
            label="Other Income (Interest, etc.)"
            value={otherIncome}
            onChange={setOtherIncome}
            max={50_00_000}
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Tax Computation (New Regime)
        </p>

        {/* Primary Result Banner */}
        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
            opacity: isEligible ? 1 : 0.5,
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Total Tax Payable
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCurrency(result.totalTaxLiability)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Effective Tax Rate:{" "}
            <strong className="text-foreground">
              {result.effectiveTaxRate}%
            </strong>{" "}
            on gross income
          </p>
        </div>

        <ResultGrid cols={2}>
          <ResultCard
            label="Presumptive Profit"
            value={formatCompactCurrency(result.presumptiveIncome)}
            subtitle={`${profitPercentage}% of Gross Receipts`}
          />
          <ResultCard
            label="Total Taxable Income"
            value={formatCompactCurrency(result.totalTaxableIncome)}
            subtitle="Profit + Other Income"
          />
        </ResultGrid>

        <ShareResult
          className="mt-6"
          params={{
            gross: grossReceipts,
            pct: profitPercentage,
            other: otherIncome,
          }}
        />
      </div>

      {/* Content sections */}
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
            The Ultimate Guide to Presumptive Taxation (Section 44ADA)
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
              Section 44ADA of the Income Tax Act is arguably the most powerful,
              legally sound tax-saving provision available to Indian
              professionals today. Designed specifically for freelancers,
              consultants, software developers, architects, and doctors, it
              drastically simplifies the tax filing process (using ITR-4) while
              legally slashing your tax liability in half.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              1. Why Section 44ADA is a Game Changer
            </h3>
            <p>
              Under normal business accounting (filing ITR-3), you are required
              by law to meticulously track every single business
              expense—internet bills, coworking space rent, travel, software
              subscriptions, and laptop depreciation. You must maintain audited
              books of accounts to prove these expenses to the Income Tax
              Department to reduce your taxable income.
            </p>
            <p>
              Under Section 44ADA, the government eliminates this massive
              administrative burden. It simply{" "}
              <strong className="font-semibold text-foreground">
                presumes
              </strong>{" "}
              that 50% of your gross professional revenue went towards business
              expenses. You are only required to pay income tax on the remaining
              50% (your presumptive profit).
            </p>
            <p>
              <strong className="text-foreground">
                The ₹14 Lakh Zero-Tax Magic:
              </strong>{" "}
              When you combine the power of Section 44ADA with the New Tax
              Regime, the tax arbitrage is stunning. If you earn ₹14,00,000 as a
              freelance software developer, your taxable income is immediately
              halved to ₹7,00,000. Under the New Regime, income up to ₹7,00,000
              is entirely tax-free due to the Section 87A rebate. Result? You
              pay exactly{" "}
              <strong className="font-semibold text-foreground">
                ₹0 in income tax on ₹14 Lakhs of income.
              </strong>
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              2. The Enhanced ₹75 Lakh Limit
            </h3>
            <p>
              Previously, the presumptive taxation scheme was strictly capped at
              ₹50 Lakhs of gross receipts. In recent budgets, the Finance
              Ministry increased this limit to{" "}
              <strong className="font-semibold text-foreground">
                ₹75 Lakhs
              </strong>
              . However, there is a strict condition: your cash receipts must
              not exceed 5% of your total gross receipts. Since almost all
              modern freelancers and IT consultants receive payments via wire
              transfers (SWIFT, PayPal, NEFT), meeting this digital-first
              criteria is incredibly easy.
            </p>
            <p>
              If your gross receipts cross ₹75 Lakhs in a financial year, you
              are legally disqualified from using Section 44ADA. You must
              maintain proper books of accounts and file ITR-3.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              3. Section 44AD vs Section 44ADA
            </h3>
            <p>It is crucial not to confuse 44ADA with 44AD.</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-foreground">Section 44AD</strong> is for{" "}
                <em className="italic">Businesses</em> (like retail shops,
                trading, manufacturing). It allows declaring a minimum of 6%
                (digital) or 8% (cash) of turnover as profit. The turnover limit
                here is ₹3 Crores.
              </li>
              <li>
                <strong className="text-foreground">Section 44ADA</strong> is
                exclusively for{" "}
                <em className="italic">Specified Professionals</em> (Legal,
                Medical, Engineering, Architectural, Accountancy, Technical
                Consultancy, Interior Decoration). It requires a minimum of 50%
                of gross receipts to be declared as profit.
              </li>
            </ul>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              4. Advance Tax Obligations for Freelancers
            </h3>
            <p>
              A major trap for new freelancers is ignoring Advance Tax. Even if
              you file ITR-4 under the presumptive scheme, if your estimated
              total tax liability for the year exceeds ₹10,000, you are legally
              required to pay Advance Tax.
            </p>
            <p>
              However, 44ADA provides another massive benefit here. While normal
              businesses must pay advance tax in four quarterly installments,
              professionals opting for 44ADA only need to pay their entire
              advance tax in a{" "}
              <strong className="font-semibold text-foreground">
                single installment on or before March 15th
              </strong>{" "}
              of the financial year. Failure to do so will attract penal
              interest under Sections 234B and 234C.
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              5. What About GST Registration?
            </h3>
            <p>
              Income Tax and GST are two completely separate tax regimes. While
              Section 44ADA covers your Income Tax, you must still comply with
              GST laws. If your total freelance revenue (even from foreign
              clients) exceeds{" "}
              <strong className="font-semibold text-foreground">
                ₹20 Lakhs
              </strong>{" "}
              in a financial year, GST registration becomes mandatory. Export of
              services (e.g., freelancing for US clients) is considered a
              "Zero-Rated Supply," meaning you don't actually pay GST, but
              obtaining a Letter of Undertaking (LUT) and filing GST returns is
              mandatory.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Deepen Your Knowledge
          </h3>
          <p className="mb-6 text-muted-foreground">
            Are you optimizing your freelance business correctly? Section 44ADA
            is just the beginning. Learn about GST compliance for exports,
            advance tax deadlines, and how to legally pay zero tax on a ₹14 Lakh
            income.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/freelancer-tax-44ada-complete-guide"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Mastering Section 44ADA: The Complete Freelancer Manual
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
              to="/blog/income-tax-act-2025-changes"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              How 2025 Tax Changes Affect Independent Professionals
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
            name: "Freelancer Tax Calculator (44ADA)",
            url: "https://financechk.com/tools/freelancer-tax-calculator",
            description:
              "Calculate presumptive tax for freelancers under Section 44ADA using New Tax Regime.",
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
            name: "How to calculate freelancer tax under 44ADA",
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
