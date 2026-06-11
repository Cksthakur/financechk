import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/old-vs-new-tax-regime-comparison-2025"
)({
  head: () =>
    generateSeoMeta({
      title: "Old vs New Tax Regime 2025: Breaking Down the Math",
      description:
        "A detailed comparison of the Old and New Tax Regimes for FY 2025-26. Find out exactly when you should switch and when the Old Regime is still better.",
      path: "/blog/old-vs-new-tax-regime-comparison-2025",
      type: "article",
    }),
  component: TaxRegimeArticle,
})

function TaxRegimeArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Old vs New Tax Regime 2025" },
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
            Old vs New Tax Regime: The Final Verdict for Salaried Employees in
            2025
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="February 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 6 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              "Which tax regime should I choose?" Every January, HR departments
              across India demand an answer to this question, sending salaried
              employees into a panic. The Union Budget heavily incentivized the
              New Tax Regime by drastically reducing tax slabs and making it the
              default option. But is it always the right choice?
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
              The Core Difference: Low Slabs vs High Deductions
            </h2>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong>The New Tax Regime</strong> offers significantly lower
                tax rates. The catch? You lose almost every single tax
                deduction. No 80C, no HRA, no LTA, no home loan interest
                deduction for self-occupied properties.
              </li>
              <li>
                <strong>The Old Tax Regime</strong> has the older, harsher tax
                brackets (where 30% tax kicks in much earlier). But it allows
                you to aggressively reduce your taxable income using Section 80C
                (EPF/ELSS), 80D (Health Insurance), Section 24b (Home Loan
                Interest), and HRA.
              </li>
            </ul>

            <div className="my-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mt-0 mb-2 text-xl font-semibold">
                What about the Standard Deduction?
              </h3>
              <p className="m-0">
                It used to be exclusive to the Old Regime, but{" "}
                <strong>
                  the Standard Deduction is now available in both regimes.
                </strong>{" "}
                For the Old Regime, it is ₹50,000. For the New Regime, it was
                recently hiked to a massive <strong>₹75,000</strong>.
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
              The ₹7.75 Lakh Rule
            </h2>
            <p className="mb-4">
              If your total salary (Gross salary - PT - EPF) is exactly
              ₹7,75,000, your decision is made for you.
            </p>
            <p className="mb-4">
              Under the New Regime, you claim the ₹75k standard deduction. Your
              taxable income becomes ₹7 Lakhs. The Section 87A rebate wipes out
              the tax entirely. You pay ₹0. You do not need to invest a single
              rupee in 80C. You don't need to submit rent receipts.{" "}
              <strong>
                If your income is below ₹7.75L, always choose the New Regime.
              </strong>
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
              When the Old Regime Wins (The Breakeven Math)
            </h2>
            <p className="mb-4">
              As your income crosses ₹10 Lakhs, ₹15 Lakhs, or ₹20 Lakhs, the
              math changes. The Old Regime becomes profitable <em>only if</em>{" "}
              you have massive deductions.
            </p>
            <p className="mb-4">
              The golden rule of thumb for FY 2025-26 is this:{" "}
              <strong>
                If your total eligible deductions exceed ₹3.75 Lakhs to ₹4.0
                Lakhs, the Old Regime usually saves you more money.
              </strong>
            </p>
            <p className="mb-4">How do you hit ₹3.75 Lakhs in deductions?</p>
            <ul className="ml-6 list-disc space-y-3">
              <li>Section 80C fully maxed out (EPF + ELSS): ₹1.5 Lakhs</li>
              <li>
                Section 80D (Health Insurance for self + parents): ₹75,000
              </li>
              <li>Home Loan Interest (Section 24b): Up to ₹2 Lakhs</li>
            </ul>
            <p className="mt-4 mb-4">
              If you don't have a home loan and don't pay high rent, hitting
              that ₹3.75L mark is nearly impossible. If you are just claiming
              80C (₹1.5L) and basic health insurance (₹25k), the New Regime is
              mathematically guaranteed to be better for you.
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
              Stop Guessing, Start Calculating
            </h2>
            <p className="mb-4">
              Rules of thumb are great, but tax mistakes cost actual money. It
              takes 2 minutes to run your exact salary breakdown through our
              algorithm.
            </p>
            <div className="my-8 flex justify-center">
              <Link
                to="/tools/tax-regime-comparison"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
              >
                Run the Tax Regime Comparison
              </Link>
            </div>
            <p className="mb-4">
              Simply enter your gross salary, your 80C investments, HRA, and
              home loan interest. The calculator will show you a side-by-side
              comparison of your exact tax liability under both regimes, telling
              you definitively which one to declare to your HR.
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
              "Old vs New Tax Regime: The Final Verdict for Salaried Employees in 2025",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-02-10T08:00:00+05:30",
            description:
              "A detailed comparison of the Old and New Tax Regimes for FY 2025-26.",
          }),
        }}
      />
    </ToolLayout>
  )
}
