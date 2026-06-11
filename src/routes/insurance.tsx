import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/insurance")({
  beforeLoad: () => {
    throw redirect({ to: "/tools", statusCode: 301 })
  },
})
