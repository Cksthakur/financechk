import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/section-80c-24b-home-loan-tax-benefits"
)({
  head: () =>
    generateSeoMeta({
      title: "Home Loan Tax Benefits: Section 80C & 24b Guide",
      description:
        "Learn how to save lakhs in income tax using a home loan. A complete breakdown of Section 80C (principal) and Section 24b (interest) deductions for 2025.",
      path: "/blog/section-80c-24b-home-loan-tax-benefits",
      type: "article",
    }),
  component: HomeLoanTaxArticle,
})

function HomeLoanTaxArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Home Loan Tax Benefits" },
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
            The Ultimate Guide to Home Loan Tax Benefits: Section 80C, 24(b) &
            More
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="January 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 7 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4 text-lg">
              A home loan isn't just a 20-year liability; it is hands down the
              single largest tax-saving instrument available to a salaried
              Indian employee. If structured correctly, the EMI you pay out can
              save you lakhs in income tax over the life of the loan. But
              between Section 80C, Section 24(b), and the endless confusion
              between the Old and New Tax Regimes, most people leave money on
              the table.
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
              The Two Components of Your EMI
            </h2>
            <p className="mb-4">
              Every single month when your EMI is deducted, the money is split
              into two buckets:
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-3">
              <li>
                <strong>Principal Repayment:</strong> The actual original loan
                amount you are returning.
              </li>
              <li>
                <strong>Interest Payment:</strong> The fee the bank charges you
                for borrowing their money.
              </li>
            </ul>
            <p>
              The Income Tax Department of India treats these two buckets
              completely differently.
            </p>

            <div className="my-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mt-0 mb-2 text-xl font-semibold">
                Crucial Context: The Regime Check
              </h3>
              <p className="mb-3">
                Before we proceed:{" "}
                <strong>
                  All the deductions mentioned below (80C, 24b) are ONLY
                  applicable if you choose the Old Tax Regime.
                </strong>{" "}
                Under the New Tax Regime, home loan deductions are strictly
                disallowed for self-occupied properties.
              </p>
              <p>
                Not sure which to pick? Use our{" "}
                <Link
                  to="/tools/tax-regime-comparison"
                  className="font-semibold text-primary hover:underline"
                >
                  Old vs New Tax Regime Calculator
                </Link>{" "}
                to find your break-even point.
              </p>
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
              1. Section 80C: The Principal Repayment
            </h2>
            <p className="mb-4">
              The principal portion of your EMI qualifies for deduction under
              the famous Section 80C.
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-3">
              <li>
                <strong>Maximum Limit:</strong> ₹1,50,000 per financial year.
              </li>
              <li>
                <strong>The Catch:</strong> This ₹1.5L limit is an umbrella.
                Your PF contributions (EPF/PPF), ELSS mutual funds, LIC
                premiums, and children's tuition fees all share this exact same
                ₹1.5L bucket.
              </li>
              <li>
                <strong>Lock-in condition:</strong> You cannot sell the property
                for 5 years from the date of possession. If you do, all the tax
                benefits you claimed under 80C in the past will be reversed and
                added to your taxable income in the year of sale.
              </li>
            </ul>
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
              2. Section 24(b): The Interest Component
            </h2>
            <p className="mb-4">
              This is where the massive savings lie. The interest you pay on
              your home loan can be straight-up deducted from your total taxable
              income.
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-3">
              <li>
                <strong>For Self-Occupied Property:</strong> You can claim a
                maximum deduction of <strong>₹2 Lakhs per year</strong>.
              </li>
              <li>
                <strong>For Let-Out (Rented) Property:</strong> You can claim
                the <em>entire</em> interest paid, with no upper limit! However,
                you must declare the rental income. Also, the maximum total loss
                from house property you can set off against your salary is still
                capped at ₹2 Lakhs per year. Any unadjusted loss can be carried
                forward for 8 years.
              </li>
            </ul>
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
              3. The Hidden Gem: Stamp Duty and Registration
            </h2>
            <p className="mb-4">
              Most homebuyers forget this: The amount you paid the state
              government for stamp duty and registration fees is also
              tax-deductible!
            </p>
            <p>
              It falls under the Section 80C umbrella (₹1.5L limit), but you can
              only claim it in the specific financial year that you actually
              made the payment. You cannot carry it forward to the next year.
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
              The Ultimate Hack: Joint Home Loans
            </h2>
            <p className="mb-4">
              If a ₹50 Lakh loan generates ₹4 Lakhs of interest in Year 1, a
              single borrower can only claim the maximum limit of ₹2 Lakhs under
              Section 24(b). The remaining ₹2 Lakhs goes to waste.
            </p>
            <p className="mb-4">
              <strong>The Solution:</strong> Take the loan jointly with your
              spouse (both must be co-owners of the property).
            </p>
            <p>
              By doing this, the limits <em>double</em>. Your spouse can claim a
              separate ₹2 Lakhs under 24(b) and a separate ₹1.5 Lakhs under 80C.
              Together, a married couple can claim up to{" "}
              <strong>₹7 Lakhs</strong> in total home loan tax deductions every
              single year!
            </p>
          </section>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "The Ultimate Guide to Home Loan Tax Benefits: Section 80C, 24(b) & More",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-01-20T08:00:00+05:30",
            description:
              "Learn how to save lakhs in income tax using a home loan.",
          }),
        }}
      />
    </ToolLayout>
  )
}
