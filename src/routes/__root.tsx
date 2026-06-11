import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import appCss from "../styles.css?url"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createRootRoute({
  head: () => {
    const seo = generateSeoMeta({
      title: "FinanceChk — Free Financial Calculators for India",
      description:
        "Free, accurate financial calculators for India. Home loan eligibility, SIP returns, tax regime comparison, and more. No signup required.",
      path: "/",
    })

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#ffffff" },
        ...seo.meta,
        { property: "og:site_name", content: "FinanceChk" },
        { property: "og:locale", content: "en_IN" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "64x64",
          href: "/favicon-64x64.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "128x128",
          href: "/favicon-128x128.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "shortcut icon", href: "/favicon.ico" },
        ...seo.links,
      ],
    }
  },
  notFoundComponent: NotFoundView,
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
        {!import.meta.env.DEV && (
          <>
            <meta
              name="google-adsense-account"
              content="ca-pub-3851765751027929"
            />
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3851765751027929"
              crossOrigin="anonymous"
            ></script>
          </>
        )}
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function NotFoundView() {
  return (
    <div className="mx-auto max-w-(--fc-page-width) px-5 py-16 md:px-8 md:py-24">
      <div
        className="rounded-3xl border border-border bg-card p-8 md:p-10"
        style={{
          boxShadow:
            "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 8px 20px",
        }}
      >
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Error 404
        </p>
        <h1
          className="mt-2 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "46px",
            letterSpacing: "-0.92px",
            lineHeight: 1.08,
          }}
        >
          Page not found
        </h1>
        <p
          className="mt-3 max-w-2xl text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          The page you requested is unavailable or the URL may be incorrect. Use
          the links below to continue with the most-used tools.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go to Home
          </Link>
          <Link
            to="/tools"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Browse All Tools
          </Link>
          <Link
            to="/tools/tax-calculators"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Tax Tools
          </Link>
          <Link
            to="/tools/loan-calculators"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Loan Tools
          </Link>
        </div>
      </div>
    </div>
  )
}
