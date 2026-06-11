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
import { calculatePersonalLoanBalanceTransfer } from "@/lib/calculators/personal-loan-balance-transfer"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/tools/personal-loan-balance-transfer-calculator"
)({
  head: () =>
    generateSeoMeta({
      title: "Personal Loan Balance Transfer Calculator - Net Savings Check",
      description:
        "Calculate whether a personal loan balance transfer is worth it after processing fee, foreclosure charge, and tenure change.",
      path: "/tools/personal-loan-balance-transfer-calculator",
    }),
  component: PersonalLoanBalanceTransferCalculator,
})

const faqs = [
  {
    question: "When should I do a personal loan balance transfer?",
    answer:
      "Usually when your new lender offers a meaningfully lower interest rate and your remaining tenure is still long enough to recover transfer charges.",
  },
  {
    question: "Do processing fees and foreclosure charges matter a lot?",
    answer:
      "Yes. Ignoring these charges can make an apparent low-rate offer unattractive. Always compare total cost, not just EMI.",
  },
  {
    question: "Should I keep same tenure or extend it after transfer?",
    answer:
      "Keeping tenure same often maximizes interest savings. Extending tenure lowers EMI but may reduce or erase net benefit.",
  },
]

const howToSteps = [
  "Enter your current outstanding personal loan and current interest rate.",
  "Set your remaining tenure on the existing loan.",
  "Enter new lender rate and planned new tenure.",
  "Add processing fee, foreclosure charge, and any other transfer costs.",
  "Use net savings and break-even months to decide transfer viability.",
]

function PersonalLoanBalanceTransferCalculator() {
  const [outstandingPrincipal, setOutstandingPrincipal] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("principal")) ||
        600000
      )
    }
    return 600000
  })

  const [currentInterestRate, setCurrentInterestRate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("oldRate")) || 17
      )
    }
    return 17
  })

  const [remainingTenureMonths, setRemainingTenureMonths] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("oldMonths")) ||
        36
      )
    }
    return 36
  })

  const [newInterestRate, setNewInterestRate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("newRate")) || 13
      )
    }
    return 13
  })

  const [newTenureMonths, setNewTenureMonths] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("newMonths")) ||
        36
      )
    }
    return 36
  })

  const [processingFeePercent, setProcessingFeePercent] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("procFee")) ||
        1.5
      )
    }
    return 1.5
  })

  const [foreclosureChargePercent, setForeclosureChargePercent] = useState(
    () => {
      if (typeof window !== "undefined") {
        return (
          Number(
            new URLSearchParams(window.location.search).get("forecloseFee")
          ) || 2
        )
      }
      return 2
    }
  )

  const [otherCharges, setOtherCharges] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        Number(new URLSearchParams(window.location.search).get("other")) || 2500
      )
    }
    return 2500
  })

  const result = useMemo(
    () =>
      calculatePersonalLoanBalanceTransfer({
        outstandingPrincipal,
        currentInterestRate,
        remainingTenureMonths,
        newInterestRate,
        newTenureMonths,
        processingFeePercent,
        foreclosureChargePercent,
        otherCharges,
      }),
    [
      outstandingPrincipal,
      currentInterestRate,
      remainingTenureMonths,
      newInterestRate,
      newTenureMonths,
      processingFeePercent,
      foreclosureChargePercent,
      otherCharges,
    ]
  )

  const maxCost = Math.max(result.currentTotalCost, result.newTotalCost, 1)
  const currentCostPct = (result.currentTotalCost / maxCost) * 100
  const newCostPct = (result.newTotalCost / maxCost) * 100

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Personal Loan Balance Transfer Calculator" },
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
          Personal Loan Balance Transfer Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Compare your current personal loan cost vs transfer cost after all
          charges, then decide based on net savings and break-even time.
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
          <div className="sm:col-span-2">
            <CurrencyInput
              label="Outstanding Principal"
              value={outstandingPrincipal}
              onChange={setOutstandingPrincipal}
              min={0}
              max={50000000}
            />
          </div>

          <SliderField
            label="Current Interest Rate"
            value={currentInterestRate}
            onChange={setCurrentInterestRate}
            min={8}
            max={36}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Remaining Tenure (Current Loan)"
            value={remainingTenureMonths}
            onChange={setRemainingTenureMonths}
            min={1}
            max={120}
            step={1}
            formatValue={(v) => `${v.toFixed(0)} months`}
          />

          <SliderField
            label="New Interest Rate"
            value={newInterestRate}
            onChange={setNewInterestRate}
            min={8}
            max={36}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="New Tenure"
            value={newTenureMonths}
            onChange={setNewTenureMonths}
            min={1}
            max={120}
            step={1}
            formatValue={(v) => `${v.toFixed(0)} months`}
          />

          <SliderField
            label="Processing Fee"
            value={processingFeePercent}
            onChange={setProcessingFeePercent}
            min={0}
            max={5}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <SliderField
            label="Foreclosure Charge"
            value={foreclosureChargePercent}
            onChange={setForeclosureChargePercent}
            min={0}
            max={5}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />

          <div className="sm:col-span-2">
            <CurrencyInput
              label="Other Transfer Charges"
              value={otherCharges}
              onChange={setOtherCharges}
              min={0}
              max={500000}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Transfer Decision
        </p>

        <div
          className="mb-4 rounded-2xl p-5 md:p-6"
          style={{
            background:
              result.netSavings >= 0
                ? "var(--fc-gain-bg)"
                : "var(--fc-warm-stone)",
            boxShadow:
              result.netSavings >= 0
                ? undefined
                : "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {result.netSavings >= 0
              ? "Estimated Net Savings"
              : "Estimated Extra Cost"}
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-bold md:text-5xl ${
              result.netSavings >= 0 ? "text-fc-gain-text" : "text-foreground"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            {formatCompactCurrency(Math.abs(result.netSavings))}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Transfer charges included in new-loan cost estimation.
          </p>
        </div>

        <ResultGrid cols={3}>
          <ResultCard
            label="Current EMI"
            value={formatCompactCurrency(result.currentEmi)}
            subtitle="Existing lender"
          />
          <ResultCard
            label="New EMI"
            value={formatCompactCurrency(result.newEmi)}
            subtitle="After transfer"
            variant={result.newEmi <= result.currentEmi ? "gain" : "loss"}
          />
          <ResultCard
            label="EMI Change"
            value={formatCompactCurrency(Math.abs(result.monthlyEmiReduction))}
            subtitle={
              result.monthlyEmiReduction >= 0
                ? "Monthly reduction"
                : "Monthly increase"
            }
            variant={result.monthlyEmiReduction >= 0 ? "gain" : "loss"}
          />
        </ResultGrid>

        <ResultGrid cols={3} className="mt-3">
          <ResultCard
            label="Current Total Cost"
            value={formatCompactCurrency(result.currentTotalCost)}
            subtitle="Remaining cost without transfer"
          />
          <ResultCard
            label="New Total Cost"
            value={formatCompactCurrency(result.newTotalCost)}
            subtitle="Includes transfer charges"
            variant={
              result.newTotalCost <= result.currentTotalCost ? "gain" : "loss"
            }
          />
          <ResultCard
            label="Transfer Charges"
            value={formatCompactCurrency(result.transferCharges)}
            subtitle="Processing + foreclosure + other"
          />
        </ResultGrid>

        <div className="mt-6 rounded-2xl bg-secondary p-5">
          <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Cost Comparison
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Current Loan Cost</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(result.currentTotalCost)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-[var(--fc-warm-gray)]"
                  style={{ width: `${currentCostPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">New Loan Cost</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(result.newTotalCost)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-border">
                <div
                  className={`h-full rounded-full ${
                    result.netSavings >= 0 ? "bg-fc-gain" : "bg-fc-loss"
                  }`}
                  style={{ width: `${newCostPct}%` }}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Break-even period:{" "}
            <strong className="text-foreground">
              {result.breakEvenMonths === null
                ? "Not applicable"
                : `${result.breakEvenMonths} months`}
            </strong>
          </p>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            principal: outstandingPrincipal,
            oldRate: currentInterestRate,
            oldMonths: remainingTenureMonths,
            newRate: newInterestRate,
            newMonths: newTenureMonths,
            procFee: processingFeePercent,
            forecloseFee: foreclosureChargePercent,
            other: otherCharges,
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
            Practical transfer rule of thumb
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
              Rate drop alone is not enough. The net benefit depends on pending
              tenure, transfer charges, and whether you reset to a longer
              tenure.
            </p>
            <p>
              If you recover all charges quickly (low break-even months) and
              still have meaningful tenure left, transfer is usually worth
              evaluating in detail.
            </p>
            <p>
              Keep tenure disciplined after transfer. Lower EMI should not
              become an excuse to extend debt unnecessarily.
            </p>
          </div>
        </section>

        <FAQSection items={faqs} />

        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8">
          <h3 className="mb-4 text-xl font-bold text-foreground">
            Related Tools
          </h3>
          <p className="mb-6 text-muted-foreground">
            Use these calculators together before changing your lender.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/tools/personal-loan-prepayment-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Personal Loan Prepayment Calculator
              <IconChevronRight className="size-4" />
            </Link>
            <Link
              to="/tools/car-loan-emi-calculator"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Loan EMI Calculator
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
            "@type": "WebApplication",
            name: "Personal Loan Balance Transfer Calculator",
            url: "https://financechk.com/tools/personal-loan-balance-transfer-calculator",
            description:
              "Evaluate net savings from switching personal loan to a new lender.",
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
