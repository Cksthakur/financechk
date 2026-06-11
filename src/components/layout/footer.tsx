import { Link } from "@tanstack/react-router"

const footerLinks = {
  tools: [
    {
      label: "Home Loan Eligibility Calculator",
      href: "/tools/home-loan-eligibility-calculator",
    },
    { label: "SIP Calculator", href: "/tools/sip-calculator" },
    { label: "Tax Regime Comparison", href: "/tools/tax-regime-comparison" },
    { label: "All Tools", href: "/tools" },
  ],
  resources: [
    { label: "About", href: "/about" },
    { label: "Blogs", href: "/blog" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="mx-auto max-w-(--fc-page-width) px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p
              className="text-base font-semibold text-foreground"
              style={{ letterSpacing: "-0.01em" }}
            >
              Finance
              <span className="font-normal text-[var(--fc-warm-gray)]">
                Chk
              </span>
            </p>
            <p
              className="mt-2 text-[16px] leading-relaxed text-muted-foreground"
              style={{ letterSpacing: "0.16px" }}
            >
              Free, accurate financial calculators for India. No signup, no
              paywall.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Tools
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                    style={{ letterSpacing: "0.15px" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Resources
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                    style={{ letterSpacing: "0.15px" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6"
          style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        >
          <p
            className="text-center text-[14px] leading-relaxed text-muted-foreground/70"
            style={{ letterSpacing: "0.14px" }}
          >
            Disclaimer: All calculations are estimates. Consult a certified
            financial advisor before making financial decisions. Data sourced
            from RBI, SEBI, and official bank publications.
          </p>
        </div>
      </div>
    </footer>
  )
}
