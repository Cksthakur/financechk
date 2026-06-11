import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/home-loan-eligibility-all-banks-2025"
)({
  head: () =>
    generateSeoMeta({
      title: "Home Loan Eligibility 2025: SBI, HDFC & ICICI Comparison",
      description:
        "Find out exactly how much home loan you can get based on your salary. Includes FOIR comparison, bank rules, and the 2025 eligibility tables.",
      path: "/blog/home-loan-eligibility-all-banks-2025",
      type: "article",
    }),
  component: HomeLoanEligibilityArticle,
})

function HomeLoanEligibilityArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Home Loan Eligibility 2025" },
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
            Home Loan Eligibility by Salary in 2025: SBI, HDFC & ICICI
            Comparison
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="January 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 8 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              "I make ₹60,000 a month. How much home loan will the bank actually
              give me?" It's the first question every prospective homebuyer
              asks. But if you try finding a straight answer online, you usually
              hit marketing jargon or lead-capture forms. Today, we'll break
              down the exact math Indian banks use to approve or reject your
              loan application in 2025.
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
              The Golden Rule: FOIR (Fixed Obligation to Income Ratio)
            </h2>
            <p className="mb-4">
              Banks don't just look at your gross salary; they care about how
              much of your <em>in-hand</em> salary you can safely part with
              every month. This is calculated using FOIR.
            </p>

            <div className="my-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mt-0 mb-2 text-xl font-semibold">
                Standard FOIR Limits in India
              </h3>
              <ul className="m-0 ml-6 list-disc space-y-2">
                <li>
                  <strong>Government Employees:</strong> Up to 60-65%
                  (considered highest job security)
                </li>
                <li>
                  <strong>Private Sector Salaried:</strong> Up to 50-60%
                  (depends on the company tier)
                </li>
                <li>
                  <strong>Self-Employed:</strong> Up to 50% (profits are
                  variable, banks take a conservative view)
                </li>
              </ul>
            </div>

            <p className="mb-4">
              If your take-home salary is ₹1 Lakh, and you work for a top-tier
              IT firm (say, TCS or Infosys), HDFC Bank might assign you a FOIR
              of 60%. This means they believe you can afford to pay ₹60,000
              every month toward EMIs.
            </p>
            <p>
              <strong>Crucial caveat:</strong> That ₹60,000 limit includes{" "}
              <em>all</em> your EMIs. If you're already paying ₹15,000 for a car
              loan, your remaining limit for the home loan EMI is only ₹45,000.
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
              2025 Salary to Loan Eligibility Table
            </h2>
            <p className="mb-4">
              Assuming you have zero existing loans, a tenure of 20 years, an
              interest rate of 8.5%, and you are a private salaried employee
              (FOIR 55%):
            </p>

            <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-secondary/50 text-xs tracking-wider text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">
                      Net Monthly Salary
                    </th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">
                      Max EMI Capacity (FOIR 55%)
                    </th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap text-foreground">
                      Approx. Max Loan Available
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border">
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">₹ 30,000</td>
                    <td className="px-6 py-4">₹ 16,500</td>
                    <td className="px-6 py-4 font-medium">₹ 19.0 Lakhs</td>
                  </tr>
                  <tr className="bg-secondary/10 transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">₹ 50,000</td>
                    <td className="px-6 py-4">₹ 27,500</td>
                    <td className="px-6 py-4 font-medium">₹ 31.6 Lakhs</td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">₹ 75,000</td>
                    <td className="px-6 py-4">₹ 41,250</td>
                    <td className="px-6 py-4 font-medium">₹ 47.5 Lakhs</td>
                  </tr>
                  <tr className="bg-secondary/10 transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">₹ 1,00,000</td>
                    <td className="px-6 py-4">₹ 55,000</td>
                    <td className="px-6 py-4 font-medium">₹ 63.3 Lakhs</td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">₹ 1,50,000</td>
                    <td className="px-6 py-4">₹ 82,500</td>
                    <td className="px-6 py-4 font-medium">₹ 95.0 Lakhs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Want exact numbers for your specific situation? Use our{" "}
              <Link
                to="/tools/home-loan-eligibility-calculator"
                className="font-semibold text-primary hover:underline"
              >
                Home Loan Eligibility Calculator
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
              How the Big 3 Banks Compare
            </h2>

            <h3 className="mt-8 mb-3 text-2xl font-semibold text-foreground">
              1. State Bank of India (SBI)
            </h3>
            <p className="mb-4">
              SBI generally offers the lowest interest rates in the market,
              often running festive campaigns strictly tied to your CIBIL score.
              If your score is 750+, SBI is unbeatable. They are also lenient
              with government employees. The major downside? Their processing is
              notoriously slow, and their legal verification is extremely strict
              (which is actually good for you as a buyer).
            </p>

            <h3 className="mt-8 mb-3 text-2xl font-semibold text-foreground">
              2. HDFC Bank
            </h3>
            <p className="mb-4">
              HDFC dominates the private sector. They are highly aggressive with
              salaried individuals working in top "Category A" companies. If
              you're a software engineer at a FAANG company, HDFC might stretch
              your FOIR to 65% just to win your business. They also process
              files much faster than PSUs.
            </p>

            <h3 className="mt-8 mb-3 text-2xl font-semibold text-foreground">
              3. ICICI Bank
            </h3>
            <p>
              ICICI is excellent for self-employed professionals (doctors, CAs)
              and businessmen. While PSUs often reject files missing 3 years of
              perfect ITRs, ICICI has slightly more flexible "income surrogate"
              programs, though they might charge a 0.15% to 0.25% premium on the
              rate for the added risk.
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
              4 Tips to Maximize Your Eligibility
            </h2>
            <ol className="ml-6 list-decimal space-y-3">
              <li>
                <strong>Add a Co-Applicant:</strong> The easiest way to double
                your eligibility. If your spouse earns ₹60k and you earn ₹60k,
                the bank evaluates you jointly at ₹1.2L. Your combined FOIR
                applies.
              </li>
              <li>
                <strong>Clear Consumer Loans First:</strong> That ₹5,000 EMI for
                an iPhone might not seem like much, but it reduces your home
                loan capacity by roughly ₹5.7 Lakhs! Always close small personal
                loans before applying.
              </li>
              <li>
                <strong>Increase the Tenure:</strong> Taking a 30-year loan
                instead of a 20-year loan reduces the monthly EMI per lakh. This
                suddenly makes you capable of taking a larger principal amount.{" "}
                <em>
                  (Use our{" "}
                  <Link
                    to="/tools/advanced-home-loan-emi-calculator"
                    className="font-semibold text-primary hover:underline"
                  >
                    Advanced EMI Calculator
                  </Link>{" "}
                  to see the massive total interest impact before doing this).
                </em>
              </li>
              <li>
                <strong>Declare Additional Income:</strong> Don't just show your
                base salary. If you have rental income, dividend income, or a
                consistent side hustle (with ITR proof), banks will add a
                percentage of it to your FOIR calculation.
              </li>
            </ol>
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
              "Home Loan Eligibility by Salary in 2025: SBI, HDFC & ICICI Comparison",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-01-15T08:00:00+05:30",
            description:
              "Find out exactly how much home loan you can get based on your salary in 2025.",
          }),
        }}
      />
    </ToolLayout>
  )
}
