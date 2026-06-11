import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/gst")({
  beforeLoad: () => {
    throw redirect({ to: "/tools/tax-calculators", statusCode: 301 })
  },
})
