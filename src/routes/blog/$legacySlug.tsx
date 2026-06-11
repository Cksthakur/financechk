import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

const blogRedirects: Record<string, string> = {
  "emergency-fund-complete-guide": "/tools/emergency-fund-calculator",
  "personal-finance-literacy-guide": "/blog",
  "gold-price-outlook-how-will-china-tariffs-impact-mcx-gold-rates-explained":
    "/blog",
}

export const Route = createFileRoute("/blog/$legacySlug")({
  beforeLoad: ({ params }) => {
    const target = blogRedirects[params.legacySlug]

    if (!target) {
      throw notFound()
    }

    throw redirect({ to: target, statusCode: 301 })
  },
})
