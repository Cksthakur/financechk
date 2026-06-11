import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { ResultGrid } from "@/components/finance/result-grid"
import { ResultCard } from "@/components/finance/result-card"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateHomeLoanBalanceTransfer } from "@/lib/calculators/home-loan-balance-transfer"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/tools/home-loan-balance-transfer-calculator"
)({
  head: () =>
    generateSeoMeta({
      title:
        "Home Loan Balance Transfer Calculator India | Savings vs Processing Fee",
      description:
        "Calculate if switching your home loan saves money after processing fee, legal charges, and transfer costs. Includes break-even months and net savings.",
      path: "/tools/home-loan-balance-transfer-calculator",
      keywords: [
        "home loan balance transfer calculator",
        "home loan transfer calculator India",
        "home loan refinance calculator India",
        "home loan switch calculator processing fee",
        "is it worth transferring home loan",
      ],
    }),
  component: HomeLoanBalanceTransferCalculatorPage,
})

const faqs = [
  {
    question: "When should I consider a home loan balance transfer?",
    answer:
      "Usually when your new rate is materially lower and enough tenure is left to recover transfer costs. Net-savings analysis is more useful than EMI-only comparison.",
  },
  {
    question: "What charges are involved in a home loan BT?",
    answer:
      "Common costs include processing fee, legal/valuation/documentation charges, and incidental transfer expenses. This calculator combines them in one transfer-cost view.",
  },
  {
    question: "How is break-even period calculated?",
    answer:
      "Break-even months are estimated as total transfer cost divided by monthly EMI saving. If the break-even exceeds remaining tenure, transfer may not be worth it.",
  },
  {
    question: "Is 0.5% rate reduction enough for transfer?",
    answer:
      "It can be, but depends on outstanding balance, tenure left, and fees. For large principal and longer tenure, even smaller rate cuts may still produce net savings.",
  },
  {
    question: "Can fixed-rate borrowers do balance transfer?",
    answer:
      "Transfer feasibility depends on lender terms and foreclosure clauses. Use this tool for financial viability, then confirm operational eligibility with lenders.",
  },
]

function HomeLoanBalanceTransferCalculatorPage() {
  const [outstandingPrincipal, setOutstandingPrincipal] = useState(4500000)
  const [currentInterestRate, setCurrentInterestRate] = useState(9.1)
  const [remainingTenureYears, setRemainingTenureYears] = useState(15)
  const [newInterestRate, setNewInterestRate] = useState(8.25)
  const [processingFeePercent, setProcessingFeePercent] = useState(0.35)
  const [processingFeeFlat, setProcessingFeeFlat] = useState(5000)
  const [otherTransferCosts, setOtherTransferCosts] = useState(25000)

  const result = useMemo(
    () =>
      calculateHomeLoanBalanceTransfer({
        outstandingPrincipal,
        currentInterestRate,
        remainingTenureYears,
        newInterestRate,
        processingFeePercent,
        processingFeeFlat,
        otherTransferCosts,
      }),
    [
      outstandingPrincipal,
      currentInterestRate,
      remainingTenureYears,
      newInterestRate,
      processingFeePercent,
      processingFeeFlat,
      otherTransferCosts,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Home Loan Balance Transfer Calculator" },
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
          Home Loan Balance Transfer Calculator - Is It Worth Switching Lender?
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Evaluate refinance benefit after processing fee, legal charges, and
          transfer costs. Compare current-vs-new EMI, break-even period, and net
          interest savings.
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
          Transfer Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <CurrencyInput
            label="Outstanding Principal"
            value={outstandingPrincipal}
            onChange={setOutstandingPrincipal}
            min={0}
            max={100000000}
          />

          <SliderField
            label="Remaining Tenure"
            value={remainingTenureYears}
            onChange={setRemainingTenureYears}
            min={1}
            max={30}
            step={1}
            formatValue={(v) => `${v} years`}
          />

          <SliderField
            label="Current Interest Rate"
            value={currentInterestRate}
            onChange={setCurrentInterestRate}
            min={6}
            max={14}
            step={0.05}
            formatValue={(v) => `${v.toFixed(2)}%`}
          />

          <SliderField
            label="New Lender Interest Rate"
            value={newInterestRate}
            onChange={setNewInterestRate}
            min={6}
            max={14}
            step={0.05}
            formatValue={(v) => `${v.toFixed(2)}%`}
          />

          <SliderField
            label="Processing Fee (%)"
            value={processingFeePercent}
            onChange={setProcessingFeePercent}
            min={0}
            max={2}
            step={0.05}
            formatValue={(v) => `${v.toFixed(2)}%`}
          />

          <CurrencyInput
            label="Processing Fee (Flat)"
            value={processingFeeFlat}
            onChange={setProcessingFeeFlat}
            min={0}
            max={200000}
          />

          <div className="sm:col-span-2">
            <CurrencyInput
              label="Other Transfer Costs"
              value={otherTransferCosts}
              onChange={setOtherTransferCosts}
              min={0}
              max={500000}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Transfer Analysis
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background:
              result.recommendation === "recommended"
                ? "var(--fc-gain-bg)"
                : "var(--fc-loss-bg)",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Net Savings After Transfer Cost
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              result.netSavings >= 0 ? "text-fc-gain-text" : "text-fc-loss-text"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(result.netSavings)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Recommendation:{" "}
            {result.recommendation === "recommended"
              ? "Switch viable"
              : "Transfer not attractive"}
          </p>
        </div>

        <ResultGrid cols={4}>
          <ResultCard
            label="Current EMI"
            value={formatCompactCurrency(result.currentEmi)}
          />
          <ResultCard
            label="New EMI"
            value={formatCompactCurrency(result.newEmi)}
          />
          <ResultCard
            label="Monthly EMI Saving"
            value={formatCompactCurrency(result.monthlyEmiSaving)}
            variant={result.monthlyEmiSaving >= 0 ? "gain" : "loss"}
          />
          <ResultCard
            label="Transfer Cost"
            value={formatCompactCurrency(result.transferCost)}
            subtitle={formatCurrency(result.transferCost)}
          />
        </ResultGrid>

        <ResultGrid cols={3} className="mt-3">
          <ResultCard
            label="Current Interest Cost"
            value={formatCompactCurrency(result.currentTotalInterest)}
          />
          <ResultCard
            label="New Interest Cost"
            value={formatCompactCurrency(result.newTotalInterest)}
          />
          <ResultCard
            label="Gross Interest Saved"
            value={formatCompactCurrency(result.grossInterestSaved)}
            variant="gain"
          />
        </ResultGrid>

        <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
          Break-even:{" "}
          {result.breakEvenMonths === null
            ? "Not applicable"
            : `${result.breakEvenMonths} months`}
        </div>

        <ShareResult
          className="mt-6"
          params={{
            principal: outstandingPrincipal,
            oldRate: currentInterestRate,
            years: remainingTenureYears,
            newRate: newInterestRate,
            procPct: processingFeePercent,
            procFlat: processingFeeFlat,
            other: otherTransferCosts,
          }}
        />
      </div>

      <div className="mt-14">
        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Loan Tools
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/home-loan-eligibility-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Home Loan Eligibility Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/advanced-home-loan-emi-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Advanced EMI Calculator
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
            name: "Home Loan Balance Transfer Calculator",
            description:
              "Compare home-loan transfer savings after fees and compute break-even period.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/home-loan-balance-transfer-calculator",
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
