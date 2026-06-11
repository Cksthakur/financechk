import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

const loanRedirects: Record<string, string> = {
  "loan-prepayment": "/tools/personal-loan-prepayment-calculator",
  "personal-loan-comparison": "/tools/loan-calculators",
  "home-loan-emi-calculator": "/tools/advanced-home-loan-emi-calculator",
  "loan-balance-transfer": "/tools/personal-loan-balance-transfer-calculator",
}

export const Route = createFileRoute("/loans/$legacyLoanSlug")({
  beforeLoad: ({ params }) => {
    const target = loanRedirects[params.legacyLoanSlug]

    if (!target) {
      throw notFound()
    }

    throw redirect({ to: target, statusCode: 301 })
  },
})
