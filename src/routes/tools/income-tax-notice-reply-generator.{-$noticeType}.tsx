import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import type { MouseEvent } from "react"
import type { TaxNoticeType } from "@/lib/generators/income-tax-notice-reply"
import { CurrencyInput } from "@/components/finance/currency-input"
import { FAQSection } from "@/components/finance/faq-section"
import { GeneratorActions } from "@/components/finance/generator-actions"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { ToolLayout } from "@/components/layout/tool-layout"
import { generateIncomeTaxNoticeReply } from "@/lib/generators/income-tax-notice-reply"
import { generateSeoMeta } from "@/lib/seo"

const noticeTypeOptions: Array<{ label: string; value: TaxNoticeType }> = [
  { label: "143(1) mismatch", value: "143-1-mismatch" },
  { label: "Defective return 139(9)", value: "defective-return-139-9" },
  { label: "Demand notice 156", value: "demand-notice-156" },
  { label: "AIS mismatch", value: "ais-mismatch" },
]

const noticeTypeVariantContent: Record<
  TaxNoticeType,
  {
    heading: string
    intro: string
    schemaName: string
  }
> = {
  "143-1-mismatch": {
    heading: "Income Tax 143(1) Mismatch Reply Generator",
    intro:
      "Create a clear 143(1) mismatch response with subject line, portal-ready draft, and a practical 48-hour checklist.",
    schemaName: "143(1) Notice Reply Generator",
  },
  "defective-return-139-9": {
    heading: "Defective Return 139(9) Reply Generator",
    intro:
      "Generate a complete 139(9) response with correction summary, document checklist, and email-ready copy.",
    schemaName: "Defective Return 139(9) Reply Generator",
  },
  "demand-notice-156": {
    heading: "Demand Notice 156 Reply Generator",
    intro:
      "Prepare a demand notice 156 reply draft with dispute points, evidence checklist, and follow-up sequence.",
    schemaName: "Demand Notice 156 Reply Generator",
  },
  "ais-mismatch": {
    heading: "AIS Mismatch Reply Generator",
    intro:
      "Draft an AIS mismatch response with transaction explanation, portal-ready language, and supporting-document plan.",
    schemaName: "AIS Mismatch Reply Generator",
  },
}

const defaultNoticeFormValues = {
  fullName: "Rajat Das",
  pan: "ABCDE1234F",
  assessmentYear: "2026-27",
  noticeDate: "2026-07-15",
  filingDate: "2026-07-28",
  noticeReference: "DIN-2026-ABC123",
  jurisdiction: "Assessing Officer, CPC",
  contactEmail: "rajat@example.com",
  contactPhone: "9876543210",
  amountInDispute: 27500,
  issueSummary:
    "Demand appears due to duplicate income capture in AIS while the same salary value is already disclosed in filed ITR.",
  additionalContext: "",
}

const noticeTypeSeoContent: Record<
  TaxNoticeType,
  {
    title: string
    description: string
    path: string
    keywords: Array<string>
  }
> = {
  "143-1-mismatch": {
    title: "143(1) Notice Reply Generator India | Intimation Mismatch Draft",
    description:
      "Generate a 143(1) intimation mismatch response draft with subject line, portal-ready reply format, email copy, and document checklist.",
    path: "/tools/income-tax-notice-reply-generator/143-1-mismatch",
    keywords: [
      "143(1) notice reply generator",
      "intimation mismatch reply format",
      "income tax 143 1 response draft",
      "cpc notice reply template",
    ],
  },
  "defective-return-139-9": {
    title: "Defective Return 139(9) Reply Generator India | Response Draft",
    description:
      "Generate a structured 139(9) defective return response draft with correction summary, checklist, and email copy for faster resubmission.",
    path: "/tools/income-tax-notice-reply-generator/defective-return-139-9",
    keywords: [
      "defective return 139 9 reply",
      "139(9) response draft",
      "income tax defective notice format",
      "itr defective return correction",
    ],
  },
  "demand-notice-156": {
    title: "Demand Notice 156 Reply Generator India | Tax Demand Response",
    description:
      "Create a demand notice 156 response draft with dispute summary, payment/reconciliation points, and supporting-document checklist.",
    path: "/tools/income-tax-notice-reply-generator/demand-notice-156",
    keywords: [
      "demand notice 156 reply",
      "tax demand response format",
      "income tax demand draft letter",
      "notice 156 mismatch reply",
    ],
  },
  "ais-mismatch": {
    title: "AIS Mismatch Reply Generator India | Income Tax Response Draft",
    description:
      "Draft an AIS mismatch response for income-tax notices with transaction-level explanation, subject line, and filing checklist.",
    path: "/tools/income-tax-notice-reply-generator/ais-mismatch",
    keywords: [
      "AIS mismatch reply",
      "annual information statement correction",
      "income tax ais response draft",
      "ais notice reply format",
    ],
  },
}

function isTaxNoticeType(value: string | undefined): value is TaxNoticeType {
  return noticeTypeOptions.some((option) => option.value === value)
}

function getNoticeTypeSeoContent(noticeType: string | undefined) {
  if (isTaxNoticeType(noticeType)) {
    return noticeTypeSeoContent[noticeType]
  }

  return {
    title:
      "Income Tax Notice Reply Generator India | 143(1), 139(9), 156 & AIS",
    description:
      "Generate professional income tax notice replies for 143(1) mismatch, defective return 139(9), demand notice 156 and AIS mismatch. Includes subject line, draft, email copy and action checklist.",
    path: "/tools/income-tax-notice-reply-generator",
    keywords: [
      "income tax notice reply generator",
      "143(1) reply format",
      "defective return 139(9) response",
      "demand notice 156 reply draft",
      "AIS mismatch response",
    ],
  }
}

export const Route = createFileRoute(
  "/tools/income-tax-notice-reply-generator/{-$noticeType}"
)({
  beforeLoad: ({ params }) => {
    if (params.noticeType && !isTaxNoticeType(params.noticeType)) {
      throw notFound()
    }
  },
  head: ({ params }) => {
    const seo = getNoticeTypeSeoContent(params.noticeType)

    return generateSeoMeta({
      title: seo.title,
      description: seo.description,
      path: seo.path,
      keywords: seo.keywords,
    })
  },
  component: IncomeTaxNoticeReplyGeneratorPage,
})

const faqs = [
  {
    question: "Can I use this for 143(1) mismatch and AIS notices?",
    answer:
      "Yes. Pick the notice type and fill the mismatch summary. The generator prepares a structured draft and checklist you can use before portal submission.",
  },
  {
    question: "Does this tool file the response automatically?",
    answer:
      "No. It generates a draft and email copy. You still need to upload/submit on the income tax portal and attach supporting documents.",
  },
  {
    question: "What details should I keep ready before drafting?",
    answer:
      "Keep notice PDF, DIN/reference, AY, filed ITR acknowledgment, mismatch amount, Form 26AS/AIS details, and relevant deduction or income proofs ready.",
  },
  {
    question: "Can I share this draft with my CA?",
    answer:
      "Yes. Use Copy or Download TXT and send the draft with document checklist to your CA for review before final submission.",
  },
  {
    question: "Is legal advice included?",
    answer:
      "No. This is a drafting aid. For high-value disputes and legal interpretation, get professional review before filing your final response.",
  },
]

function IncomeTaxNoticeReplyGeneratorPage() {
  const { noticeType } = Route.useParams()
  const hasVariantPath = isTaxNoticeType(noticeType)
  const selectedNoticeType: TaxNoticeType = hasVariantPath
    ? noticeType
    : "143-1-mismatch"
  const seoContent = getNoticeTypeSeoContent(noticeType)
  const currentPagePath = seoContent.path

  const pageHeading = hasVariantPath
    ? noticeTypeVariantContent[selectedNoticeType].heading
    : "Income Tax Notice Reply Generator"
  const pageIntro = hasVariantPath
    ? noticeTypeVariantContent[selectedNoticeType].intro
    : "Create polished reply drafts for 143(1), 139(9), 156, and AIS notices with checklist and response workflow in one place."

  const [fullName, setFullName] = useState(defaultNoticeFormValues.fullName)
  const [pan, setPan] = useState(defaultNoticeFormValues.pan)
  const [assessmentYear, setAssessmentYear] = useState(
    defaultNoticeFormValues.assessmentYear
  )
  const [noticeDate, setNoticeDate] = useState(
    defaultNoticeFormValues.noticeDate
  )
  const [filingDate, setFilingDate] = useState(
    defaultNoticeFormValues.filingDate
  )
  const [noticeReference, setNoticeReference] = useState(
    defaultNoticeFormValues.noticeReference
  )
  const [jurisdiction, setJurisdiction] = useState(
    defaultNoticeFormValues.jurisdiction
  )
  const [contactEmail, setContactEmail] = useState(
    defaultNoticeFormValues.contactEmail
  )
  const [contactPhone, setContactPhone] = useState(
    defaultNoticeFormValues.contactPhone
  )
  const [amountInDispute, setAmountInDispute] = useState(
    defaultNoticeFormValues.amountInDispute
  )
  const [issueSummary, setIssueSummary] = useState(
    defaultNoticeFormValues.issueSummary
  )
  const [additionalContext, setAdditionalContext] = useState(
    defaultNoticeFormValues.additionalContext
  )

  const isFormDirty =
    fullName !== defaultNoticeFormValues.fullName ||
    pan !== defaultNoticeFormValues.pan ||
    assessmentYear !== defaultNoticeFormValues.assessmentYear ||
    noticeDate !== defaultNoticeFormValues.noticeDate ||
    filingDate !== defaultNoticeFormValues.filingDate ||
    noticeReference !== defaultNoticeFormValues.noticeReference ||
    jurisdiction !== defaultNoticeFormValues.jurisdiction ||
    contactEmail !== defaultNoticeFormValues.contactEmail ||
    contactPhone !== defaultNoticeFormValues.contactPhone ||
    amountInDispute !== defaultNoticeFormValues.amountInDispute ||
    issueSummary !== defaultNoticeFormValues.issueSummary ||
    additionalContext !== defaultNoticeFormValues.additionalContext

  const handleVariantSwitch = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.pathname === window.location.pathname) {
      return
    }

    if (!isFormDirty) {
      return
    }

    const shouldContinue = window.confirm(
      "You have unsaved inputs. Switching notice type will clear the current form. Continue?"
    )

    if (!shouldContinue) {
      event.preventDefault()
    }
  }

  const result = useMemo(
    () =>
      generateIncomeTaxNoticeReply({
        noticeType: selectedNoticeType,
        fullName,
        pan,
        assessmentYear,
        noticeDate,
        noticeReference,
        issueSummary,
        amountInDispute,
        jurisdiction,
        contactEmail,
        contactPhone,
        filingDate,
        additionalContext,
      }),
    [
      selectedNoticeType,
      fullName,
      pan,
      assessmentYear,
      noticeDate,
      noticeReference,
      issueSummary,
      amountInDispute,
      jurisdiction,
      contactEmail,
      contactPhone,
      filingDate,
      additionalContext,
    ]
  )

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Income Tax Notice Reply Generator" },
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
          Notice Type
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {noticeTypeOptions.map((option) => (
            <Link
              key={option.value}
              to="/tools/income-tax-notice-reply-generator/{-$noticeType}"
              params={{ noticeType: option.value }}
              onClick={handleVariantSwitch}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedNoticeType === option.value
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
              Taxpayer Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              PAN
            </label>
            <input
              type="text"
              value={pan}
              onChange={(event) => setPan(event.target.value.toUpperCase())}
              maxLength={10}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground uppercase"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Notice Reference / DIN
            </label>
            <input
              type="text"
              value={noticeReference}
              onChange={(event) => setNoticeReference(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Notice Date
            </label>
            <input
              type="date"
              value={noticeDate}
              onChange={(event) => setNoticeDate(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Filing Date
            </label>
            <input
              type="date"
              value={filingDate}
              onChange={(event) => setFilingDate(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <CurrencyInput
            label="Amount in Dispute"
            value={amountInDispute}
            onChange={setAmountInDispute}
            min={0}
            max={100000000}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Jurisdiction / Officer
            </label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(event) => setJurisdiction(event.target.value)}
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
              Issue Summary
            </label>
            <textarea
              value={issueSummary}
              onChange={(event) => setIssueSummary(event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Additional Clarification (optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(event) => setAdditionalContext(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Generated Subject
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {result.subjectLine}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Reply Draft (Portal / PDF)
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.draftReply}
          </pre>
          <GeneratorActions
            title="Income Tax Notice Reply"
            content={result.draftReply}
            fileName={`notice-reply-${selectedNoticeType}-${assessmentYear}.txt`}
            className="mt-4"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Cover Email Draft
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-secondary/25 p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
            {result.emailBody}
          </pre>
          <GeneratorActions
            title="Income Tax Notice Email Draft"
            content={result.emailBody}
            fileName={`notice-email-${selectedNoticeType}-${assessmentYear}.txt`}
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
              48-Hour Action Plan
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {result.actionPlan48h.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <ShareResult
          params={{
            ay: assessmentYear,
            amount: amountInDispute,
          }}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/20 p-5 text-sm text-muted-foreground">
        <p>
          Need more tax workflows? Try the
          <Link
            to="/tools/tax-proof-pack-generator"
            className="mx-1 inline-flex items-center gap-1 text-foreground underline underline-offset-4"
          >
            Tax Proof Pack Generator
            <IconChevronRight className="size-3.5" />
          </Link>
          for payroll-proof submission planning.
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
              ? noticeTypeVariantContent[selectedNoticeType].schemaName
              : "Income Tax Notice Reply Generator",
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
