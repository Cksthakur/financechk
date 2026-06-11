import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/blog/mutual-fund-ltcg-tax-rules-2025")({
  head: () =>
    generateSeoMeta({
      title: "Mutual Fund Tax Rules 2025: Equity, Debt & LTCG Rates",
      description:
        "Post-Budget 2024 taxation guide for mutual funds in India. Understand the new 12.5% LTCG rate, the ₹1.25 Lakh exemption, and Debt fund rules.",
      path: "/blog/mutual-fund-ltcg-tax-rules-2025",
      type: "article",
    }),
  component: MFTaxArticle,
})

function MFTaxArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Mutual Fund Tax Rules 2025" },
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
            Indian Mutual Fund Taxation 2025: The Ultimate Guide to LTCG & STCG
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="January 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 6 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              If you've been investing in mutual funds, you know the Union
              Budget 2024 shook up the entire taxation landscape. Long-Term
              Capital Gains (LTCG) saw a rate hike, the tax-free limit was
              expanded, and Debt funds lost their famous indexation benefits.
              Here is exactly how your mutual fund returns will be taxed in
              2025.
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
              The Great Divide: Equity vs. Debt vs. Hybrid
            </h2>
            <p className="mb-4">
              The Income Tax Department doesn't care about the fancy name of
              your mutual fund. They care about one thing:{" "}
              <strong>
                What percentage of the fund's money is invested in Indian
                equities (shares)?
              </strong>
            </p>

            <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-secondary/50 text-xs tracking-wider text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Fund Category</th>
                    <th className="px-6 py-4 font-medium">Equity Exposure</th>
                    <th className="px-6 py-4 font-medium">Examples</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border">
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">Equity Funds</td>
                    <td className="px-6 py-4">&gt; 65%</td>
                    <td className="px-6 py-4">
                      Nifty 50 Index, Flexi Cap, Small Cap, ELSS
                    </td>
                  </tr>
                  <tr className="bg-secondary/10 transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">
                      Specified Debt Funds
                    </td>
                    <td className="px-6 py-4">&le; 35%</td>
                    <td className="px-6 py-4">
                      Liquid Funds, Gilt Funds, Corporate Bond Funds
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">Hybrid / Others</td>
                    <td className="px-6 py-4">35% to 65%</td>
                    <td className="px-6 py-4">
                      Conservative Hybrid, Gold ETFs, FoFs
                    </td>
                  </tr>
                </tbody>
              </table>
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
              1. Taxation on Equity Mutual Funds
            </h2>
            <p className="mb-4">
              An equity mutual fund holds more than 65% of its portfolio in
              domestic stocks. This includes all your standard ELSS, Index, and
              Flexi-cap funds.
            </p>

            <h3 className="mt-8 mb-3 text-2xl font-semibold text-foreground">
              Short-Term Capital Gains (STCG)
            </h3>
            <p className="mb-4">
              If you sell your units <em>before</em> completing 12 months, your
              profit is considered Short-Term.
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-3">
              <li>
                <strong>New Rate (Post-July 2024):</strong> 20% on the entire
                profit.
              </li>
              <li>
                <strong>Old Rate:</strong> It used to be 15%. This was a
                significant hike aimed at curbing short-term speculation.
              </li>
            </ul>

            <h3 className="mt-8 mb-3 text-2xl font-semibold text-foreground">
              Long-Term Capital Gains (LTCG)
            </h3>
            <p className="mb-4">
              If you sell your units <em>after</em> holding them for more than
              12 months, the profit is Long-Term.
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-3">
              <li>
                <strong>The Exemption:</strong> The first{" "}
                <strong>₹1.25 Lakhs</strong> of your LTCG profit in a single
                financial year is completely tax-free. (This was increased from
                ₹1 Lakh in Budget 2024).
              </li>
              <li>
                <strong>The Tax Rate:</strong> Any profit above ₹1.25 Lakhs is
                taxed at a flat <strong>12.5%</strong>. (This was increased from
                the older 10% rate).
              </li>
            </ul>

            <div className="my-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h4 className="mt-0 mb-2 text-xl font-semibold text-primary">
                Example Calculation
              </h4>
              <p className="m-0">
                You invested ₹5 Lakhs 3 years ago. You sell it today for ₹8
                Lakhs.
                <br />
                <br />
                Total Profit = ₹3 Lakhs.
                <br />
                Since holding period is &gt; 1 year, it is LTCG.
                <br />
                Tax-Free Limit = ₹1.25 Lakhs.
                <br />
                Taxable Profit = ₹3,00,000 - ₹1,25,000 = ₹1,75,000.
                <br />
                <strong>Tax to Pay = 12.5% of ₹1,75,000 = ₹21,875.</strong>
              </p>
            </div>
            <p>
              Want to calculate your exact tax liability? Use our{" "}
              <Link
                to="/tools/ltcg-stcg-calculator"
                className="font-semibold text-primary hover:underline"
              >
                LTCG/STCG Calculator
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
              2. Taxation on Debt Mutual Funds
            </h2>
            <p className="mb-4">
              Debt funds took a massive hit in recent years. If a fund has equal
              to or less than 35% equity exposure, it falls here.
            </p>
            <p className="mb-4">
              <strong>The Rule:</strong> There is no concept of STCG or LTCG for
              debt funds bought after April 1, 2023.{" "}
              <strong>
                Any profit you make is simply added to your total income and
                taxed at your applicable income tax slab rate.
              </strong>
            </p>
            <p>
              If you are in the 30% tax bracket, you will pay 30% tax on your
              debt fund returns, whether you hold them for 1 month or 10 years.
              Indexation benefits have been permanently removed for new debt
              fund purchases.
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
              3. The "Tax Harvesting" Strategy
            </h2>
            <p className="mb-4">
              Since you get a ₹1.25 Lakh tax-free limit every financial year,
              smart investors use a strategy called "Tax Harvesting" to legally
              avoid paying taxes.
            </p>
            <p className="mb-4">
              Instead of waiting 10 years to sell and accumulating a massive ₹20
              Lakh profit (which will trigger a heavy 12.5% tax), you sell
              portions of your portfolio every year so that your booked profit
              is exactly ₹1.24 Lakhs. You immediately buy back the same mutual
              funds.
            </p>
            <p>
              This "resets" your purchase price higher. By booking ₹1.24L of
              tax-free profit every year for 10 years, you effectively save
              12.5% tax on ₹12.4 Lakhs of wealth creation. Just remember to
              ensure the units you sell have completed the 1-year holding
              period!
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
              "Indian Mutual Fund Taxation 2025: The Ultimate Guide to LTCG & STCG",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-01-25T08:00:00+05:30",
            description:
              "A complete guide to how mutual funds are taxed in India for 2025.",
          }),
        }}
      />
    </ToolLayout>
  )
}
