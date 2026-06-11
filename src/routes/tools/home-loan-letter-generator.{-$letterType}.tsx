import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import type { MouseEvent } from "react"
import type { HomeLoanLetterType } from "@/lib/generators/home-loan-letter"
import { FAQSection } from "@/components/finance/faq-section"
import { GeneratorActions } from "@/components/finance/generator-actions"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { ToolLayout } from "@/components/layout/tool-layout"
import { generateHomeLoanLetter } from "@/lib/generators/home-loan-letter"
import { generateSeoMeta } from "@/lib/seo"

const letterTypeOptions: Array<{ label: string; value: HomeLoanLetterType }> = [
  { label: "Prepayment request", value: "prepayment-request" },
  { label: "ROI reduction", value: "roi-reduction-request" },
  { label: "Foreclosure + NOC", value: "foreclosure-noc-request" },
  {
    label: "Interest certificate",
    value: "interest-certificate-request",
  },
]

const letterTypeVariantContent: Record<
  HomeLoanLetterType,
  {
    heading: string
    intro: string
    schemaName: string
  }
> = {
  "prepayment-request": {
    heading: "Home Loan Prepayment Request Letter Generator",
    intro:
      "Create a prepayment request letter with branch-ready format, concise email draft, and follow-up checklist.",
    schemaName: "Home Loan Prepayment Request Letter Generator",
  },
  "roi-reduction-request": {
    heading: "Home Loan ROI Reduction Request Letter Generator",
    intro:
      "Draft a professional ROI reduction request letter with negotiation context, email copy, and document checklist.",
    schemaName: "Home Loan ROI Reduction Letter Generator",
  },
  "foreclosure-noc-request": {
    heading: "Home Loan Foreclosure + NOC Letter Generator",
    intro:
      "Generate foreclosure and NOC request letters with clear closure timeline, checklist, and follow-up plan.",
    schemaName: "Home Loan Foreclosure NOC Letter Generator",
  },
  "interest-certificate-request": {
    heading: "Home Loan Interest Certificate Request Letter Generator",
    intro:
      "Prepare annual interest certificate request drafts for tax filing with branch-letter and email formats.",
    schemaName: "Home Loan Interest Certificate Request Letter Generator",
  },
}

const defaultLoanLetterFormValues = {
  borrowerName: "Rajat Das",
  coBorrowerName: "",
  loanAccountNumber: "HL-0092187",
  bankName: "ABC Bank",
  branchName: "Koramangala Branch",
  city: "Bengaluru",
  requestDate: "2026-04-17",
  requestedActionDate: "2026-04-25",
  contactEmail: "rajat@example.com",
  contactPhone: "9876543210",
  details: "",
}

const letterTypeSeoContent: Record<
  HomeLoanLetterType,
  {
    title: string
    description: string
    path: string
    keywords: Array<string>
  }
> = {
  "prepayment-request": {
    title: "Home Loan Prepayment Request Letter Generator India",
    description:
      "Generate a home-loan prepayment request letter with branch format, email draft, and checklist for smoother processing.",
    path: "/tools/home-loan-letter-generator/prepayment-request",
    keywords: [
      "home loan prepayment letter",
      "prepayment request format",
      "loan part payment request draft",
      "bank prepayment request letter",
    ],
  },
  "roi-reduction-request": {
    title: "Home Loan ROI Reduction Letter Generator India",
    description:
      "Draft a home-loan interest-rate reduction request letter with negotiation points, email copy, and supporting-document checklist.",
    path: "/tools/home-loan-letter-generator/roi-reduction-request",
    keywords: [
      "home loan roi reduction request",
      "interest rate reduction letter",
      "repo linked home loan reduction",
      "bank rate revision request format",
    ],
  },
  "foreclosure-noc-request": {
    title: "Home Loan Foreclosure NOC Letter Generator India",
    description:
      "Create a foreclosure and NOC request letter for home loans with closure checklist, email draft, and follow-up steps.",
    path: "/tools/home-loan-letter-generator/foreclosure-noc-request",
    keywords: [
      "home loan foreclosure letter",
      "noc request letter home loan",
      "loan closure request format",
      "foreclosure draft for bank",
    ],
  },
  "interest-certificate-request": {
    title: "Home Loan Interest Certificate Request Letter Generator India",
    description:
      "Generate an annual home-loan interest certificate request letter for tax filing with branch and email-ready formats.",
    path: "/tools/home-loan-letter-generator/interest-certificate-request",
    keywords: [
      "home loan interest certificate letter",
      "interest certificate request format",
      "home loan tax certificate request",
      "bank certificate request draft",
    ],
  },
}

function isHomeLoanLetterType(
  value: string | undefined
): value is HomeLoanLetterType {
  return letterTypeOptions.some((option) => option.value === value)
}

function getLetterTypeSeoContent(letterType: string | undefined) {
  if (isHomeLoanLetterType(letterType)) {
    return letterTypeSeoContent[letterType]
  }

  return {
    title:
      "Home Loan Letter Generator India | Prepayment, ROI Reduction, NOC Requests",
    description:
      "Generate professional home-loan request letters for prepayment, ROI reduction, foreclosure/NOC, and interest certificate requests. Includes branch letter, email draft, and follow-up checklist.",
    path: "/tools/home-loan-letter-generator",
    keywords: [
      "home loan letter generator",
      "prepayment request letter format",
      "interest rate reduction request letter",
      "foreclosure NOC request letter",
      "home loan interest certificate request",
    ],
  }
}

export const Route = createFileRoute(
  "/tools/home-loan-letter-generator/{-$letterType}"
)({
  beforeLoad: ({ params }) => {
    if (params.letterType && !isHomeLoanLetterType(params.letterType)) {
      throw notFound()
    }
  },
  head: ({ params }) => {
    const seo = getLetterTypeSeoContent(params.letterType)

    return generateSeoMeta({
      title: seo.title,
      description: seo.description,
      path: seo.path,
      keywords: seo.keywords,
    })
  },
  component: HomeLoanLetterGeneratorPage,
})

const faqs = [
  {
    question: "Can this generate both branch letters and emails?",
    answer:
      "Yes. It creates a formal branch letter plus a concise email draft so you can submit through both physical and digital channels.",
  },
  {
    question: "Which request types are covered?",
    answer:
      "You can generate drafts for prepayment, interest-rate reduction, foreclosure/NOC request, and annual interest certificate request.",
  },
  {
    question: "Does this include document checklist?",
    answer:
      "Yes. Each preset includes a targeted checklist and a follow-up plan so your request does not get delayed due to missing paperwork.",
  },
  {
    question: "Can I use this for any bank in India?",
    answer:
      "Yes. Enter your bank, branch, account number, and request details. The output is bank-neutral and ready to customize.",
  },
  {
    question: "How should I track the request after submission?",
    answer:
      "Use the generated T+0 to T+7 follow-up plan and keep inward numbers/email acknowledgments in one folder.",
  },
]

function HomeLoanLetterGeneratorPage() {
  const { letterType } = Route.useParams()
  const hasVariantPath = isHomeLoanLetterType(letterType)
  const selectedLetterType: HomeLoanLetterType = hasVariantPath
    ? letterType
    : "prepayment-request"
  const seoContent = getLetterTypeSeoContent(letterType)
  const currentPagePath = seoContent.path

  const pageHeading = hasVariantPath
    ? letterTypeVariantContent[selectedLetterType].heading
    : "Home Loan Letter Generator"
  const pageIntro = hasVariantPath
    ? letterTypeVariantContent[selectedLetterType].intro
    : "Create branch-ready letters for prepayment, ROI reduction, foreclosure/NOC, and interest-certificate requests."

  const [borrowerName, setBorrowerName] = useState(
    defaultLoanLetterFormValues.borrowerName
  )
  const [coBorrowerName, setCoBorrowerName] = useState(
    defaultLoanLetterFormValues.coBorrowerName
  )
  const [loanAccountNumber, setLoanAccountNumber] = useState(
    defaultLoanLetterFormValues.loanAccountNumber
  )
  const [bankName, setBankName] = useState(defaultLoanLetterFormValues.bankName)
  const [branchName, setBranchName] = useState(
    defaultLoanLetterFormValues.branchName
  )
  const [city, setCity] = useState(defaultLoanLetterFormValues.city)
  const [requestDate, setRequestDate] = useState(
    defaultLoanLetterFormValues.requestDate
  )
  const [requestedActionDate, setRequestedActionDate] = useState(
    defaultLoanLetterFormValues.requestedActionDate
  )
  const [contactEmail, setContactEmail] = useState(
    defaultLoanLetterFormValues.contactEmail
  )
  const [contactPhone, setContactPhone] = useState(
    defaultLoanLetterFormValues.contactPhone
  )
  const [details, setDetails] = useState(defaultLoanLetterFormValues.details)

  const isFormDirty =
    borrowerName !== defaultLoanLetterFormValues.borrowerName ||
    coBorrowerName !== defaultLoanLetterFormValues.coBorrowerName ||
    loanAccountNumber !== defaultLoanLetterFormValues.loanAccountNumber ||
    bankName !== defaultLoanLetterFormValues.bankName ||
    branchName !== defaultLoanLetterFormValues.branchName ||
    city !== defaultLoanLetterFormValues.city ||
    requestDate !== defaultLoanLetterFormValues.requestDate ||
    requestedActionDate !== defaultLoanLetterFormValues.requestedActionDate ||
    contactEmail !== defaultLoanLetterFormValues.contactEmail ||
    contactPhone !== defaultLoanLetterFormValues.contactPhone ||
    details !== defaultLoanLetterFormValues.details

  const handleVariantSwitch = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.pathname === window.location.pathname) {
      return
    }

    if (!isFormDirty) {
      return
    }

    const shouldContinue = window.confirm(
      "You have unsaved inputs. Switching letter type will clear the current form. Continue?"
    )

    if (!shouldContinue) {
      event.preventDefault()
    }
  }

  const result = useMemo(
    () =>
      generateHomeLoanLetter({
        letterType: selectedLetterType,
        borrowerName,
        coBorrowerName,
        loanAccountNumber,
        bankName,
        branchName,
        city,
        requestDate,
        requestedActionDate,
        contactEmail,
        contactPhone,
        details,
      }),
    [
      selectedLetterType,
      borrowerName,
      coBorrowerName,
      loanAccountNumber,
      bankName,
      branchName,
      city,
      requestDate,
      requestedActionDate,
      contactEmail,
      contactPhone,
      details,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Home Loan Letter Generator" },
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
          {pageHeading}
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          {pageIntro}
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
          Loan Request Inputs
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {letterTypeOptions.map((option) => (
            <Link
              key={option.value}
              to="/tools/home-loan-letter-generator/{-$letterType}"
              params={{ letterType: option.value }}
              onClick={handleVariantSwitch}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedLetterType === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Borrower Name
            </label>
            <input
              type="text"
              value={borrowerName}
              onChange={(event) => setBorrowerName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Co-Borrower Name (optional)
            </label>
            <input
              type="text"
              value={coBorrowerName}
              onChange={(event) => setCoBorrowerName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Loan Account Number
            </label>
            <input
              type="text"
              value={loanAccountNumber}
              onChange={(event) => setLoanAccountNumber(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(event) => setBankName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Branch Name
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(event) => setBranchName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Request Date
            </label>
            <input
              type="date"
              value={requestDate}
              onChange={(event) => setRequestDate(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Requested Action Date
            </label>
            <input
              type="date"
              value={requestedActionDate}
              onChange={(event) => setRequestedActionDate(event.target.value)}
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
              Contact Phone
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Additional Details (optional)
            </label>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Subject Line
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {result.subjectLine}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Branch Letter Draft
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.branchLetter}
          </pre>
          <GeneratorActions
            title="Home Loan Letter"
            content={result.branchLetter}
            fileName={`home-loan-letter-${selectedLetterType}.txt`}
            className="mt-4"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Email Draft
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.emailDraft}
          </pre>
          <GeneratorActions
            title="Home Loan Email Draft"
            content={result.emailDraft}
            fileName={`home-loan-email-${selectedLetterType}.txt`}
            className="mt-4"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Document Checklist
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.documentChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Follow-Up Plan
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.followUpPlan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <ShareResult
          params={{
            loan: loanAccountNumber,
            bank: bankName,
          }}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/20 p-5 text-sm text-muted-foreground">
        <p>
          Need a refinance decision before lettering? Try
          <Link
            to="/tools/home-loan-balance-transfer-calculator"
            className="mx-1 inline-flex items-center gap-1 text-foreground underline underline-offset-4"
          >
            Home Loan Balance Transfer Calculator
            <IconChevronRight className="size-3.5" />
          </Link>
          for savings and break-even estimate.
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
            name: hasVariantPath
              ? letterTypeVariantContent[selectedLetterType].schemaName
              : "Home Loan Letter Generator",
            description: seoContent.description,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: `https://financechk.com${currentPagePath}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          }),
        }}
      />
    </ToolLayout>
  )
}
