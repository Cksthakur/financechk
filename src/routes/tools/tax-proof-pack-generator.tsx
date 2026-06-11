import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { CurrencyInput } from "@/components/finance/currency-input"
import { FAQSection } from "@/components/finance/faq-section"
import { GeneratorActions } from "@/components/finance/generator-actions"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { ToolLayout } from "@/components/layout/tool-layout"
import { generateTaxProofPack } from "@/lib/generators/tax-proof-pack"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/tools/tax-proof-pack-generator")({
  head: () =>
    generateSeoMeta({
      title:
        "Tax Proof Pack Generator India | Payroll Submission Checklist + Email Draft",
      description:
        "Generate complete tax-proof submission pack for payroll: document checklist, missing-proof alerts, monthly reminder plan, file naming guide and cover email draft.",
      path: "/tools/tax-proof-pack-generator",
      keywords: [
        "tax proof pack generator",
        "Form 12BB checklist generator",
        "payroll tax proof submission checklist",
        "80C 80D proof organizer",
        "tax proof email draft",
      ],
    }),
  component: TaxProofPackGeneratorPage,
})

const faqs = [
  {
    question: "What does this generator create exactly?",
    answer:
      "It creates a complete payroll-proof bundle: cover email draft, section-wise checklist, missing-doc flags, month-by-month reminder plan, and standardized file naming guide.",
  },
  {
    question: "Can I use this for Form 12BB submission?",
    answer:
      "Yes. It is designed for salaried employees preparing Form 12BB and supporting proofs for payroll TDS optimization.",
  },
  {
    question: "Does this calculate tax payable?",
    answer:
      "No, this is not a tax calculator. It is an execution and documentation generator to improve payroll submission quality and reduce rejection risk.",
  },
  {
    question: "How do I use file naming output?",
    answer:
      "Use the suggested naming convention for each document bundle before uploading or sharing with payroll/HR. This improves traceability and reduces clarification loops.",
  },
  {
    question: "Can this replace CA review?",
    answer:
      "It helps operationally. For final eligibility interpretation and complex deductions, professional tax review is still recommended.",
  },
]

function TaxProofPackGeneratorPage() {
  const [employeeName, setEmployeeName] = useState("Rajat Das")
  const [employeeId, setEmployeeId] = useState("EMP1029")
  const [employerName, setEmployerName] = useState("FinanceChk Labs Pvt Ltd")
  const [financialYear, setFinancialYear] = useState("2026-27")
  const [assessmentYear, setAssessmentYear] = useState("2027-28")
  const [contactEmail, setContactEmail] = useState("rajat@example.com")
  const [annualBasicSalary, setAnnualBasicSalary] = useState(960000)
  const [annualHraReceived, setAnnualHraReceived] = useState(360000)
  const [annualRentPaid, setAnnualRentPaid] = useState(420000)
  const [section80cInvestments, setSection80cInvestments] = useState(150000)
  const [section80dPremium, setSection80dPremium] = useState(25000)
  const [npsContribution, setNpsContribution] = useState(50000)
  const [homeLoanInterest, setHomeLoanInterest] = useState(180000)
  const [educationLoanInterest, setEducationLoanInterest] = useState(0)
  const [ltaClaim, setLtaClaim] = useState(0)

  const result = useMemo(
    () =>
      generateTaxProofPack({
        employeeName,
        employeeId,
        employerName,
        financialYear,
        assessmentYear,
        annualBasicSalary,
        annualHraReceived,
        annualRentPaid,
        section80cInvestments,
        section80dPremium,
        npsContribution,
        homeLoanInterest,
        educationLoanInterest,
        ltaClaim,
        contactEmail,
      }),
    [
      employeeName,
      employeeId,
      employerName,
      financialYear,
      assessmentYear,
      annualBasicSalary,
      annualHraReceived,
      annualRentPaid,
      section80cInvestments,
      section80dPremium,
      npsContribution,
      homeLoanInterest,
      educationLoanInterest,
      ltaClaim,
      contactEmail,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Tax Proof Pack Generator" },
      ]}
    >
      <div className="mb-6">
        <h1
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "46px",
            letterSpacing: "-0.92px",
            lineHeight: 1.08,
          }}
        >
          Tax Proof Pack Generator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Build a payroll-ready tax-proof submission pack with checklist,
          reminder plan, and cover email draft in minutes.
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
          Employee & Claim Inputs
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Employee Name
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(event) => setEmployeeName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Employer Name
            </label>
            <input
              type="text"
              value={employerName}
              onChange={(event) => setEmployerName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Contact Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Financial Year
            </label>
            <input
              type="text"
              value={financialYear}
              onChange={(event) => setFinancialYear(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Assessment Year
            </label>
            <input
              type="text"
              value={assessmentYear}
              onChange={(event) => setAssessmentYear(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <CurrencyInput
            label="Annual Basic Salary"
            value={annualBasicSalary}
            onChange={setAnnualBasicSalary}
            min={0}
            max={50000000}
          />

          <CurrencyInput
            label="Annual HRA Received"
            value={annualHraReceived}
            onChange={setAnnualHraReceived}
            min={0}
            max={5000000}
          />

          <CurrencyInput
            label="Annual Rent Paid"
            value={annualRentPaid}
            onChange={setAnnualRentPaid}
            min={0}
            max={5000000}
          />

          <CurrencyInput
            label="Section 80C Investments"
            value={section80cInvestments}
            onChange={setSection80cInvestments}
            min={0}
            max={200000}
          />

          <CurrencyInput
            label="Section 80D Premium"
            value={section80dPremium}
            onChange={setSection80dPremium}
            min={0}
            max={100000}
          />

          <CurrencyInput
            label="NPS Contribution"
            value={npsContribution}
            onChange={setNpsContribution}
            min={0}
            max={200000}
          />

          <CurrencyInput
            label="Home Loan Interest"
            value={homeLoanInterest}
            onChange={setHomeLoanInterest}
            min={0}
            max={500000}
          />

          <CurrencyInput
            label="Education Loan Interest"
            value={educationLoanInterest}
            onChange={setEducationLoanInterest}
            min={0}
            max={500000}
          />

          <CurrencyInput
            label="LTA Claim"
            value={ltaClaim}
            onChange={setLtaClaim}
            min={0}
            max={500000}
          />
        </div>
      </div>

      <div className="mt-7 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Submission Summary Note
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.summaryNote}
          </pre>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Cover Email Draft
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.coverEmailDraft}
          </pre>
          <GeneratorActions
            title="Tax Proof Cover Email"
            content={result.coverEmailDraft}
            fileName={`tax-proof-cover-email-${financialYear}.txt`}
            className="mt-4"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Submission Checklist
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.submissionChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Missing / Risk Alerts
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.missingDocuments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Monthly Reminder Plan
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.monthlyReminderPlan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              File Naming Guide
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.fileNamingGuide.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <ShareResult
          params={{
            fy: financialYear,
            ay: assessmentYear,
            employee: employeeId,
          }}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/20 p-5 text-sm text-muted-foreground">
        <p>
          Need notice handling next? Use
          <Link
            to="/tools/income-tax-notice-reply-generator/{-$noticeType}"
            params={{}}
            className="mx-1 inline-flex items-center gap-1 text-foreground underline underline-offset-4"
          >
            Income Tax Notice Reply Generator
            <IconChevronRight className="size-3.5" />
          </Link>
          for structured response drafts.
        </p>
      </div>

      <div className="mt-14">
        <FAQSection items={faqs} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Tax Proof Pack Generator",
            description:
              "Generate payroll-ready tax proof checklist, email draft and reminder plan for salaried employees.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://financechk.com/tools/tax-proof-pack-generator",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          }),
        }}
      />
    </ToolLayout>
  )
}
