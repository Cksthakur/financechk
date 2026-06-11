import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/investing")({
  beforeLoad: () => {
    throw redirect({ to: "/tools/investment-calculators", statusCode: 301 })
  },
})
