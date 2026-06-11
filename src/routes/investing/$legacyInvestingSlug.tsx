import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

const investingRedirects: Record<string, string> = {
  "elss-calculator": "/tools/elss-calculator",
}

export const Route = createFileRoute("/investing/$legacyInvestingSlug")({
  beforeLoad: ({ params }) => {
    const target = investingRedirects[params.legacyInvestingSlug]

    if (!target) {
      throw notFound()
    }

    throw redirect({ to: target, statusCode: 301 })
  },
})
