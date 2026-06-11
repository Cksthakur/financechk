import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/stock-market-capital-gains-tax-guide-2025"
)({
  head: () =>
    generateSeoMeta({
      title:
        "Stock Market Capital Gains Tax Guide 2025: Equity vs. Debt vs. Gold",
      description:
        "A definitive guide to Income Tax on shares and assets in India. Demystifying STCG, LTCG, and dividend taxation after the recent budget changes.",
      path: "/blog/stock-market-capital-gains-tax-guide-2025",
      type: "article",
    }),
  component: StockMarketTaxArticle,
})

function StockMarketTaxArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Stock Market Taxation 2025" },
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
            Direct Stock Market Taxation in India: The 2025 STCG & LTCG Guide
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="March 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 6 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              If you buy individual shares of companies directly through a Demat
              account (like Reliance, HDFC, or TCS) and sell them for a profit,
              the Income Tax Department wants its cut. The rates underwent a
              significant shift in the latest union budget. Here is exactly how
              your direct equity investments are taxed in 2025.
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
              The Golden Rule: Holding Period
            </h2>
            <p className="mb-4">
              Just like with equity mutual funds, the tax rate for listed equity
              shares depends entirely on <em>how long</em> you held the stock
              before selling it.
            </p>
            <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-2 text-xl font-semibold text-primary">
                  STCG (Short-Term)
                </div>
                <div className="mb-4 text-sm text-muted-foreground">
                  Holding Period &lt; 12 Months
                </div>
                <div className="text-3xl font-light text-foreground">
                  20% Flat Rate
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-2 text-xl font-semibold text-primary">
                  LTCG (Long-Term)
                </div>
                <div className="mb-4 text-sm text-muted-foreground">
                  Holding Period &ge; 12 Months
                </div>
                <div className="text-3xl font-light text-foreground">
                  12.5% Rate
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  After ₹1.25 Lakh exemption
                </div>
              </div>
            </div>
            <p>
              <em>
                Note: Both these rates are strictly for shares listed on a
                recognized Indian stock exchange. Unlisted shares (e.g., startup
                equity) have completely different, much harsher tax rules.
              </em>
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
              Handling STCG (Short-Term Capital Gains)
            </h2>
            <p className="mb-4">
              If you bought shares of Reliance and sold them 6 months later at a
              profit of ₹50,000, this is classified as a short-term capital
              gain.
            </p>
            <p className="mb-4">
              The government recently hiked this rate from 15% to{" "}
              <strong>20%</strong> to discourage short-term speculation in the
              stock market. You will pay a flat 20% tax on that ₹50,000 profit
              (₹10,000), plus applicable cess.
            </p>
            <p>
              Unlike LTCG, there is absolutely{" "}
              <strong>no tax-free exemption limit</strong> for STCG. From the
              very first rupee of profit, you are taxed at 20%.
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
              Handling LTCG (Long-Term Capital Gains)
            </h2>
            <p className="mb-4">
              If you hold onto your shares for more than 1 year, the government
              rewards you with a lower rate and a fundamental exemption limit.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong>The Exemption:</strong> Your first{" "}
                <strong>₹1.25 Lakhs</strong> of LTCG every financial year is
                entirely tax-free.
              </li>
              <li>
                <strong>The Rate:</strong> Any profit above the ₹1.25 Lakh
                threshold is taxed at a flat <strong>12.5%</strong>.
              </li>
            </ul>

            <div className="my-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mt-0 mb-2 text-xl font-semibold">
                Important Caveat: Expanding the ₹1.25L Bucket
              </h3>
              <p className="m-0">
                The ₹1.25 Lakh exemption isn't a separate bucket for direct
                stocks and another separate bucket for mutual funds. The ₹1.25L
                bucket is <em>aggregate</em>. All your LTCG from direct equities
                AND equity mutual funds in a single financial year gets added
                together, and that total combined profit gets the single ₹1.25
                Lakh exemption.
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
              Intraday Trading & Futures & Options (F&O)
            </h2>
            <p className="mb-4">
              What if you buy and sell a stock on the exact same day? Or what if
              you trade Nifty Options?
            </p>
            <p className="mb-4">
              <strong>These are NOT considered Capital Gains.</strong>
            </p>
            <p className="mb-4">
              The Income Tax Department labels intraday trading and F&O trading
              as "Business Income". Your net profit (or loss) from F&O is simply
              added to your base salary and taxed at your normal slab rate. If
              you are in the 30% tax bracket, your options trading profits will
              be taxed at 30%.
            </p>
            <p>
              Because it is considered a business, you are legally allowed to
              deduct business expenses against these profits (e.g., brokerage,
              internet bills, trading terminal subscriptions, and depreciation
              on your computer).
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
              Dividend Taxation
            </h2>
            <p className="mb-4">
              Historically, dividends were tax-free in the hands of the investor
              because the company paid a Dividend Distribution Tax (DDT). This
              has changed.
            </p>
            <p className="mb-4">
              Today, any dividend you receive from your shares is added to your
              total income and <strong>taxed at your slab rate</strong>.
              Furthermore, if a company pays you a dividend exceeding ₹5,000 in
              a year, they will automatically deduct 10% TDS before transferring
              the money to your bank account.
            </p>
            <div className="mt-8 mb-8 flex justify-center">
              <Link
                to="/tools/ltcg-stcg-calculator"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
              >
                Calculate your exact CGT Liability
              </Link>
            </div>
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
              "Direct Stock Market Taxation in India: The 2025 STCG & LTCG Guide",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-03-15T08:00:00+05:30",
            description:
              "Guide to Income Tax on shares in India for 2025. STCG, LTCG, dividend taxation, and intraday.",
          }),
        }}
      />
    </ToolLayout>
  )
}
