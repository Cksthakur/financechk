import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

const businessRedirects: Record<string, string> = {
  "profit-margin": "/tools/depreciation-calculator",
  "depreciation-calculator": "/tools/depreciation-calculator",
}

export const Route = createFileRoute("/business/$legacyBusinessSlug")({
  beforeLoad: ({ params }) => {
    const target = businessRedirects[params.legacyBusinessSlug]

    if (!target) {
      throw notFound()
    }

    throw redirect({ to: target, statusCode: 301 })
  },
})
