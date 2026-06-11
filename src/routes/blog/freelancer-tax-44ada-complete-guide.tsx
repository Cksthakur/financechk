import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/freelancer-tax-44ada-complete-guide"
)({
  head: () =>
    generateSeoMeta({
      title: "Freelancer Tax Guide 2025: Section 44ADA Explained",
      description:
        "The definitive guide to Section 44ADA presumptive taxation for Indian freelancers and consultants. Save lakhs on income tax legally.",
      path: "/blog/freelancer-tax-44ada-complete-guide",
      type: "article",
    }),
  component: FreelanceTaxArticle,
})

function FreelanceTaxArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Freelancer Tax Guide (44ADA)" },
      ]}
    >
      <article className="mb-16">
        <header className="mb-10">
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
            The Ultimate Freelancer Tax Guide: How to Pay Zero Tax on ₹14 Lakh
            Income
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="March 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 8 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              If you are a freelance software developer, UI/UX designer,
              consultant, or doctor in India, you have access to what is
              arguably the most powerful tax-saving loophole written into the
              Income Tax Act: <strong>Section 44ADA</strong>.
            </p>
            <p className="mb-4">
              While salaried employees are taxed on their entire gross income,
              independent professionals can legally declare only half their
              income as taxable profit, wiping out their tax liability entirely
              in many cases. Let's break down exactly how it works for FY
              2025-26.
            </p>
          </section>

          <section>
            <h2
              className="mb-6 text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "36px",
                letterSpacing: "normal",
                lineHeight: 1.17,
              }}
            >
              What is Section 44ADA?
            </h2>
            <p className="mb-4">
              Section 44ADA is a "Presumptive Taxation Scheme" introduced by the
              government to reduce the compliance burden on small professionals.
              Instead of maintaining exhaustive books of accounts, tracking
              every laptop purchase, internet bill, or co-working space rent,
              the government allows you to <em>presume</em> that your profit
              margins are exactly 50%.
            </p>

            <div className="my-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mt-0 mb-2 text-xl font-semibold">
                Eligibility & Limits
              </h3>
              <ul className="m-0 ml-6 list-disc space-y-2">
                <li>
                  <strong>Professionals Only:</strong> Tech consultants,
                  doctors, lawyers, architects, and CAs. (Retail businesses fall
                  under 44AD, not 44ADA).
                </li>
                <li>
                  <strong>The ₹75 Lakh Threshold:</strong> Your total gross
                  receipts (revenue) for the financial year must not exceed ₹75
                  Lakhs.
                </li>
                <li>
                  <strong>The Digital Condition:</strong> To use the ₹75L limit,
                  your cash receipts must be strictly less than 5% of your total
                  revenue. If you deal heavily in cash, your limit drops back
                  down to the old ₹50 Lakh threshold.
                </li>
              </ul>
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
                lineHeight: 1.17,
              }}
            >
              The ₹14 Lakh Zero-Tax Miracle
            </h2>
            <p className="mb-4">
              The true super-power of 44ADA unlocks when you combine it with the
              New Tax Regime slabs and the standard deduction. Let's walk
              through the math.
            </p>

            <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-secondary/50 text-xs tracking-wider text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Calculation Step</th>
                    <th className="px-6 py-4 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border">
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">
                      Total Web Development Income (Gross)
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ₹ 14,00,000
                    </td>
                  </tr>
                  <tr className="bg-secondary/10 transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">
                      Presumptive Profit (50% under Sec 44ADA)
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ₹ 7,00,000
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4 text-muted-foreground">
                      Standard Deduction (Now allowed in New Regime)
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      - ₹ 75,000
                    </td>
                  </tr>
                  <tr className="bg-secondary/10 transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4 font-bold text-foreground">
                      Net Taxable Income
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      ₹ 6,25,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-4">
              Because the Net Taxable Income is strictly below the ₹7,00,000
              threshold of the New Tax Regime, the Section 87A rebate wipes the
              entire tax bill clean.{" "}
              <strong>
                You pay absolutely zero income tax on 14 Lakhs of income.
              </strong>
            </p>
            <p>
              Run your exact numbers using our{" "}
              <Link
                to="/tools/freelancer-tax-calculator"
                className="font-semibold text-primary hover:underline"
              >
                Freelancer Tax Calculator
              </Link>
              .
            </p>
          </section>

          <section>
            <h2
              className="mb-6 text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "36px",
                letterSpacing: "normal",
                lineHeight: 1.17,
              }}
            >
              Can I declare more than 50% profit?
            </h2>
            <p className="mb-4">
              Yes! 50% is the <em>minimum</em> you are legally required to
              declare. If your actual profit is higher (for example, if you
              earned 10L but your only expense was a 5K domain name, your actual
              profit is 99.5%), you must technically declare the real profit.
            </p>
            <p className="mb-4">
              However, practically speaking, the IT portal allows you to declare
              exactly 50%. The catch is, if an assessing officer asks you for a
              rough explanation, you should be able to loosely justify that 50%
              of your revenue went towards rent, depreciation, software
              licenses, travel, and electricity.
            </p>
          </section>

          <section>
            <h2
              className="mb-6 text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "36px",
                letterSpacing: "normal",
                lineHeight: 1.17,
              }}
            >
              What if my income is above ₹75 Lakhs?
            </h2>
            <p className="mb-4">
              If your gross receipts cross ₹75,00,000 by even a single rupee,
              Section 44ADA becomes invalid for you for that year.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>You must maintain full books of accounts.</li>
              <li>
                You must get your accounts audited by a Chartered Accountant
                under Section 44AB (Tax Audit).
              </li>
              <li>
                You can no longer arbitrarily claim 50% expenses. You must
                present actual invoices for every business expense you want to
                deduct.
              </li>
            </ul>
          </section>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "The Ultimate Freelancer Tax Guide: Section 44ADA",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-03-01T08:00:00+05:30",
            description:
              "Guide to Section 44ADA presumptive taxation for freelancers.",
          }),
        }}
      />
    </ToolLayout>
  )
}
