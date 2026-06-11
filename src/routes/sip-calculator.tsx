import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/sip-calculator")({
  beforeLoad: () => {
    throw redirect({ to: "/tools/sip-calculator", statusCode: 301 })
  },
})
