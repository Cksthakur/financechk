import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

const toolRedirects: Record<string, string> = {
  "budget-planner": "/tools/emergency-fund-calculator",
}

export const Route = createFileRoute("/tools/$legacyToolSlug")({
  beforeLoad: ({ params }) => {
    const target = toolRedirects[params.legacyToolSlug]

    if (!target) {
      throw notFound()
    }

    throw redirect({ to: target, statusCode: 301 })
  },
})
