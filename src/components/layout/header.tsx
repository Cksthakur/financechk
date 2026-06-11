import { Link } from "@tanstack/react-router"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { useState } from "react"

const navLinks = [
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
] as const

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-20 bg-background/80 backdrop-blur-md"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
    >
      <div className="mx-auto flex h-16 max-w-(--fc-page-width) items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-1.5">
          <span
            className="text-base font-semibold tracking-tight text-foreground"
            style={{ letterSpacing: "-0.01em" }}
          >
            Finance
            <span className="font-normal text-[var(--fc-warm-gray)]">Chk</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="rounded-full px-3.5 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              style={{ letterSpacing: "0.15px" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-2">
            <Link
              to="/tools"
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px",
              }}
            >
              Get started
            </Link>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <IconX className="size-5" />
          ) : (
            <IconMenu2 className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="bg-background px-5 pb-4 md:hidden"
          style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block rounded-lg py-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              style={{ letterSpacing: "0.15px" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/tools"
            className="mt-2 block rounded-full bg-primary py-2.5 text-center text-[15px] font-medium text-primary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Get started
          </Link>
        </nav>
      )}
    </header>
  )
}
