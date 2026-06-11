import { Link, createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/sip-vs-lumpsum-vs-step-up-comparison"
)({
  head: () =>
    generateSeoMeta({
      title: "SIP vs Lump Sum vs Step-Up SIP: Which is Better?",
      description:
        "A mathematical comparison of SIP, lump sum, and step-up SIP investments. Find out which strategy creates more wealth in the Indian stock market.",
      path: "/blog/sip-vs-lumpsum-vs-step-up-comparison",
      type: "article",
    }),
  component: SipVsLumpsumArticle,
})

function SipVsLumpsumArticle() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "SIP vs Lump Sum vs Step-Up SIP" },
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
            SIP vs Lump Sum vs Step-Up SIP: The Ultimate Mutual Fund Math
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="February 2025" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 7 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              You have ₹12 Lakhs sitting in your bank account. The burning
              question: Should I dump it all into a mutual fund today, or should
              I start a ₹1 Lakh SIP every month for the next year? And if SIPs
              are so great, what exactly is a "Step-Up SIP"? Let's settle the
              debate with actual math.
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
              1. The Lump Sum Approach: Mathematical Dominance
            </h2>
            <p className="mb-4">
              A lump sum investment is exactly what it sounds like: you take all
              your capital and deploy it into the market on a single day.
            </p>
            <p className="mb-4">
              <strong>The Math:</strong> Historically, stock markets like the
              Nifty 50 go up roughly 65% to 70% of the time. Because the
              inherent trend is upward, deploying your money on Day 1 means{" "}
              <em>all</em> your money is working for you and compounding from
              the very beginning.
            </p>
            <p>
              If you invest ₹12L lump sum at an expected 12% return for 10
              years, your final corpus will be <strong>₹37.2 Lakhs</strong>. Try
              the{" "}
              <Link
                to="/tools/lumpsum-calculator"
                className="font-semibold text-primary hover:underline"
              >
                Lumpsum Calculator
              </Link>{" "}
              yourself.
            </p>

            <h3 className="mt-8 mb-3 text-2xl font-semibold text-foreground">
              The Catch: The Psychological Nightmare
            </h3>
            <p>
              What if you invest ₹12 Lakhs on Monday, and a global crisis hits
              on Tuesday causing the market to plunge 15%? Your portfolio
              immediately drops to ₹10.2 Lakhs. The psychological pain is
              immense, and many retail investors panic-sell, locking in their
              losses. Lump sum requires a heart of steel.
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
              2. The Standard SIP: Emotional Peace & Rupee Cost Averaging
            </h2>
            <p className="mb-4">
              Instead of ₹12L today, you invest ₹10,000 every month for 10
              years. Total invested is still ₹12 Lakhs.
            </p>
            <p className="mb-4">
              <strong>The Math:</strong> When you run the{" "}
              <Link
                to="/tools/sip-calculator"
                className="font-semibold text-primary hover:underline"
              >
                SIP Calculator
              </Link>{" "}
              at 12% for 10 years, the final corpus is{" "}
              <strong>₹23.2 Lakhs</strong>. Wait, why is it so much lower than
              the Lump Sum (₹37.2L)?
            </p>
            <p className="mb-4">
              Because your 120th installment (the ₹10k in year 10) only
              compounded for one single month! Only your first ₹10k compounded
              for the full 10 years.
            </p>

            <h3 className="mt-8 mb-3 text-2xl font-semibold text-foreground">
              The True Superpower of SIPs
            </h3>
            <p className="mb-4">
              SIPs are not designed to beat lump sum mathematically in a bull
              market. They are designed for two things:
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong>Salary Matching:</strong> Most people simply don't have
                ₹12L lying around. But everyone has a monthly salary. SIPs match
                your cash inflows.
              </li>
              <li>
                <strong>Rupee Cost Averaging:</strong> When the market crashes,
                you don't panic. You celebrate. Why? Because your ₹10,000
                auto-debit just bought mutual fund units at a massive discount.
                Over a 10-year period, this smooths out market volatility.
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
              3. The Step-Up SIP: The Wealth Accelerator
            </h2>
            <p className="mb-4">
              This is the secret strategy used by high-net-worth individuals. A
              Step-Up SIP automatically increases your SIP amount every year by
              a fixed percentage (usually mirroring your annual salary hike).
            </p>
            <p className="mb-4">
              Suppose you start an SIP of ₹10,000/month, but you "Step-Up" the
              amount by 10% every year. Year 1: ₹10k/mo. Year 2: ₹11k/mo. Year
              3: ₹12.1k/mo.
            </p>

            <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-secondary/50 text-xs tracking-wider text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Investment Type (12% return/20 yrs)
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Total Out Of Pocket
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Final Wealth Corpus
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border">
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">
                      Standard SIP (₹10,000 flat)
                    </td>
                    <td className="px-6 py-4">₹ 24 Lakhs</td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      ₹ 1.0 Crore
                    </td>
                  </tr>
                  <tr className="bg-secondary/10 transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">
                      Step-Up SIP (+10% annual bump)
                    </td>
                    <td className="px-6 py-4">₹ 68 Lakhs</td>
                    <td className="px-6 py-4 font-bold text-primary">
                      ₹ 2.0 Crores
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-4">
              By just committing half of your annual salary hike to your SIP,
              you literally double your final wealth. Check your own numbers
              using the{" "}
              <Link
                to="/tools/step-up-sip-calculator"
                className="font-semibold text-primary hover:underline"
              >
                Step-Up SIP Calculator
              </Link>
              .
            </p>

            <div className="my-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mt-0 mb-3 text-xl font-semibold">
                The Final Verdict
              </h3>
              <ul className="m-0 ml-6 list-disc space-y-2">
                <li>
                  <strong>Selling property / Inherited money?</strong> Consider
                  Staggering the Lump Sum (STP) over 6 months to minimize timing
                  risk, but don't stretch it over years.
                </li>
                <li>
                  <strong>Salaried employee?</strong> Always use Step-Up SIP. A
                  flat SIP ignores inflation and your growing income.
                </li>
              </ul>
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
              "SIP vs Lump Sum vs Step-Up SIP: The Ultimate Mutual Fund Math",
            author: { "@type": "Person", name: "Rajat Das" },
            datePublished: "2025-02-01T08:00:00+05:30",
            description:
              "A mathematical comparison of SIP, lump sum, and step-up SIP investments.",
          }),
        }}
      />
    </ToolLayout>
  )
}
