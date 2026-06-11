import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

const taxRedirects: Record<string, string> = {
  "hra-exemption": "/tools/hra-calculator",
  "tax-refund-calculator": "/tools/tax-calculators",
  "home-loan-tax-benefit": "/tools/home-loan-tax-benefit-calculator",
}

export const Route = createFileRoute("/tax/$legacyTaxSlug")({
  beforeLoad: ({ params }) => {
    const target = taxRedirects[params.legacyTaxSlug]

    if (!target) {
      throw notFound()
    }

    throw redirect({ to: target, statusCode: 301 })
  },
})
