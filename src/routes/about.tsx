import { Link, createFileRoute } from "@tanstack/react-router"
import { IconChevronRight } from "@tabler/icons-react"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/about")({
  head: () =>
    generateSeoMeta({
      title: "About FinanceChk — Why We Build Free Financial Tools",
      description:
        "Learn about the mission behind FinanceChk. We build verifiable, accurate financial calculators for India using real RBI and Income Tax Act formulas.",
      path: "/about",
    }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="mx-auto max-w-(--fc-page-width) px-5 py-8 md:px-8 md:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol
          className="flex items-center gap-1 text-[15px] text-muted-foreground"
          style={{ letterSpacing: "0.15px" }}
        >
          <li>
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <IconChevronRight className="size-3 text-muted-foreground/50" />
            <span className="text-foreground">About</span>
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-(--fc-content-width)">
        {/* Header */}
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
          About FinanceChk
        </h1>

        <div
          className="mt-8 flex flex-col gap-6"
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            letterSpacing: "0.18px",
            color: "var(--muted-foreground)",
          }}
        >
          <p>
            FinanceChk started as a frustration. Every time I needed to
            calculate my home loan eligibility or compare tax regimes, I'd land
            on sites with wrong formulas, outdated tax slabs, or calculators
            hidden behind signup walls. The numbers never matched what my CA
            gave me.
          </p>
          <p>
            So I built this. Every calculator on FinanceChk uses the same
            formulas that banks and the Income Tax Department use. The home loan
            eligibility calculator uses the actual FOIR method that SBI, HDFC,
            and ICICI apply internally. The tax comparison tool uses FY 2026-27
            slabs exactly as published in the Finance Act. No approximations, no
            rounding tricks.
          </p>
        </div>

        {/* What makes this different */}
        <h2
          className="mt-16 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "36px",
            letterSpacing: "normal",
            lineHeight: 1.17,
          }}
        >
          What makes this different
        </h2>
        <div
          className="mt-8 flex flex-col gap-6"
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            letterSpacing: "0.18px",
            color: "var(--muted-foreground)",
          }}
        >
          <p>
            <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
              Verifiable formulas.
            </strong>{" "}
            Every calculation page shows the exact formula used, with a worked
            example. You can verify the output with a spreadsheet or your CA. If
            a number is wrong, the formula is right there for you to check. I
            cite RBI circulars and Income Tax Act sections where applicable.
          </p>
          <p>
            <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
              Indian number formatting.
            </strong>{" "}
            ₹1,00,000 not ₹100,000. Lakhs and crores, not millions. This seems
            small but every competitor gets it wrong. When you're looking at a
            ₹42 lakh home loan figure, you need to read it instantly without
            mental conversion.
          </p>
          <p>
            <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
              No signup, no paywall.
            </strong>{" "}
            The tools load instantly. No email gate, no "unlock premium
            features" upsell. Revenue comes from non-intrusive AdSense
            placements that don't interfere with the calculator experience.
          </p>
          <p>
            <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
              Updated regularly.
            </strong>{" "}
            Tax pages are updated every budget. Brokerage charges are verified
            quarterly. Interest rates are checked against RBI policy
            announcements. Every page shows its last-updated date because stale
            financial information is worse than no information.
          </p>
        </div>

        {/* About the author */}
        <h2
          className="mt-16 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "36px",
            letterSpacing: "normal",
            lineHeight: 1.17,
          }}
        >
          About the author
        </h2>
        <div
          className="mt-8 flex flex-col gap-6"
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            letterSpacing: "0.18px",
            color: "var(--muted-foreground)",
          }}
        >
          <p>
            I'm Rajat, a software developer and active trader on NSE and MCX.
            I've been trading crude oil futures and equity F&O since 2019, which
            means I've personally used (and been frustrated by) every brokerage
            calculator, margin calculator, and tax tool on the Indian internet.
          </p>
          <p>
            The MCX crude oil content on this site comes from actual trading
            experience — lot sizes, margin requirements, and timing patterns
            I've learned through years of intraday trading. This isn't
            information scraped from broker websites. It's practical knowledge
            that costs real money to acquire.
          </p>
        </div>

        {/* Data sources */}
        <h2
          className="mt-16 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "36px",
            letterSpacing: "normal",
            lineHeight: 1.17,
          }}
        >
          Data sources
        </h2>
        <div className="mt-8">
          <ul
            className="flex flex-col gap-4"
            style={{
              fontSize: "16px",
              lineHeight: 1.5,
              letterSpacing: "0.16px",
              color: "var(--muted-foreground)",
            }}
          >
            <li className="flex gap-3">
              <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-foreground" />
              <span>
                <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  Tax slabs and rules:
                </strong>{" "}
                Income Tax Act, Finance Act 2024, CBDT circulars
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-foreground" />
              <span>
                <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  Home loan formulas:
                </strong>{" "}
                RBI master circulars on housing finance, individual bank
                disclosure documents
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-foreground" />
              <span>
                <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  Brokerage charges:
                </strong>{" "}
                Official fee schedules from Zerodha, Angel One, and Upstox
                (verified quarterly)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-foreground" />
              <span>
                <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  Market data:
                </strong>{" "}
                NSE and MCX official circulars for margin requirements and lot
                sizes
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-foreground" />
              <span>
                <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  Mutual fund regulations:
                </strong>{" "}
                SEBI and AMFI guidelines for SIP, LTCG, and fund categorization
              </span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-16 rounded-2xl p-6"
          style={{
            background: "var(--fc-warm-stone)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
              letterSpacing: "0.14px",
              color: "var(--muted-foreground)",
            }}
          >
            <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
              Disclaimer:
            </strong>{" "}
            FinanceChk provides calculators and educational content for
            informational purposes only. This is not financial, tax, or
            investment advice. Always consult a SEBI-registered investment
            advisor or chartered accountant before making financial decisions.
            Calculations are estimates and actual bank offers, tax liability, or
            investment returns may differ based on individual circumstances.
          </p>
        </div>
      </div>

      {/* Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FinanceChk",
            url: "https://financechk.com",
            description: "Free, accurate financial calculators for India",
            founder: {
              "@type": "Person",
              name: "Rajat",
              jobTitle: "Software Developer & Trader",
            },
          }),
        }}
      />
    </div>
  )
}
