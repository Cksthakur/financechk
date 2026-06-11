import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/zerodha-vs-groww-vs-angel-one-brokerage-2025"
)({
  head: () =>
    generateSeoMeta({
      title: "Zerodha vs Groww vs Angel One: 2025 Comparison",
      description:
        "A deep dive comparing hidden charges, AMC fees, and STT costs between Zerodha, Groww, and Angel One. Stop paying hidden broker fees.",
      path: "/blog/zerodha-vs-groww-vs-angel-one-brokerage-2025",
      type: "article",
    }),
  component: BrokerageComparisonArticle,
})

function BrokerageComparisonArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Brokerage Comparison 2025" },
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
            Zerodha vs Groww vs Angel One: Unmasking the Hidden Charges in 2025
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="March 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 7 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              When discount brokers like Zerodha disrupted the Indian stock
              market a decade ago, they brought a revolution: "Zero Brokerage on
              Equity Delivery". Groww followed, and legacy players like Angel
              One adapted.
            </p>
            <p className="mb-4">
              Today, marketing campaigns make them all seem identical. But look
              under the hood (at the statutory charges, AMC, DP charges, and API
              costs), and massive differences emerge. If you trade F&O, do
              intraday equity, or just buy and hold long term, your choice of
              broker can drastically impact your bottom line.
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
              Zerodha: The Market Standard
            </h2>
            <p className="mb-4">
              Zerodha is the largest and most profitable discount broker in
              India. They don't spend money on marketing; they spend it on their
              infrastructure (Kite).
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong>Account Opening:</strong> ₹200 (One of the few remaining
                brokers who still charge this).
              </li>
              <li>
                <strong>AMC (Annual Maintenance Charge):</strong> ₹300 per year
                (charged quarterly as ₹75). Note: If your holding is below
                ₹50,000, AMC is zero (as per BSDA circular).
              </li>
              <li>
                <strong>Equity Delivery:</strong> ₹0
              </li>
              <li>
                <strong>Intraday & F&O:</strong> Flat ₹20 or 0.03% (whichever is
                lower) per executed order.
              </li>
              <li>
                <strong>DP Charges:</strong> ₹13.5 + 18% GST (deducted when you{" "}
                <em>sell</em> shares from your Demat holding).
              </li>
            </ul>
            <p className="mt-4">
              <strong>Best For:</strong> Serious traders and investors who want
              a clean, reliable, and advanced UI (Kite) without unnecessary
              stock recommendations or gamification.
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
              Groww: The New Retail King
            </h2>
            <p className="mb-4">
              Groww aggressively captured the new-age retail market by offering
              an extremely simple UI and aggressively removing onboarding
              friction.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong>Account Opening:</strong> ₹0
              </li>
              <li>
                <strong>AMC (Annual Maintenance Charge):</strong> ₹0 (Yes, zero
                forever).
              </li>
              <li>
                <strong>Equity Delivery:</strong> ₹20 or 0.05% (whichever is
                lower). Wait, what? <strong>Groww charges for delivery.</strong>{" "}
                Unlike Zerodha, buying equity for the long term on Groww is{" "}
                <em>not</em> free.
              </li>
              <li>
                <strong>Intraday & F&O:</strong> Flat ₹20 or 0.05% per executed
                order.
              </li>
              <li>
                <strong>DP Charges:</strong> ₹13.5 + 18% GST.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Best For:</strong> Absolute beginners and pure mutual fund
              investors. However, if you regularly buy delivery stocks, Groww is
              actually more expensive than Zerodha because they charge a
              delivery brokerage.
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
              Angel One: The Hybrid Legacy Player
            </h2>
            <p className="mb-4">
              Angel One successfully pivoted from a traditional full-service
              broker into a discount broker to survive the Zerodha wave.
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong>Account Opening:</strong> ₹0
              </li>
              <li>
                <strong>AMC (Annual Maintenance Charge):</strong> First year is
                free, then ₹240 per year (charged as ₹20 per month).
              </li>
              <li>
                <strong>Equity Delivery:</strong> ₹0
              </li>
              <li>
                <strong>Intraday & F&O:</strong> Flat ₹20 or 0.03% (whichever is
                lower) per executed order.
              </li>
              <li>
                <strong>DP Charges:</strong> ₹20 + 18% GST. (Notice this is
                significantly higher than Zerodha and Groww).
              </li>
            </ul>
            <p className="mt-4">
              <strong>Best For:</strong> Traders who want the lowest possible
              API costs (Angel's SmartAPI is free, whereas Zerodha charges
              ₹2000/month) and those who desire margin funding facilities (MTF).
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
              The Hidden Costs: STT, Stamp Duty & Exchange Charges
            </h2>
            <p className="mb-4">
              New traders often focus purely on the "₹20 brokerage" and get
              shocked when their contract note shows massive deductions. The
              truth is, on a large trade,{" "}
              <strong>brokerage is the smallest component of your cost</strong>.
            </p>
            <p className="mb-4">
              Securities Transaction Tax (STT) and Exchange Transaction Charges
              make up the bulk of your fees. STT is a direct government tax, and
              every broker charges the exact same amount. For example, in the
              2024 budget, STT on Options was hiked to 0.1%. If you trade large
              lot sizes, your STT will run into thousands of rupees, regardless
              of whether you use Zerodha or Groww.
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
              Calculate the Real Numbers
            </h2>
            <p className="mb-4">
              Don't guess your costs. Before executing a massive positional
              trade, use our detailed brokerage comparison tool to see an exact
              breakdown of Brokerage, STT, Exchange charges, GST, and Stamp
              Duty.
            </p>
            <div className="my-8 flex justify-center">
              <Link
                to="/tools/brokerage-comparison-tool"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
              >
                Compare Exact Brokerage Costs
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
              "Zerodha vs Groww vs Angel One: Unmasking the Hidden Charges in 2025",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-03-10T08:00:00+05:30",
            description:
              "A deep dive comparing the hidden charges, AMC fees, and STT costs.",
          }),
        }}
      />
    </ToolLayout>
  )
}
