import { createFileRoute } from "@tanstack/react-router"
import { ToolLayout } from "@/components/layout/tool-layout"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/blog/us-income-tax-calculator-how-much-tax-do-i-pay"
)({
  head: () =>
    generateSeoMeta({
      title:
        "How Much Tax Do I Pay on $100,000 Income? US Tax Calculator Guide",
      description:
        "Calculate your US federal income tax at different income levels. See marginal vs effective tax rates with detailed examples for $50K, $75K, $100K, $150K and more.",
      path: "/blog/us-income-tax-calculator-how-much-tax-do-i-pay",
      type: "article",
    }),
  component: USTaxByIncomeLevel,
})

function USTaxByIncomeLevel() {
  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "US Tax by Income Level" },
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
            How Much Tax Do I Pay on $100,000 Income? US Tax Calculator Guide
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <LastUpdated date="April 2026" author="Rajat Das" />
            <span className="text-xs text-muted-foreground">· 10 min read</span>
          </div>
        </header>

        <div
          className="flex flex-col gap-8 text-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          <section>
            <p className="mb-4">
              One of the most common questions taxpayers ask is:{" "}
              <strong className="text-foreground">
                "How much tax will I pay on my income?"
              </strong>
              The answer isn't straightforward because the US uses a progressive
              tax system where different portions of your income are taxed at
              different rates.
            </p>
            <p className="mb-4">
              In this guide, we'll break down exactly how federal income tax
              works across different income levels using the 2025 tax brackets.
              We'll show you how to calculate your own tax liability and compare
              it to historical periods.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              How Progressive Taxation Works
            </h2>
            <p className="mb-4">
              In a progressive tax system, different portions of your income are
              taxed at different rates. Your first dollars are taxed at the
              lowest rate (10%), while your last dollars are taxed at higher
              rates.
            </p>

            <div className="my-6 rounded-2xl bg-secondary/30 p-6">
              <h4 className="mb-4 text-lg font-semibold text-foreground">
                Example: Single Filer Earning $75,000 (2025)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">
                        Income Portion
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Bracket Rate
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Tax Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="px-3 py-2">First $11,925</td>
                      <td className="px-3 py-2">10%</td>
                      <td className="px-3 py-2 text-right">$1,192.50</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-3 py-2">$11,926 - $48,475</td>
                      <td className="px-3 py-2">12%</td>
                      <td className="px-3 py-2 text-right">$4,386.00</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-3 py-2">$48,476 - $75,000</td>
                      <td className="px-3 py-2">22%</td>
                      <td className="px-3 py-2 text-right">$5,835.50</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 font-semibold">Total Tax</td>
                      <td className="px-3 py-2"></td>
                      <td className="px-3 py-2 text-right font-semibold">
                        $11,414
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong className="text-foreground">
                  Effective tax rate: 15.2%
                </strong>{" "}
                (not 22%!)
              </p>
            </div>

            <p className="mb-4">
              <strong className="text-foreground">
                Key terms to understand:
              </strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Marginal rate:</strong> The
                tax rate on your last dollar (22% in this example)
              </li>
              <li>
                <strong className="text-foreground">Effective rate:</strong>{" "}
                Your actual tax divided by total income (15.2%)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Tax Calculations at Key Income Levels (2025)
            </h2>
            <p className="mb-4">
              Here's a breakdown of federal income tax for single filers at
              various income levels:
            </p>

            <div className="mb-6 overflow-x-auto">
              <table className="w-full border border-border text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Income</th>
                    <th className="px-4 py-2 text-right font-medium">
                      Total Tax
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Effective Rate
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      After-Tax Income
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$50,000</td>
                    <td className="px-4 py-2 text-right">$5,754</td>
                    <td className="px-4 py-2 text-right">11.5%</td>
                    <td className="px-4 py-2 text-right">$44,246</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$75,000</td>
                    <td className="px-4 py-2 text-right">$11,414</td>
                    <td className="px-4 py-2 text-right">15.2%</td>
                    <td className="px-4 py-2 text-right">$63,586</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$100,000</td>
                    <td className="px-4 py-2 text-right">$17,954</td>
                    <td className="px-4 py-2 text-right">18.0%</td>
                    <td className="px-4 py-2 text-right">$82,046</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$150,000</td>
                    <td className="px-4 py-2 text-right">$32,454</td>
                    <td className="px-4 py-2 text-right">21.6%</td>
                    <td className="px-4 py-2 text-right">$117,546</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$250,000</td>
                    <td className="px-4 py-2 text-right">$60,454</td>
                    <td className="px-4 py-2 text-right">24.2%</td>
                    <td className="px-4 py-2 text-right">$189,546</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$500,000</td>
                    <td className="px-4 py-2 text-right">$148,254</td>
                    <td className="px-4 py-2 text-right">29.7%</td>
                    <td className="px-4 py-2 text-right">$351,746</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">$1,000,000</td>
                    <td className="px-4 py-2 text-right">$333,069</td>
                    <td className="px-4 py-2 text-right">33.3%</td>
                    <td className="px-4 py-2 text-right">$666,931</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Married Filing Jointly: The "Marriage Penalty" Effect
            </h2>
            <p className="mb-4">
              When both spouses earn similar incomes, filing jointly often
              results in a tax benefit. However, in some cases, couples may pay
              more than if they filed singly.
            </p>

            <div className="mb-6 overflow-x-auto">
              <table className="w-full border border-border text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      Scenario
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Total Tax
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      After-Tax
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">Both earn $50K (single)</td>
                    <td className="px-4 py-2 text-right">$11,508</td>
                    <td className="px-4 py-2 text-right">$88,492</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">One earns $100K</td>
                    <td className="px-4 py-2 text-right">$17,954</td>
                    <td className="px-4 py-2 text-right">$82,046</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2 font-medium">
                      Both earn $100K (joint)
                    </td>
                    <td className="px-4 py-2 text-right">$27,908</td>
                    <td className="px-4 py-2 text-right">$172,092</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">One earns $200K</td>
                    <td className="px-4 py-2 text-right">$42,754</td>
                    <td className="px-4 py-2 text-right">$157,246</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-4">
              <strong className="text-foreground">Key insight:</strong> At
              higher incomes, having both spouses work can reduce total tax
              burden due to bracket doubling.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              2025 vs 2017: The TCJA Impact
            </h2>
            <p className="mb-4">
              Let's compare tax liability for single filers before and after the
              Tax Cuts and Jobs Act:
            </p>

            <div className="mb-6 overflow-x-auto">
              <table className="w-full border border-border text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Income</th>
                    <th className="px-4 py-2 text-right font-medium">
                      2017 Tax
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      2025 Tax
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Savings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$50,000</td>
                    <td className="px-4 py-2 text-right">$7,045</td>
                    <td className="px-4 py-2 text-right">$5,754</td>
                    <td className="px-4 py-2 text-right text-fc-gain-text">
                      -$1,291
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$75,000</td>
                    <td className="px-4 py-2 text-right">$14,438</td>
                    <td className="px-4 py-2 text-right">$11,414</td>
                    <td className="px-4 py-2 text-right text-fc-gain-text">
                      -$3,024
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$100,000</td>
                    <td className="px-4 py-2 text-right">$22,314</td>
                    <td className="px-4 py-2 text-right">$17,954</td>
                    <td className="px-4 py-2 text-right text-fc-gain-text">
                      -$4,360
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$150,000</td>
                    <td className="px-4 py-2 text-right">$36,684</td>
                    <td className="px-4 py-2 text-right">$32,454</td>
                    <td className="px-4 py-2 text-right text-fc-gain-text">
                      -$4,230
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$250,000</td>
                    <td className="px-4 py-2 text-right">$65,098</td>
                    <td className="px-4 py-2 text-right">$60,454</td>
                    <td className="px-4 py-2 text-right text-fc-gain-text">
                      -$4,644
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">$500,000</td>
                    <td className="px-4 py-2 text-right">$159,819</td>
                    <td className="px-4 py-2 text-right">$148,254</td>
                    <td className="px-4 py-2 text-right text-fc-gain-text">
                      -$11,565
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-4">
              <strong className="text-foreground">Key observations:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Everyone benefits: Every income level pays less tax</li>
              <li>Higher income = bigger dollar benefit</li>
              <li>Percentage reduction ranges from 15-25%</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Tax Planning Strategies by Income Level
            </h2>

            <div className="my-6 space-y-4">
              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-2 font-semibold text-foreground">
                  $0 - $50,000: Focus on Credits
                </h4>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Earned Income Tax Credit (EITC)</li>
                  <li>Child Tax Credit</li>
                  <li>Education credits</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-2 font-semibold text-foreground">
                  $50,000 - $100,000: Maximize Deductions
                </h4>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>401(k) contributions ($23,000 in 2025)</li>
                  <li>HSA contributions</li>
                  <li>Student loan interest deduction</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-2 font-semibold text-foreground">
                  $100,000 - $200,000: Tax-Deferred Accounts
                </h4>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Max out 401(k) and IRA</li>
                  <li>Consider taxable brokerage with municipal bonds</li>
                  <li>Tax-loss harvesting opportunities</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border p-4">
                <h4 className="mb-2 font-semibold text-foreground">
                  $200,000+: Advanced Strategies
                </h4>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Roth conversions</li>
                  <li>Charitable giving strategies</li>
                  <li>Business deductions (if applicable)</li>
                  <li>State tax planning</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Quick Reference: 2025 Tax Brackets
            </h2>
            <div className="mb-6 overflow-x-auto">
              <table className="w-full border border-border text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      If taxable income is...
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Tax is...
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$0 - $11,925</td>
                    <td className="px-4 py-2">10%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$11,926 - $48,475</td>
                    <td className="px-4 py-2">
                      $1,192.50 + 12% of amount over $11,925
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$48,476 - $103,350</td>
                    <td className="px-4 py-2">
                      $5,578.50 + 22% of amount over $48,475
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$103,351 - $197,300</td>
                    <td className="px-4 py-2">
                      $17,871.50 + 24% of amount over $103,350
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$197,301 - $250,525</td>
                    <td className="px-4 py-2">
                      $40,419.50 + 32% of amount over $197,300
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-2">$250,526 - $626,350</td>
                    <td className="px-4 py-2">
                      $57,071.50 + 35% of amount over $250,525
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Over $626,350</td>
                    <td className="px-4 py-2">
                      $188,860.50 + 37% of amount over $626,350
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Conclusion
            </h2>
            <p className="mb-4">
              Understanding how tax brackets work is essential for effective
              financial planning. Remember:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  Your effective rate is lower than your marginal rate
                </strong>
              </li>
              <li>
                The TCJA provided meaningful tax cuts across all income levels
              </li>
              <li>2025 is the last year of current TCJA provisions</li>
              <li>Plan now for potential 2026 tax changes</li>
            </ul>
          </section>
        </div>
      </article>
    </ToolLayout>
  )
}
