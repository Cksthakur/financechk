import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight, IconMapPin } from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { calculateHRA } from "@/lib/calculators/hra"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/hra-calculator")({
  head: () =>
    generateSeoMeta({
      title:
        "HRA Calculator India - House Rent Allowance Exemption Calculator 2025-26",
      description:
        "Free online HRA calculator for India. Calculate your House Rent Allowance exemption under Section 10(13A). Check taxable HRA, metro vs non-metro cities, and optimize your tax savings. Includes rent receipt requirements and landlord PAN rules.",
      path: "/tools/hra-calculator",
    }),
  component: HRACalculator,
})

const faqs = [
  {
    question: "What is HRA (House Rent Allowance)?",
    answer:
      "HRA is a component of your salary that your employer provides to help cover your rental expenses. It's taxable under salary income, but you can claim exemption under Section 10(13A) if you live in a rented accommodation. The exemption is the minimum of: (a) actual HRA received, (b) rent paid minus 10% of salary, and (c) 50% of salary (metro) or 40% (non-metro).",
  },
  {
    question: "Which cities are classified as metro for HRA calculation?",
    answer:
      "The following cities are classified as metro for HRA exemption: Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad, and Pune. For these cities, the exemption limit is 50% of basic salary. For all other cities (non-metro), the limit is 40% of basic salary. The government hasn't officially updated the metro list since 2014, so some employers may use different classifications.",
  },
  {
    question: "What documents are required to claim HRA exemption?",
    answer:
      "To claim HRA exemption, you need: (1) Rent receipts with landlord's name, address, PAN (if rent > ₹1 lakh/year), (2) Rent agreement (preferably registered), (3) Bank statements showing rent payments, (4) Landlord's declaration in Form 10BA for tax deduction claims. For rent above ₹1 lakh/year, landlord's PAN is mandatory. Keep rent receipts for at least 6 years as IT department may ask for verification.",
  },
  {
    question: "Can I claim HRA if I own a house?",
    answer:
      "No, you cannot claim HRA exemption if you own a house at the place of your employment. However, you can claim HRA if: (1) You own a house but it's not in the same city where you work, (2) You have a home loan but the house is under construction and you're staying in rented accommodation, (3) Your spouse owns the house and you live in a different city for work. In all cases, you need to provide proof that the owned house is not at your workplace location.",
  },
  {
    question: "How is HRA calculated for tax exemption?",
    answer:
      "HRA exemption = Minimum of: (1) Actual HRA received from employer, (2) Rent paid - (10% of Basic + DA), (3) 50% of (Basic + DA) for metro cities OR 40% for non-metro. Example: Basic ₹30,000, HRA received ₹10,000, Rent ₹15,000 (metro): Exemption = min(10000, 15000-3000, 15000) = min(10000, 12000, 15000) = ₹10,000. Taxable HRA = ₹0.",
  },
  {
    question: "What is the minimum service period for HRA?",
    answer:
      "There is no minimum service period to claim HRA. You can claim HRA exemption from the first month of your employment if you pay rent. However, your employer may have internal policies. Also remember that HRA exemption cannot be claimed for more than 24 months in a single city unless you can justify (like construction of own house, transfer to different location, etc.).",
  },
  {
    question: "Can I claim HRA for paying rent to my parents?",
    answer:
      "Yes, you can claim HRA for paying rent to your parents. The rent agreement should be genuine, and you should transfer rent via bank account. Your parents must declare this rental income in their tax return (they can claim standard deduction of 30% on rental income). This is a popular tax optimization strategy, especially for those living with parents but paying them rent.",
  },
  {
    question: "What if I pay rent but don't receive HRA from employer?",
    answer:
      "Even if your employer doesn't provide HRA component in salary, you can still claim deduction for rent paid under Section 80GG (not Section 10(13A)). Under 80GG, you need not be a self-employed person receiving HRA. The deduction is: Rent paid - 10% of total income. Maximum deduction is ₹60,000/year. Conditions: You (or spouse) should not own house at the place of work, and you should not be claiming HRA from any other source.",
  },
]

const documentsRequired = [
  {
    doc: "Rent Receipts",
    details: "Monthly rent receipts with landlord signature and details",
  },
  {
    doc: "Rent Agreement",
    details: "Registered rental agreement with terms and conditions",
  },
  { doc: "Landlord PAN", details: "Required if annual rent exceeds ₹1 lakh" },
  {
    doc: "Bank Transfers",
    details: "Rent payments should be via bank transfer, not cash",
  },
  {
    doc: "Form 10BA",
    details: "Declaration by landlord for claiming deduction",
  },
  {
    doc: "No Property Proof",
    details: "Declaration that you don't own property at workplace",
  },
]

const howToSteps = [
  "Enter your basic salary + dearness allowance (DA). This is the salary used for HRA calculation - typically 40-50% of your total salary package.",
  "Enter the HRA amount you actually receive from your employer. This is the maximum exemption you can claim.",
  "Enter your monthly rent payment. Ensure you pay rent via bank transfer for proper documentation.",
  "Select whether your city is metro or non-metro. Metro cities (Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad, Pune) get 50% exemption limit vs 40% for non-metro.",
  "The calculator shows your exemption, taxable HRA, and yearly savings based on your tax bracket.",
]

function HRACalculator() {
  const [basicSalary, setBasicSalary] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("basic")) || 30000
    }
    return 30000
  })

  const [hraReceived, setHraReceived] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("hra")) || 10000
    }
    return 10000
  })

  const [rentPaid, setRentPaid] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return Number(params.get("rent")) || 15000
    }
    return 15000
  })

  const [cityType, setCityType] = useState<"metro" | "non-metro">("metro")

  const result = useMemo(
    () => calculateHRA({ basicSalary, hraReceived, rentPaid, cityType }),
    [basicSalary, hraReceived, rentPaid, cityType]
  )

  const taxSavings = [
    { bracket: "5%", savings: Math.round(result.hraExemption * 0.05) },
    { bracket: "10%", savings: Math.round(result.hraExemption * 0.1) },
    { bracket: "15%", savings: Math.round(result.hraExemption * 0.15) },
    { bracket: "20%", savings: Math.round(result.hraExemption * 0.2) },
    { bracket: "30%", savings: Math.round(result.hraExemption * 0.3) },
  ]

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "HRA Calculator" },
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
          HRA Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Calculate your House Rent Allowance (HRA) exemption under Section
          10(13A). Check how much HRA is tax-free and how much is taxable based
          on your salary, rent paid, and city. Optimize your tax savings by
          claiming maximum HRA exemption with proper documentation.
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
          Enter your details
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Monthly Basic Salary + DA (₹)"
            value={basicSalary}
            onChange={setBasicSalary}
            min={5000}
          />
          <CurrencyInput
            label="Monthly HRA Received (₹)"
            value={hraReceived}
            onChange={setHraReceived}
            min={0}
          />
          <CurrencyInput
            label="Monthly Rent Paid (₹)"
            value={rentPaid}
            onChange={setRentPaid}
            min={0}
          />
          <div className="sm:col-span-2">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Select City Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCityType("metro")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${cityType === "metro" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
              >
                Metro Cities (50%)
              </button>
              <button
                onClick={() => setCityType("non-metro")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${cityType === "non-metro" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
              >
                Non-Metro Cities (40%)
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Metro: Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad, Pune
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Your HRA calculation
        </p>
        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Annual HRA Exemption (Tax-Free)
          </p>
          <p
            className="mt-1 font-mono text-4xl font-bold text-foreground md:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.hraExemption)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Per year</p>
        </div>
        <ResultGrid cols={3}>
          <ResultCard
            label="Actual HRA Received"
            value={formatCompactCurrency(result.calculationBreakdown.actualHRA)}
            subtitle="Annual amount from employer"
          />
          <ResultCard
            label="Exemption Available"
            value={formatCompactCurrency(result.hraExemption)}
            subtitle="Minimum of three conditions"
            variant="gain"
          />
          <ResultCard
            label="Taxable HRA"
            value={formatCompactCurrency(result.taxableHRA)}
            subtitle="Add to income for tax"
          />
        </ResultGrid>

        <div className="mt-6 rounded-xl bg-secondary/50 p-5">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            How Exemption is Calculated
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-card p-4">
              <p className="text-sm font-medium text-foreground">Actual HRA</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatCurrency(result.calculationBreakdown.actualHRA)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Amount received annually
              </p>
            </div>
            <div className="rounded-lg bg-card p-4">
              <p className="text-sm font-medium text-foreground">
                Rent - 10% Salary
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatCurrency(
                  result.calculationBreakdown.rentPaidMinus10Percent
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Annual rent minus 10% of salary
              </p>
            </div>
            <div className="rounded-lg bg-card p-4">
              <p className="text-sm font-medium text-foreground">
                {cityType === "metro" ? "50%" : "40%"} of Salary
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatCurrency(
                  result.calculationBreakdown.fiftyPercentOrFortyPercentOfBasic
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Metro vs non-metro limit
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Exemption = Minimum of above three ={" "}
            </span>
            {formatCurrency(result.calculationBreakdown.exemptAmount)} per year
          </p>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Tax Savings by Income Bracket
          </p>
          <div className="grid gap-3 sm:grid-cols-5">
            {taxSavings.map((ts, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-3 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  Tax at {ts.bracket}
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {formatCompactCurrency(ts.savings)}
                </p>
                <p className="text-xs text-muted-foreground">Yearly savings</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 p-5 dark:bg-blue-950/30">
          <div className="flex items-start gap-3">
            <IconMapPin className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold text-foreground">
                Metro Cities for HRA
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad, and Pune
                are classified as metro cities (50% limit). All other cities use
                40% limit. Some employers may have their own city
                classification.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Documents Required for HRA Claim
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentsRequired.map((doc, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h4 className="font-semibold text-foreground">{doc.doc}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {doc.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Step-by-Step Guide
          </p>
          <div className="flex flex-col gap-3">
            {howToSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <FAQSection items={faqs} />

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/tools/tax-regime-comparison"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Tax Regime Comparison <IconChevronRight className="size-4" />
          </Link>
          <Link
            to="/tools/income-tax-calculator-5-lakh"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Income Tax Calculator <IconChevronRight className="size-4" />
          </Link>
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
