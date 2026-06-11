import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { FAQSection } from "@/components/finance/faq-section"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { generateRentReceipts } from "@/lib/calculators/rent-receipt"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/rent-receipt-generator")({
  head: () =>
    generateSeoMeta({
      title: "Rent Receipt Generator India | Free PDF Download for HRA Claim",
      description:
        "Generate monthly rent receipts for HRA exemption with landlord details, PAN checks above Rs 1 lakh annual rent, and print-ready format.",
      path: "/tools/rent-receipt-generator",
      keywords: [
        "rent receipt generator India",
        "rent receipt format for HRA claim",
        "free rent receipt download PDF",
        "rent receipt with landlord PAN",
        "monthly rent receipt generator online",
      ],
    }),
  component: RentReceiptGeneratorPage,
})

const faqs = [
  {
    question: "Is landlord PAN mandatory on rent receipt for HRA?",
    answer:
      "If annual rent exceeds Rs 1,00,000, landlord PAN is generally required for employer/ITR documentation. This tool flags that condition automatically.",
  },
  {
    question: "Do I need a revenue stamp on rent receipt?",
    answer:
      "A revenue stamp is commonly used for cash receipts above threshold values. For bank-transfer cases, supporting statements are also useful for validation.",
  },
  {
    question: "Can I claim HRA for rent paid to parents?",
    answer:
      "Yes, if tenancy is genuine and rent is actually paid. Keep rent receipts, payment proof, and ensure rental income is disclosed by recipient where applicable.",
  },
  {
    question: "How many rent receipts are needed for HRA submission?",
    answer:
      "Employers often ask monthly or periodic receipts for the claim period. Use this generator to create a complete month-wise set for your selected range.",
  },
  {
    question: "What details must a valid rent receipt include?",
    answer:
      "Tenant name, landlord name/address, property address, rent amount, receipt month/date, and landlord PAN where required are the core details.",
  },
]

function RentReceiptGeneratorPage() {
  const [tenantName, setTenantName] = useState("Rajat Das")
  const [landlordName, setLandlordName] = useState("Landlord Name")
  const [landlordAddress, setLandlordAddress] = useState("Landlord Address")
  const [propertyAddress, setPropertyAddress] = useState(
    "Rented Property Address"
  )
  const [monthlyRent, setMonthlyRent] = useState(18000)
  const [fromMonth, setFromMonth] = useState("2025-04")
  const [toMonth, setToMonth] = useState("2026-03")
  const [landlordPan, setLandlordPan] = useState("")

  const result = useMemo(
    () =>
      generateRentReceipts({
        tenantName,
        landlordName,
        landlordAddress,
        propertyAddress,
        monthlyRent,
        fromMonth,
        toMonth,
        landlordPan,
      }),
    [
      tenantName,
      landlordName,
      landlordAddress,
      propertyAddress,
      monthlyRent,
      fromMonth,
      toMonth,
      landlordPan,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Rent Receipt Generator" },
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
          Free Rent Receipt Generator - Download PDF for HRA Tax Exemption
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Create month-wise rent receipts for HRA claim with landlord PAN
          checks, printable format, and bulk generation for your filing period.
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
          Receipt Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Tenant Name
            </label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Landlord Name
            </label>
            <input
              type="text"
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Landlord Address
            </label>
            <input
              type="text"
              value={landlordAddress}
              onChange={(e) => setLandlordAddress(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Rented Property Address
            </label>
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <CurrencyInput
            label="Monthly Rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            min={0}
            max={500000}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Landlord PAN (optional)
            </label>
            <input
              type="text"
              value={landlordPan}
              onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground uppercase"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              From Month
            </label>
            <input
              type="month"
              value={fromMonth}
              onChange={(e) => setFromMonth(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              To Month
            </label>
            <input
              type="month"
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Receipt Summary
        </p>

        <ResultGrid cols={4}>
          <ResultCard
            label="Receipts Generated"
            value={`${result.monthCount}`}
            subtitle="Month-wise receipts"
          />
          <ResultCard
            label="Total Rent"
            value={formatCompactCurrency(result.totalRentForPeriod)}
            subtitle="For selected period"
          />
          <ResultCard
            label="Annualized Rent"
            value={formatCompactCurrency(result.annualizedRent)}
            subtitle="Monthly rent x 12"
          />
          <ResultCard
            label="PAN Requirement"
            value={result.panRequired ? "Yes" : "No"}
            subtitle="Above Rs 1,00,000 annual rent"
            variant={result.panRequired ? "loss" : "default"}
          />
        </ResultGrid>

        {result.panMissing && (
          <div className="mt-4 rounded-xl border border-fc-loss bg-fc-loss-bg p-4 text-sm text-fc-loss-text">
            Landlord PAN is recommended because annualized rent exceeds Rs
            1,00,000.
          </div>
        )}

        {result.suggestedRevenueStamp && (
          <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
            Revenue stamp may be required for higher-value physical rent
            receipts, especially for cash acknowledgment workflows.
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Generated Monthly Receipts
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/50 text-xs text-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Receipt No.</th>
                  <th className="px-4 py-3 font-medium">Month</th>
                  <th className="px-4 py-3 text-right font-medium">Rent</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {result.receipts.map((row) => (
                  <tr key={row.receiptNumber} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-mono text-foreground">
                      {row.receiptNumber}
                    </td>
                    <td className="px-4 py-3">{row.monthLabel}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {formatCurrency(row.rentAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-5">
          <p className="text-sm text-muted-foreground">
            Use browser print (Ctrl/Cmd+P) and select Save as PDF to download
            your rent receipt set for employer submission or tax documentation.
          </p>
        </div>

        <ShareResult
          className="mt-6"
          params={{
            rent: monthlyRent,
            from: fromMonth,
            to: toMonth,
            pan: landlordPan,
          }}
        />
      </div>

      <div className="mt-14">
        <section className="mb-12">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "36px",
              letterSpacing: "normal",
              lineHeight: 1.13,
            }}
          >
            HRA documentation guide: make receipts audit-ready from day one
          </h2>
          <div
            className="mt-5 flex flex-col gap-5 text-muted-foreground"
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0.18px",
            }}
          >
            <p>
              Rent receipts are often prepared in a hurry near proof-submission
              deadlines, which creates avoidable errors in names, period, PAN,
              and amount consistency. This tool is built to generate month-wise
              receipts in one flow so your documentation stays clean across the
              full claim period.
            </p>
            <p>
              If annual rent crosses the usual threshold of Rs 1,00,000,
              landlord PAN details become important for employer-side
              validation. This generator highlights that condition so you can
              resolve gaps before payroll cut-offs rather than during final
              filing stress.
            </p>
            <p>
              Keep receipt data aligned with payment reality. If rent is paid
              via bank transfer, maintain matching bank statements and transfer
              references. If paid in cash, preserve signed acknowledgments and
              stamp requirements where relevant.
            </p>
            <p>
              A practical workflow is to generate receipts quarterly, not
              yearly. That reduces correction effort and improves audit
              readiness if your employer asks for additional proof.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Receipt quality checklist
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Tenant, landlord, and property details match official records.
                </li>
                <li>
                  Month range and rent values align with actual payment
                  timeline.
                </li>
                <li>Landlord PAN captured when annual threshold is crossed.</li>
                <li>
                  Digital/print copies stored with payment-proof references.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">
                Frequent rejection causes
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  Mismatch between receipt month and actual payment month.
                </li>
                <li>Missing or invalid landlord PAN where required.</li>
                <li>
                  Inconsistent rent amount across receipts and declarations.
                </li>
                <li>No supporting trail for high-value cash rent claims.</li>
              </ul>
            </div>
          </div>
        </section>

        <FAQSection items={faqs} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Rent Receipt Generator India",
            description:
              "Generate printable month-wise rent receipts for HRA tax exemption with PAN validation.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/rent-receipt-generator",
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
