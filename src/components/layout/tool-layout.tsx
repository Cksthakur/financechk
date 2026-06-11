import { Link, useLocation } from "@tanstack/react-router"
import { IconChevronRight } from "@tabler/icons-react"
import type { ToolGuideCategory } from "@/components/finance/tool-longform-howto"
import { ToolLongformHowTo } from "@/components/finance/tool-longform-howto"
import { cn } from "@/lib/utils"
import { AdUnit } from "@/components/finance/ad-unit"
import { DownloadGate } from "@/components/finance/download-gate"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ToolLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  breadcrumbs?: Array<BreadcrumbItem>
  className?: string
  richGuide?: React.ReactNode
}

type ToolCategory = "loans" | "investment" | "tax" | "trading"

const GUIDE_UPDATED_LABEL = "April 2026"

const categoryBreadcrumbs: Record<ToolCategory, BreadcrumbItem> = {
  loans: { label: "Loan Calculators", href: "/tools/loan-calculators" },
  investment: {
    label: "Investment Calculators",
    href: "/tools/investment-calculators",
  },
  tax: { label: "Tax Calculators", href: "/tools/tax-calculators" },
  trading: { label: "Trading Calculators", href: "/tools/trading-calculators" },
}

const categoryMatchers: Record<ToolCategory, Array<RegExp>> = {
  loans: [
    /^\/tools\/home-loan/i,
    /^\/tools\/personal-loan/i,
    /^\/tools\/education-loan/i,
    /^\/tools\/car-loan/i,
    /^\/tools\/advanced-home-loan-emi-calculator/i,
    /^\/tools\/prepay-vs-invest/i,
    /^\/tools\/home-loan-letter-generator/i,
  ],
  investment: [
    /^\/tools\/sip/i,
    /^\/tools\/step-up-sip/i,
    /^\/tools\/swp/i,
    /^\/tools\/fd/i,
    /^\/tools\/rd/i,
    /^\/tools\/lumpsum/i,
    /^\/tools\/ppf/i,
    /^\/tools\/epf/i,
    /^\/tools\/elss/i,
    /^\/tools\/emergency-fund/i,
    /^\/tools\/sukanya-samriddhi/i,
    /^\/tools\/nps-vs-epf-vs-ppf/i,
    /^\/tools\/compound-interest/i,
  ],
  tax: [
    /^\/tools\/income-tax/i,
    /^\/tools\/tax-regime/i,
    /^\/tools\/new-vs-old-regime-break-even/i,
    /^\/tools\/section-87a/i,
    /^\/tools\/advance-tax/i,
    /^\/tools\/hra/i,
    /^\/tools\/gratuity/i,
    /^\/tools\/rent-receipt/i,
    /^\/tools\/ltcg-stcg/i,
    /^\/tools\/freelancer-tax/i,
    /^\/tools\/home-loan-tax-benefit/i,
    /^\/tools\/depreciation/i,
    /^\/tools\/tax-proof-pack-generator/i,
    /^\/tools\/income-tax-notice-reply-generator/i,
    /^\/tools\/form-16-tax-crosscheck/i,
    /^\/tools\/salary-hike-tax-impact-calculator/i,
  ],
  trading: [
    /^\/tools\/stt/i,
    /^\/tools\/fo-brokerage/i,
    /^\/tools\/brokerage-comparison/i,
    /^\/tools\/mcx/i,
  ],
}

function inferCategoryFromPath(pathname: string): ToolCategory | undefined {
  for (const category of Object.keys(categoryMatchers) as Array<ToolCategory>) {
    if (categoryMatchers[category].some((regex) => regex.test(pathname))) {
      return category
    }
  }

  return undefined
}

const acronymTokens = new Set([
  "ai",
  "elss",
  "emi",
  "epf",
  "fd",
  "fo",
  "fno",
  "f&o",
  "hra",
  "it",
  "ltcg",
  "mcx",
  "nps",
  "ppf",
  "rd",
  "roi",
  "sip",
  "ssy",
  "stcg",
  "stt",
  "tds",
  "vpf",
])

function humanizeToolSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((token) => {
      const normalized = token.trim().toLowerCase()

      if (acronymTokens.has(normalized)) {
        if (normalized === "fno") {
          return "F&O"
        }

        return normalized.toUpperCase()
      }

      if (/^\d+$/.test(normalized)) {
        return normalized
      }

      return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`
    })
    .join(" ")
}

function resolveGuideToolName(
  pathname: string,
  breadcrumbs?: Array<BreadcrumbItem>
): string {
  const crumbLabel = breadcrumbs?.[breadcrumbs.length - 1]?.label?.trim()

  if (
    crumbLabel &&
    /(calculator|generator|comparison|crosscheck|tool|regime|relief|receipt|pack|letter|eligibility|benefit|tax)/i.test(
      crumbLabel
    )
  ) {
    return crumbLabel
  }

  const pathSegments = pathname.split("/").filter(Boolean)
  const toolSlug = pathSegments[1]

  if (toolSlug) {
    return humanizeToolSlug(toolSlug)
  }

  return "Financial Tool"
}

function inferGuideCategory(pathname: string): ToolGuideCategory {
  const inferredCategory = inferCategoryFromPath(pathname)

  if (inferredCategory) {
    return inferredCategory
  }

  if (/^\/tools\/(tax|income-tax|us-federal-income-tax)/i.test(pathname)) {
    return "tax"
  }

  if (
    /^\/tools\/(loan|home-loan|car-loan|personal-loan|education-loan)/i.test(
      pathname
    )
  ) {
    return "loans"
  }

  if (
    /^\/tools\/(sip|fd|rd|ppf|epf|swp|lumpsum|elss|nps|compound-interest|emergency-fund|sukanya)/i.test(
      pathname
    )
  ) {
    return "investment"
  }

  if (/^\/tools\/(stt|fo-brokerage|brokerage|mcx)/i.test(pathname)) {
    return "trading"
  }

  return "general"
}

export function ToolLayout({
  children,
  sidebar,
  breadcrumbs,
  className,
  richGuide,
}: ToolLayoutProps) {
  const { pathname } = useLocation()

  const normalizedBreadcrumbs = injectCategoryBreadcrumb(breadcrumbs, pathname)
  const shouldRenderAutoGuide = pathname.startsWith("/tools/")
  const autoGuide = shouldRenderAutoGuide ? (
    <ToolLongformHowTo
      toolName={resolveGuideToolName(pathname, breadcrumbs)}
      category={inferGuideCategory(pathname)}
      updated={GUIDE_UPDATED_LABEL}
    />
  ) : null
  const guideContent = richGuide ?? autoGuide

  return (
    <div
      className={cn(
        "mx-auto max-w-(--fc-page-width) px-5 py-8 md:px-8 md:py-12",
        className
      )}
    >
      {/* Breadcrumbs */}
      {normalizedBreadcrumbs && normalizedBreadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol
            className="flex flex-wrap items-center gap-1 text-[15px] text-muted-foreground"
            style={{ letterSpacing: "0.15px" }}
          >
            {normalizedBreadcrumbs.map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <IconChevronRight className="size-3 text-muted-foreground/50" />
                )}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </li>
            ))}
          </ol>

          {/* BreadcrumbList JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: normalizedBreadcrumbs.map((item, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: item.label,
                  ...(item.href
                    ? { item: `https://financechk.com${item.href}` }
                    : {}),
                })),
              }),
            }}
          />
        </nav>
      )}

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Main content + leaderboard ad */}
        <div className="max-w-(--fc-tool-width) min-w-0 flex-1">
          <DownloadGate>{children}</DownloadGate>

          {guideContent && <div className="mt-10">{guideContent}</div>}

          {/* AdSense — leaderboard (desktop) / rectangle (mobile) after tool content */}
          <div className="mt-8 flex justify-center">
            <AdUnit slot="leaderboard" className="hidden md:flex" />
            <AdUnit slot="rectangle" className="flex md:hidden" />
          </div>
        </div>

        {/* Sidebar */}
        {sidebar ? (
          <aside className="w-full shrink-0 lg:w-(--fc-sidebar-width)">
            {sidebar}
          </aside>
        ) : (
          <aside className="hidden w-(--fc-sidebar-width) shrink-0 lg:block">
            <DefaultSidebar />
          </aside>
        )}
      </div>
    </div>
  )
}

const allTools = [
  {
    label: "Home Loan Eligibility",
    href: "/tools/home-loan-eligibility-calculator",
    category: "loans",
  },
  {
    label: "Advanced EMI Calculator",
    href: "/tools/advanced-home-loan-emi-calculator",
    category: "loans",
  },
  {
    label: "Prepay vs Invest",
    href: "/tools/prepay-vs-invest",
    category: "loans",
  },
  {
    label: "Personal Loan Prepayment",
    href: "/tools/personal-loan-prepayment-calculator",
    category: "loans",
  },
  {
    label: "Loan Balance Transfer",
    href: "/tools/personal-loan-balance-transfer-calculator",
    category: "loans",
  },
  {
    label: "Home Loan Balance Transfer",
    href: "/tools/home-loan-balance-transfer-calculator",
    category: "loans",
  },
  {
    label: "Education Loan Calculator",
    href: "/tools/education-loan-calculator",
    category: "loans",
  },
  {
    label: "Car Loan EMI",
    href: "/tools/car-loan-emi-calculator",
    category: "loans",
  },
  {
    label: "SIP Calculator",
    href: "/tools/sip-calculator",
    category: "investment",
  },
  {
    label: "Step-Up SIP Calculator",
    href: "/tools/step-up-sip-calculator",
    category: "investment",
  },
  {
    label: "Lump Sum Calculator",
    href: "/tools/lumpsum-calculator",
    category: "investment",
  },
  {
    label: "FD Calculator",
    href: "/tools/fd-calculator",
    category: "investment",
  },
  {
    label: "RD Calculator",
    href: "/tools/rd-calculator",
    category: "investment",
  },
  {
    label: "NPS vs EPF vs PPF",
    href: "/tools/nps-vs-epf-vs-ppf",
    category: "investment",
  },
  {
    label: "SWP Calculator",
    href: "/tools/swp-calculator",
    category: "investment",
  },
  {
    label: "EPF / VPF Calculator",
    href: "/tools/epf-vpf-calculator",
    category: "investment",
  },
  {
    label: "ELSS Calculator",
    href: "/tools/elss-calculator",
    category: "investment",
  },
  {
    label: "Emergency Fund Calculator",
    href: "/tools/emergency-fund-calculator",
    category: "investment",
  },
  {
    label: "Sukanya Samriddhi Calculator",
    href: "/tools/sukanya-samriddhi-calculator",
    category: "investment",
  },
  {
    label: "Old vs New Tax Regime",
    href: "/tools/tax-regime-comparison",
    category: "tax",
  },
  {
    label: "Home Loan Tax Benefit",
    href: "/tools/home-loan-tax-benefit-calculator",
    category: "tax",
  },
  {
    label: "Depreciation Calculator",
    href: "/tools/depreciation-calculator",
    category: "tax",
  },
  {
    label: "LTCG & STCG Tax",
    href: "/tools/ltcg-stcg-calculator",
    category: "tax",
  },
  {
    label: "Section 87A Marginal Relief",
    href: "/tools/section-87a-marginal-relief-calculator",
    category: "tax",
  },
  {
    label: "Advance Tax Calculator",
    href: "/tools/advance-tax-calculator",
    category: "tax",
  },
  {
    label: "Tax Regime Break-Even",
    href: "/tools/new-vs-old-regime-break-even",
    category: "tax",
  },
  {
    label: "Freelancer Tax (44ADA)",
    href: "/tools/freelancer-tax-calculator",
    category: "tax",
  },
  {
    label: "Rent Receipt Generator",
    href: "/tools/rent-receipt-generator",
    category: "tax",
  },
  {
    label: "Tax Proof Pack Generator",
    href: "/tools/tax-proof-pack-generator",
    category: "tax",
  },
  {
    label: "Tax Notice Reply Generator",
    href: "/tools/income-tax-notice-reply-generator",
    category: "tax",
  },
  {
    label: "Form 16 Tax Crosscheck",
    href: "/tools/form-16-tax-crosscheck",
    category: "tax",
  },
  {
    label: "Home Loan Letter Generator",
    href: "/tools/home-loan-letter-generator",
    category: "loans",
  },
  {
    label: "STT Calculator",
    href: "/tools/stt-calculator",
    category: "trading",
  },
  {
    label: "F&O Brokerage",
    href: "/tools/fo-brokerage-calculator",
    category: "trading",
  },
  {
    label: "STT & Brokerage",
    href: "/tools/stt-brokerage-calculator",
    category: "trading",
  },
  {
    label: "MCX Position Sizer",
    href: "/tools/mcx-crude-position-sizer",
    category: "trading",
  },
  {
    label: "MCX Commodity Margin",
    href: "/tools/mcx-commodity-margin-calculator",
    category: "trading",
  },
  {
    label: "Brokerage Comparison",
    href: "/tools/brokerage-comparison-tool",
    category: "trading",
  },
]

function injectCategoryBreadcrumb(
  breadcrumbs: Array<BreadcrumbItem> | undefined,
  pathname: string
): Array<BreadcrumbItem> | undefined {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return breadcrumbs
  }

  const inferredCategory = inferCategoryFromPath(pathname)
  const currentTool = allTools.find(
    (tool) => pathname === tool.href || pathname.startsWith(`${tool.href}/`)
  )

  const category =
    inferredCategory || (currentTool?.category as ToolCategory | undefined)

  if (!category) {
    return breadcrumbs
  }

  const categoryCrumb = categoryBreadcrumbs[category]

  const alreadyHasCategory = breadcrumbs.some(
    (item) => item.href === categoryCrumb.href
  )

  if (alreadyHasCategory) {
    return breadcrumbs
  }

  if (breadcrumbs.length >= 2 && breadcrumbs[1]?.href === "/tools") {
    return [
      breadcrumbs[0],
      breadcrumbs[1],
      categoryCrumb,
      ...breadcrumbs.slice(2),
    ]
  }

  return [...breadcrumbs, categoryCrumb]
}

function DefaultSidebar() {
  const { pathname } = useLocation()

  const currentTool = allTools.find((t) => t.href === pathname)
  const currentCategory = currentTool?.category || "tax" // fallback

  let relatedTools = allTools.filter(
    (t) => t.href !== pathname && t.category === currentCategory
  )

  // Ensure we always show exactly 4 tools
  if (relatedTools.length < 4) {
    const others = allTools.filter(
      (t) => t.href !== pathname && !relatedTools.includes(t)
    )
    relatedTools = [
      ...relatedTools,
      ...others.slice(0, 4 - relatedTools.length),
    ]
  } else {
    relatedTools = relatedTools.slice(0, 4)
  }

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24">
      {/* Related tools */}
      <div className="rounded-2xl bg-secondary p-5">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Related tools
        </p>
        <div className="mt-3 flex flex-col gap-1">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="block rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              style={{ letterSpacing: "0.16px" }}
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </div>

      {/* AdSense — mid-sticky */}
      <AdUnit slot="mid-sticky" />
    </div>
  )
}
