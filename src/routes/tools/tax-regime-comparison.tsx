import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type { TaxInput } from "@/lib/calculators/tax-regime"
import {
  AVAILABLE_FYS,
  calculateTaxComparison,
} from "@/lib/calculators/tax-regime"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/tax-regime-comparison")({
  head: () =>
    generateSeoMeta({
      title: "Old vs New Tax Regime Comparison Calculator India FY 2026-27",
      description:
        "Free online tax regime comparison tool for Indian salaried employees. Compare old vs new income tax regime for FY 2026-27. Calculate tax savings with Section 80C, 80D, HRA exemptions and find the best regime for your salary.",
      path: "/tools/tax-regime-comparison",
    }),
  component: TaxRegimeComparison,
})

const faqs = [
  {
    question: "Which tax regime is better for me — old or new?",
    answer:
      "It depends entirely on your total available deductions. If your total deductions (80C, 80D, HRA exemption, home loan interest) exceed approximately ₹3.75 Lakhs to ₹4 Lakhs, the Old Tax Regime usually saves more tax. Below this threshold, the New Regime's significantly lower slab rates and the ₹75,000 standard deduction make it the better choice.",
  },
  {
    question: "Can I switch between old and new regime every year?",
    answer:
      "Yes, if you are a salaried individual. You can choose your preferred regime every financial year at the time of filing your Income Tax Return (ITR). However, for individuals with business or professional income (ITR-3 or ITR-4), you only have one opportunity in your lifetime to switch out of the New Regime.",
  },
  {
    question: "What is the standard deduction in new regime FY 2026-27?",
    answer:
      "For the Financial Year 2026-27 (Assessment Year 2027-28), the standard deduction in the New Tax Regime continues at ₹75,000 for salaried taxpayers. This deduction is automatically subtracted from gross salary before tax is calculated.",
  },
  {
    question: "Is HRA exemption available under the new regime?",
    answer:
      "No. House Rent Allowance (HRA) exemption under Section 10(13A) is strictly only available under the Old Tax Regime. The New Regime was designed to be deduction-free in exchange for much lower tax slabs, so almost all exemptions including HRA, LTA, and professional tax are removed.",
  },
  {
    question: "How does the Section 87A rebate work in the New Regime?",
    answer:
      "Under the New Tax Regime, if your total taxable income (after standard deduction) is up to ₹12,00,000, you are eligible for a tax rebate of up to ₹60,000. This effectively keeps salary income up to about ₹12.75 lakh tax-free (₹12 lakh taxable + ₹75,000 standard deduction).",
  },
]

const howToSteps = [
  "Enter your Gross Annual Salary (CTC) including all allowances.",
  "Specify your Basic Salary and actual HRA received to calculate old regime exemptions.",
  "Enter your annual rent paid and select your city type (Metro vs Non-Metro).",
  "Fill in your legal deductions: Section 80C (EPF/PPF), 80D (Health Insurance), and 24b (Home Loan Interest).",
  "The calculator will instantly show you a side-by-side comparison with the exact tax saved under the better regime.",
]

function SalaryDetailsSection({
  annualSalary,
  setAnnualSalary,
  basicSalary,
  setBasicSalary,
  hra,
  setHra,
  rentPaid,
  setRentPaid,
  cityType,
  setCityType,
}: any) {
  return (
    <div
      className="rounded-2xl bg-card p-5 md:p-6"
      style={{
        boxShadow:
          "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
      }}
    >
      <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Salary details (Annual)
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <CurrencyInput
            label="Gross Annual Salary (CTC)"
            value={annualSalary}
            onChange={setAnnualSalary}
            max={10_00_00_000}
          />
        </div>
        <CurrencyInput
          label="Basic Salary"
          value={basicSalary}
          onChange={setBasicSalary}
        />
        <CurrencyInput label="HRA Received" value={hra} onChange={setHra} />
      </div>

      <div
        className="mt-6 pt-5"
        style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
      >
        <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          HRA details
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Annual Rent Paid"
            value={rentPaid}
            onChange={setRentPaid}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              City Type
            </label>
            <div className="flex gap-2">
              {(["metro", "non-metro"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCityType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    cityType === type
                      ? "bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type === "metro" ? "Metro" : "Non-Metro"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeductionsSection({
  section80C,
  setSection80C,
  section80D,
  setSection80D,
  section80CCD,
  setSection80CCD,
  homeLoanInterest,
  setHomeLoanInterest,
  otherDeductions,
  setOtherDeductions,
}: any) {
  return (
    <div
      className="mt-6 rounded-2xl bg-card p-5 md:p-6"
      style={{
        boxShadow:
          "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
      }}
    >
      <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Deductions (Old regime only)
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <CurrencyInput
          label="Section 80C (max ₹1.5L)"
          value={section80C}
          onChange={setSection80C}
          max={150000}
        />
        <CurrencyInput
          label="Health Ins. — 80D (max ₹1L)"
          value={section80D}
          onChange={setSection80D}
          max={100000}
        />
        <CurrencyInput
          label="NPS — 80CCD(1B) (max ₹50K)"
          value={section80CCD}
          onChange={setSection80CCD}
          max={50000}
        />
        <CurrencyInput
          label="Home Loan Int. — 24(b) (max ₹2L)"
          value={homeLoanInterest}
          onChange={setHomeLoanInterest}
          max={200000}
        />
        <CurrencyInput
          label="Other Deductions"
          value={otherDeductions}
          onChange={setOtherDeductions}
        />
      </div>
    </div>
  )
}

function TaxRegimeComparison() {
  const [financialYear, setFinancialYear] = useState(() => {
    if (typeof window !== "undefined") {
      const fy = new URLSearchParams(window.location.search).get("fy")
      if (fy && AVAILABLE_FYS.includes(fy)) return fy
    }
    return "FY2026-27"
  })
  const [annualSalary, setAnnualSalary] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(
          new URLSearchParams(window.location.search).get("annualSalary")
        ) || 1200000
      )
    return 1200000
  })
  const [basicSalary, setBasicSalary] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(
          new URLSearchParams(window.location.search).get("basicSalary")
        ) || 600000
      )
    return 600000
  })
  const [hra, setHra] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("hra")) || 240000
      )
    return 240000
  })
  const [rentPaid, setRentPaid] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("rentPaid")) ||
        180000
      )
    return 180000
  })
  const [cityType, setCityType] = useState<"metro" | "non-metro">(() => {
    if (typeof window !== "undefined") {
      const type = new URLSearchParams(window.location.search).get("cityType")
      if (type === "non-metro") return type
    }
    return "metro"
  })
  const [section80C, setSection80C] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("section80C")) ||
        150000
      )
    return 150000
  })
  const [section80D, setSection80D] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(new URLSearchParams(window.location.search).get("section80D")) ||
        25000
      )
    return 25000
  })
  const [section80CCD, setSection80CCD] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(
          new URLSearchParams(window.location.search).get("section80CCD")
        ) || 50000
      )
    return 50000
  })
  const [homeLoanInterest, setHomeLoanInterest] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(
          new URLSearchParams(window.location.search).get("homeLoanInterest")
        ) || 0
      )
    return 0
  })
  const [otherDeductions, setOtherDeductions] = useState(() => {
    if (typeof window !== "undefined")
      return (
        Number(
          new URLSearchParams(window.location.search).get("otherDeductions")
        ) || 0
      )
    return 0
  })

  const input: TaxInput = useMemo(
    () => ({
      annualSalary,
      basicSalary,
      hra,
      rentPaid,
      cityType,
      section80C,
      section80D,
      section80CCD,
      homeLoanInterest,
      otherDeductions,
      financialYear,
    }),
    [
      annualSalary,
      basicSalary,
      hra,
      rentPaid,
      cityType,
      section80C,
      section80D,
      section80CCD,
      homeLoanInterest,
      otherDeductions,
      financialYear,
    ]
  )

  const comparison = useMemo(() => calculateTaxComparison(input), [input])

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Old vs New Tax Regime Comparison" },
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
          Old vs New Tax Regime Comparison Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          The most accurate tool to compare your tax liability under both Indian
          regimes. Supports FY 2020-21 to FY 2026-27 with accurate slab rates.
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

      <div className="flex flex-col gap-6">
        <SalaryDetailsSection
          annualSalary={annualSalary}
          setAnnualSalary={setAnnualSalary}
          basicSalary={basicSalary}
          setBasicSalary={setBasicSalary}
          hra={hra}
          setHra={setHra}
          rentPaid={rentPaid}
          setRentPaid={setRentPaid}
          cityType={cityType}
          setCityType={setCityType}
        />

        <DeductionsSection
          section80C={section80C}
          setSection80C={setSection80C}
          section80D={section80D}
          setSection80D={setSection80D}
          section80CCD={section80CCD}
          setSection80CCD={setSection80CCD}
          homeLoanInterest={homeLoanInterest}
          setHomeLoanInterest={setHomeLoanInterest}
          otherDeductions={otherDeductions}
          setOtherDeductions={setOtherDeductions}
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Tax comparison
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background:
              comparison.betterRegime === "old"
                ? "var(--fc-gain-bg)"
                : "var(--fc-warm-stone)",
            boxShadow:
              comparison.betterRegime === "old"
                ? undefined
                : "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {comparison.betterRegime === "old" ? "Old regime" : "New regime"}{" "}
            saves you
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              comparison.betterRegime === "old"
                ? "text-fc-gain-text"
                : "text-foreground"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCurrency(comparison.savings)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the{" "}
            <strong className="text-foreground">
              {comparison.betterRegime === "old" ? "Old" : "New"} Tax Regime
            </strong>{" "}
            for FY 2026-27
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RegimeCard
            title="Old Regime"
            isBetter={comparison.betterRegime === "old"}
            data={comparison.oldRegime}
          />
          <RegimeCard
            title="New Regime"
            isBetter={comparison.betterRegime === "new"}
            data={comparison.newRegime}
          />
        </div>

        <div className="mt-5 rounded-2xl bg-secondary p-5">
          <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Visual comparison
          </p>
          <div className="flex flex-col gap-3">
            <ComparisonBarRow
              label="Old Regime"
              value={comparison.oldRegime.totalTax}
              maxValue={Math.max(
                comparison.oldRegime.totalTax,
                comparison.newRegime.totalTax
              )}
              color="bg-[var(--fc-warm-gray)]"
            />
            <ComparisonBarRow
              label="New Regime"
              value={comparison.newRegime.totalTax}
              maxValue={Math.max(
                comparison.oldRegime.totalTax,
                comparison.newRegime.totalTax
              )}
              color="bg-foreground"
            />
          </div>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            annualSalary,
            basicSalary,
            hra,
            rentPaid,
            cityType,
            section80C,
            section80D,
            section80CCD,
            homeLoanInterest,
            otherDeductions,
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
            Tax Slab Rates — Financial Year 2026-27 (AY 2027-28)
          </h2>
          <p
            className="mb-6 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            Following the latest Finance Act changes, the government has
            retained the expanded New Tax Regime slab structure for FY 2026-27
            while keeping Old Regime slabs unchanged. Use the tables below to
            see which rates apply to your income levels.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SlabTable
              title="Old Tax Regime (FY 26-27)"
              slabs={[
                ["Up to ₹2,50,000", "Nil"],
                ["₹2,50,001 – ₹5,00,000", "5%"],
                ["₹5,00,001 – ₹10,00,000", "20%"],
                ["Above ₹10,00,000", "30%"],
              ]}
              note="Section 87A Rebate: Full tax waiver if taxable income ≤ ₹5,00,000."
            />
            <SlabTable
              title="New Tax Regime (FY 26-27)"
              slabs={[
                ["Up to ₹4,00,000", "Nil"],
                ["₹4,00,001 – ₹8,00,000", "5%"],
                ["₹8,00,001 – ₹12,00,000", "10%"],
                ["₹12,00,001 – ₹16,00,000", "15%"],
                ["₹16,00,001 – ₹20,00,000", "20%"],
                ["₹20,00,001 – ₹24,00,000", "25%"],
                ["Above ₹24,00,000", "30%"],
              ]}
              note="Section 87A Rebate: Full tax waiver if taxable income ≤ ₹12,00,000. Marginal relief applies for incomes slightly above ₹12 lakhs."
            />
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
            The Ultimate Guide to Choosing Between Old vs New Tax Regime
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
              The decision between the Old and New Tax Regime is the single most
              important financial choice an Indian taxpayer makes every year.
              With the New Tax Regime now becoming the{" "}
              <strong className="font-semibold text-foreground">
                default option
              </strong>
              , the burden of proof lies on the taxpayer to demonstrate that the
              Old Regime is still mathematically superior for their specific
              liabilities.
            </p>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              1. The "Standard" Advantage: ₹75,000 Deduction
            </h3>
            <p>
              In the latest budget, the government decisively signaled its
              preference for the New Regime by increasing the Standard Deduction
              for salaried employees from ₹50,000 to{" "}
              <strong className="font-semibold text-foreground">₹75,000</strong>
              . This creates the widely discussed "₹12.75 Lakh Zero-Tax Salary"
              threshold for salaried taxpayers under current assumptions.
            </p>
            <p>
              If your annual gross salary is around ₹12,75,000, you
              automatically deduct the ₹75,000 standard deduction, bringing your
              taxable income close to ₹12 Lakhs. Under the New Regime, taxable
              income up to ₹12 Lakhs is eligible for rebate relief under Section
              87A. Result? You pay absolute zero tax, without needing to invest
              a single rupee in Section 80C mutual funds or insurance.
            </p>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              2. The Breakeven Point: Finding Your "Magic Number"
            </h3>
            <p>
              The New Regime offers much lower tax rates but at the cost of
              giving up almost all deductions. You cannot claim HRA (House Rent
              Allowance), LTA (Leave Travel Allowance), Section 80C (PPF, ELSS,
              Life Insurance), or Section 80D (Health Insurance).
            </p>
            <p>
              Financial planners use a "Breakeven Point" calculation to find the
              tipping point. For most taxpayers in FY 2026-27:
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                If your total deductions (80C + 80D + HRA + 24b) are{" "}
                <strong className="font-semibold text-foreground">
                  less than ₹3.75 Lakhs
                </strong>
                , the New Tax Regime is almost certainly better.
              </li>
              <li>
                If your total deductions are{" "}
                <strong className="font-semibold text-foreground">
                  more than ₹4 Lakhs
                </strong>
                , the Old Tax Regime will likely save you more money.
              </li>
            </ul>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              3. The Impact of Home Loans (Section 24b)
            </h3>
            <p>
              A major factor keeping millions of Indians in the Old Tax Regime
              is the home loan interest deduction. Under Section 24(b), you can
              deduct up to{" "}
              <strong className="font-semibold text-foreground">
                ₹2 Lakhs
              </strong>{" "}
              of the interest paid on a self-occupied property from your taxable
              income.
            </p>
            <p>
              When you combine a ₹2 Lakh home loan interest deduction with ₹1.5
              Lakhs of Section 80C (Principal repayment) and ₹50,000 of Section
              80D, you are already at ₹4 Lakhs of deductions. For homeowners,
              the Old Regime remains an incredibly powerful tax-saving tool.
            </p>

            <h3 className="mt-6 text-2xl font-semibold text-foreground">
              4. High Earners and the Surcharge Cliff
            </h3>
            <p>
              For High Net-Worth Individuals (HNIs) earning over ₹5 Crores
              annually, the New Tax Regime has a massive hidden benefit. The
              government slashed the highest surcharge rate from 37% to 25% for
              the New Regime only. This effectively brings the maximum marginal
              tax rate down from 42.74% to{" "}
              <strong className="font-semibold text-foreground">39%</strong>.
              For top-tier executives and successful entrepreneurs, the New
              Regime can save crores of rupees in absolute tax liability.
            </p>

            <div className="my-8 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-secondary/30 p-6">
              <h4 className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Professional Recommendation
              </h4>
              <p className="text-foreground">
                Do not guess. Use our calculator to run your actual numbers
                before your employer's January investment declaration deadline.
                If you are a freelancer or have professional income, remember
                you only get one lifetime switch—consult a Chartered Accountant
                (CA) before opting out of the default New Regime.
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
            The decision between tax regimes isn't just about slabs. It's about
            your life stages and financial goals. Read our definitive 2025 guide
            to understand the long-term impact of your choice.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/blog/old-vs-new-tax-regime-comparison-2025"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Old vs New Tax Regime: The Definitive 2025 Comparison
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
              Income Tax Act 2025: All Key Changes Decoded
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

function RegimeCard({
  title,
  isBetter,
  data,
}: {
  title: string
  isBetter: boolean
  data: {
    deductions: number
    taxableIncome: number
    taxPayable: number
    cess: number
    totalTax: number
    effectiveRate: number
    hraExemption?: number
  }
}) {
  return (
    <div
      className="rounded-2xl bg-card p-5"
      style={{
        boxShadow: isBetter
          ? "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px"
          : "rgba(0,0,0,0.06) 0px 0px 0px 1px",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {isBetter && (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
            Better
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2.5">
        <DataRow label="Deductions" value={formatCurrency(data.deductions)} />
        {data.hraExemption !== undefined && data.hraExemption > 0 && (
          <DataRow
            label="Incl. HRA Exemption"
            value={formatCurrency(data.hraExemption)}
          />
        )}
        <DataRow
          label="Taxable Income"
          value={formatCurrency(data.taxableIncome)}
        />
        <DataRow label="Basic Tax" value={formatCurrency(data.taxPayable)} />
        <DataRow label="Cess (4%)" value={formatCurrency(data.cess)} />
        <div
          className="pt-2"
          style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        >
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-foreground">
              Total Tax
            </span>
            <span
              className="font-mono text-lg font-bold text-foreground"
              style={{ letterSpacing: "-0.04em" }}
            >
              {formatCurrency(data.totalTax)}
            </span>
          </div>
          <p className="mt-0.5 text-right text-xs text-muted-foreground">
            Effective rate: {data.effectiveRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className="font-mono font-medium text-foreground"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
      </span>
    </div>
  )
}

function ComparisonBarRow({
  label,
  value,
  maxValue,
  color,
}: {
  label: string
  value: number
  maxValue: number
  color: string
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
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
    </div>
  )
}

function SlabTable({
  title,
  slabs,
  note,
}: {
  title: string
  slabs: Array<[string, string]>
  note: string
}) {
  return (
    <div
      className="rounded-2xl bg-card p-5"
      style={{ boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
    >
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-1.5">
        {slabs.map(([range, rate]) => (
          <div key={range} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{range}</span>
            <span className="font-mono font-medium text-foreground">
              {rate}
            </span>
          </div>
        ))}
      </div>
      <p
        className="mt-3 text-xs text-muted-foreground/70"
        style={{ letterSpacing: "0.01em" }}
      >
        {note}
      </p>
    </div>
  )
}
