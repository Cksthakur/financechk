import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Prepayment } from "@/lib/calculators/advanced-home-loan"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { SliderField } from "@/components/finance/slider-field"
import { LastUpdated } from "@/components/finance/last-updated"
import { ShareResult } from "@/components/finance/share-result"
import { calculateAdvancedHomeLoan } from "@/lib/calculators/advanced-home-loan"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute(
  "/tools/advanced-home-loan-emi-calculator"
)({
  head: () =>
    generateSeoMeta({
      title: "Home Loan EMI Calculator India - Prepayment & Tax Savings",
      description:
        "Advanced home loan EMI calculator with prepayment options and Section 24b tax benefits. Calculate EMI, amortization schedule, and tax savings for SBI, HDFC, ICICI home loans.",
      path: "/tools/advanced-home-loan-emi-calculator",
    }),
  component: AdvancedHomeLoanCalculator,
})

function LoanDetailsSection({
  homeValue,
  setHomeValue,
  downPaymentPercent,
  setDownPaymentPercent,
  loanInsurance,
  setLoanInsurance,
  interestRate,
  setInterestRate,
  tenureYears,
  setTenureYears,
  tenureMonths,
  setTenureMonths,
  loanFeesPercent,
  setLoanFeesPercent,
}: any) {
  return (
    <div
      className="rounded-2xl bg-card p-5 md:p-6"
      style={{
        boxShadow:
          "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
      }}
    >
      <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Home Loan Details
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <CurrencyInput
          label="Home Value (HV)"
          value={homeValue}
          onChange={setHomeValue}
        />
        <SliderField
          label="Down Payment (%)"
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => `${v}%`}
        />
        <CurrencyInput
          label="Loan Insurance"
          value={loanInsurance}
          onChange={setLoanInsurance}
        />
        <SliderField
          label="Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={5}
          max={15}
          step={0.1}
          formatValue={(v) => `${Number(v).toFixed(2)}%`}
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <SliderField
              label="Tenure (Years)"
              value={tenureYears}
              onChange={setTenureYears}
              min={1}
              max={30}
              step={1}
              formatValue={(v) => `${v} Yr`}
            />
          </div>
          <div className="flex-1">
            <SliderField
              label="(Months)"
              value={tenureMonths}
              onChange={setTenureMonths}
              min={0}
              max={11}
              step={1}
              formatValue={(v) => `${v} Mo`}
            />
          </div>
        </div>
        <SliderField
          label="Loan Fees (%)"
          value={loanFeesPercent}
          onChange={setLoanFeesPercent}
          min={0}
          max={5}
          step={0.05}
          formatValue={(v) => `${v}%`}
        />
      </div>
    </div>
  )
}

function ExpensesSection({
  propertyTaxYearlyPercent,
  setPropertyTaxYearlyPercent,
  homeInsuranceYearlyPercent,
  setHomeInsuranceYearlyPercent,
  maintenanceMonthly,
  setMaintenanceMonthly,
  taxBracket,
  setTaxBracket,
}: any) {
  return (
    <div
      className="rounded-2xl bg-card p-5 md:p-6"
      style={{
        boxShadow:
          "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
      }}
    >
      <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Homeowner Expenses & Tax Bracket
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <SliderField
          label="Property Tax / yr (%)"
          value={propertyTaxYearlyPercent}
          onChange={setPropertyTaxYearlyPercent}
          min={0}
          max={5}
          step={0.05}
          formatValue={(v) => `${v}%`}
        />
        <SliderField
          label="Home Ins. / yr (%)"
          value={homeInsuranceYearlyPercent}
          onChange={setHomeInsuranceYearlyPercent}
          min={0}
          max={2}
          step={0.05}
          formatValue={(v) => `${v}%`}
        />
        <CurrencyInput
          label="Maintenance / mo"
          value={maintenanceMonthly}
          onChange={setMaintenanceMonthly}
        />
        <SliderField
          label="Your Tax Slab (%)"
          value={taxBracket}
          onChange={setTaxBracket}
          min={0}
          max={30}
          step={5}
          formatValue={(v) => `${v}%`}
        />
      </div>
    </div>
  )
}

function PrepaymentsSection({
  prepayments,
  addPrepayment,
  removePrepayment,
  updatePrepayment,
}: any) {
  return (
    <div
      className="rounded-2xl bg-card p-5 md:p-6"
      style={{
        boxShadow:
          "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Partial Prepayments
        </p>
        <button
          onClick={addPrepayment}
          className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80"
        >
          <IconPlus className="size-3.5" /> Add Prepayment
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {prepayments.map((p: any) => (
          <div
            key={p.id}
            className="grid grid-cols-1 items-end gap-4 rounded-xl border border-border bg-secondary/20 p-4 sm:grid-cols-12"
          >
            <div className="sm:col-span-3">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Type
              </label>
              <select
                value={p.type}
                onChange={(e) => updatePrepayment(p.id, "type", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time Random</option>
              </select>
            </div>
            <div className="sm:col-span-4">
              <CurrencyInput
                label="Amount (₹)"
                value={p.amount}
                onChange={(v) => updatePrepayment(p.id, "amount", v)}
              />
            </div>
            <div className="sm:col-span-4">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Starts after (Months)
              </label>
              <input
                type="number"
                value={p.startMonthIndex}
                onChange={(e) =>
                  updatePrepayment(
                    p.id,
                    "startMonthIndex",
                    parseInt(e.target.value) || 1
                  )
                }
                min={1}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
            <div className="flex justify-end sm:col-span-1">
              <button
                onClick={() => removePrepayment(p.id)}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-fc-loss-bg hover:text-fc-loss-text"
              >
                <IconTrash className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {prepayments.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No prepayments added. Click "Add Prepayment" to simulate early
            payoff.
          </p>
        )}
      </div>
    </div>
  )
}

function AdvancedPayoffChart({ data }: { data: Array<any> }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted)
    return <div className="h-100 w-full rounded-xl bg-secondary/50" />

  return (
    <div className="h-100 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight={400}
        initialDimension={{ width: 600, height: 400 }}
      >
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(0,0,0,0.05)"
          />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(v) => formatCompactCurrency(v)}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => formatCompactCurrency(v)}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any) => formatCurrency(Number(value))}
            labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid var(--border)",
              boxShadow: "rgba(0,0,0,0.06) 0px 4px 8px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />

          {/* Stacked Bars bound to left axis */}
          <Bar
            yAxisId="left"
            dataKey="principal"
            name="Principal"
            stackId="a"
            fill="#65A30D"
          />
          <Bar
            yAxisId="left"
            dataKey="prepayments"
            name="Prepayments"
            stackId="a"
            fill="#EA580C"
          />
          <Bar
            yAxisId="left"
            dataKey="interest"
            name="Interest"
            stackId="a"
            fill="#D97706"
          />
          <Bar
            yAxisId="left"
            dataKey="taxesAndInsurance"
            name="Taxes & Maint."
            stackId="a"
            fill="#4C1D95"
          />

          {/* Line bound to right axis */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="#9F1239"
            strokeWidth={3}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function AdvancedAmortizationTable({ data }: { data: Array<any> }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-secondary/50 text-xs text-foreground uppercase">
            <tr>
              <th className="px-4 py-4 font-medium">Year</th>
              <th className="px-4 py-4 text-right font-medium">
                Principal (A)
              </th>
              <th className="px-4 py-4 text-right font-medium text-fc-amber">
                Interest (B)
              </th>
              <th className="px-4 py-4 text-right font-medium">
                Taxes & Maint (C)
              </th>
              <th className="px-4 py-4 text-right font-medium text-fc-gain">
                Tax Saved
              </th>
              <th className="px-4 py-4 text-right font-medium text-foreground">
                Total Payment
              </th>
              <th className="px-4 py-4 text-right font-medium">Balance</th>
              <th className="px-4 py-4 text-right font-medium">% Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y border-border">
            {data.map((row, i) => (
              <tr
                key={row.year}
                className={`transition-colors hover:bg-muted/50 ${i % 2 === 0 ? "bg-card" : "bg-secondary/10"}`}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {formatCurrency(row.principal + row.prepayments)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-fc-amber">
                  {formatCurrency(row.interest)}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {formatCurrency(row.taxesAndInsurance)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-fc-gain">
                  {formatCurrency(row.taxSaved)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                  {formatCurrency(row.totalPayment)}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {formatCurrency(row.balance)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">
                  {row.loanPaidPercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdvancedHomeLoanCalculator() {
  // 1. Home Loan Details
  const [homeValue, setHomeValue] = useState(5000000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [loanInsurance, setLoanInsurance] = useState(0)
  const [interestRate, setInterestRate] = useState(9)
  const [tenureYears, setTenureYears] = useState(20)
  const [tenureMonths, setTenureMonths] = useState(0)
  const [loanFeesPercent, setLoanFeesPercent] = useState(0.25)
  const [startMonth, _setStartMonth] = useState(4) // April
  const [startYear, _setStartYear] = useState(2026)

  // 2. Homeowner Expenses
  const [_oneTimeExpensesPercent, _setOneTimeExpensesPercent] = useState(10)
  const [propertyTaxYearlyPercent, setPropertyTaxYearlyPercent] = useState(0.25)
  const [homeInsuranceYearlyPercent, setHomeInsuranceYearlyPercent] =
    useState(0.05)
  const [maintenanceMonthly, setMaintenanceMonthly] = useState(2500)

  // Tax Bracket (Section 24b)
  const [taxBracket, setTaxBracket] = useState(30)

  // 3. Dynamic Prepayments
  const [prepayments, setPrepayments] = useState<Array<Prepayment>>([
    { id: "1", type: "yearly", amount: 100000, startMonthIndex: 12 },
  ])

  const addPrepayment = () => {
    setPrepayments([
      ...prepayments,
      {
        id: Date.now().toString(),
        type: "one-time",
        amount: 50000,
        startMonthIndex: 1,
      },
    ])
  }

  const removePrepayment = (id: string) => {
    setPrepayments(prepayments.filter((p) => p.id !== id))
  }

  const updatePrepayment = (
    id: string,
    field: keyof Prepayment,
    value: any
  ) => {
    setPrepayments(
      prepayments.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value }
        }
        return p
      })
    )
  }

  // Derived inputs
  const downPayment = homeValue * (downPaymentPercent / 100)
  const propertyTaxYearly = homeValue * (propertyTaxYearlyPercent / 100)
  const homeInsuranceYearly = homeValue * (homeInsuranceYearlyPercent / 100)
  const oneTimeExpenses = homeValue * (_oneTimeExpensesPercent / 100)

  const result = useMemo(
    () =>
      calculateAdvancedHomeLoan({
        homeValue,
        downPayment,
        loanInsurance,
        loanFeesPercent,
        interestRate,
        tenureYears,
        tenureMonths,
        propertyTaxYearly,
        homeInsuranceYearly,
        maintenanceMonthly,
        taxBracket,
        startMonth,
        startYear,
        prepayments,
      }),
    [
      homeValue,
      downPayment,
      loanInsurance,
      loanFeesPercent,
      interestRate,
      tenureYears,
      tenureMonths,
      propertyTaxYearly,
      homeInsuranceYearly,
      maintenanceMonthly,
      taxBracket,
      startMonth,
      startYear,
      prepayments,
    ]
  )

  const totalMonthlyObligation =
    result.baseEMI +
    propertyTaxYearly / 12 +
    homeInsuranceYearly / 12 +
    maintenanceMonthly

  const pieData = [
    {
      name: "Down Payment & Fees",
      value: result.downPaymentAndFees + oneTimeExpenses,
      color: "#9F1239",
    }, // Dark red
    { name: "Principal", value: result.totalPrincipal, color: "#65A30D" }, // Green
    { name: "Prepayments", value: result.totalPrepayments, color: "#EA580C" }, // Amber
    { name: "Interest", value: result.totalInterest, color: "#D97706" }, // Orange
    {
      name: "Taxes & Maint.",
      value: result.totalTaxesInsuranceMaintenance,
      color: "#4C1D95",
    }, // Purple
  ]

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Advanced Home Loan EMI Calculator" },
      ]}
    >
      <div className="mb-6">
        <h1
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "48px",
            letterSpacing: "-0.96px",
            lineHeight: 1.08,
          }}
        >
          Advanced Home Loan EMI Calculator
        </h1>
        <p
          className="mt-3 text-muted-foreground"
          style={{ fontSize: "18px", lineHeight: 1.6, letterSpacing: "0.18px" }}
        >
          Plan your exact amortization schedule with multiple random
          prepayments, property taxes, maintenance, and Section 24(b) income tax
          rebates.
        </p>
        <LastUpdated date="April 2026" author="Rajat" />
      </div>

      <div className="flex flex-col gap-6">
        <LoanDetailsSection
          homeValue={homeValue}
          setHomeValue={setHomeValue}
          downPaymentPercent={downPaymentPercent}
          setDownPaymentPercent={setDownPaymentPercent}
          loanInsurance={loanInsurance}
          setLoanInsurance={setLoanInsurance}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          tenureYears={tenureYears}
          setTenureYears={setTenureYears}
          tenureMonths={tenureMonths}
          setTenureMonths={setTenureMonths}
          loanFeesPercent={loanFeesPercent}
          setLoanFeesPercent={setLoanFeesPercent}
        />

        <ExpensesSection
          propertyTaxYearlyPercent={propertyTaxYearlyPercent}
          setPropertyTaxYearlyPercent={setPropertyTaxYearlyPercent}
          homeInsuranceYearlyPercent={homeInsuranceYearlyPercent}
          setHomeInsuranceYearlyPercent={setHomeInsuranceYearlyPercent}
          maintenanceMonthly={maintenanceMonthly}
          setMaintenanceMonthly={setMaintenanceMonthly}
          taxBracket={taxBracket}
          setTaxBracket={setTaxBracket}
        />

        <PrepaymentsSection
          prepayments={prepayments}
          addPrepayment={addPrepayment}
          removePrepayment={removePrepayment}
          updatePrepayment={updatePrepayment}
        />
      </div>

      <div
        className="mt-8 rounded-2xl bg-secondary/30 p-5 md:p-8"
        style={{ border: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-3">
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm font-medium text-foreground">
                Base EMI (Principal & Interest)
              </span>
              <span className="font-mono font-bold text-foreground">
                {formatCurrency(result.baseEMI)}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">
                Property Taxes (Monthly avg)
              </span>
              <span className="font-mono text-sm">
                {formatCurrency(propertyTaxYearly / 12)}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">
                Home Insurance (Monthly avg)
              </span>
              <span className="font-mono text-sm">
                {formatCurrency(homeInsuranceYearly / 12)}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">
                Maintenance Expenses
              </span>
              <span className="font-mono text-sm">
                {formatCurrency(maintenanceMonthly)}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-base font-bold text-foreground">
                Total Monthly Payment
              </span>
              <span className="font-mono text-xl font-bold text-foreground">
                {formatCurrency(totalMonthlyObligation)}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-fc-gain-bg p-4 text-fc-gain-text">
              <p className="text-xs font-bold tracking-wider uppercase">
                Estimated Tax Savings (Sec 24b)
              </p>
              <p className="mt-1 text-sm">
                Over the lifetime of the loan, you will save approximately{" "}
                <strong className="font-mono">
                  {formatCurrency(result.totalTaxSaved)}
                </strong>{" "}
                in income tax due to the interest deduction (assuming{" "}
                {taxBracket}% slab).
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="h-62.5 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minHeight={250}
                initialDimension={{ width: 400, height: 250 }}
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <div
                    className="size-2.5 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm font-medium">
              Total of all payments:{" "}
              {formatCurrency(result.totalPayment + oneTimeExpenses)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
        <p className="mb-6 text-center text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Home Loan Payment Schedule ({startYear} -{" "}
          {startYear + Math.ceil(result.newTenureMonths / 12)})
        </p>
        <AdvancedPayoffChart data={result.yearlySchedule} />
      </div>

      <div className="mt-8">
        <AdvancedAmortizationTable data={result.yearlySchedule} />
      </div>

      <ShareResult
        className="mt-6"
        params={{
          hv: homeValue,
          dp: downPaymentPercent,
          ins: loanInsurance,
          rate: interestRate,
          ty: tenureYears,
          tm: tenureMonths,
          fee: loanFeesPercent,
          pt: propertyTaxYearlyPercent,
          hi: homeInsuranceYearlyPercent,
          maint: maintenanceMonthly,
          tax: taxBracket,
        }}
      />

      <div className="mt-14 flex flex-col gap-12">
        <section>
          <h2
            className="mb-6 text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "32px",
              letterSpacing: "normal",
              lineHeight: 1.13,
            }}
          >
            How to Use Home Loan EMI Calculator?
          </h2>
          <div
            className="flex flex-col gap-4 text-muted-foreground"
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              letterSpacing: "0.16px",
            }}
          >
            <p>
              Using our Home Loan EMI Calculator, you can calculate how much
              monthly and total expenditure you really incur by purchasing a
              home using your bank home loan.
            </p>
            <p>
              <strong className="text-foreground">Home Loan Details</strong>{" "}
              includes single premium loan insurance and processing fees.
            </p>
            <ul className="flex flex-col gap-3 pl-2">
              <li>
                <strong className="text-foreground">Home Value</strong> is the
                actual price of the home you purchased (i.e., sale deed value).
              </li>
              <li>
                <strong className="text-foreground">Down Payment</strong>, aka
                Margin, is the total money you paid to the seller or builder
                from your own pocket, entered either in Rupees or as a
                percentage of Home Value.
              </li>
              <li>
                <strong className="text-foreground">Loan Insurance</strong> is
                the single premium amount, for the Home Loan Protection Plan
                (HLPP) OR Term Insurance Plan, that gets included in your home
                loan amount. If you want to guesstimate this amount, use the LIC
                premium calculator to calculate yearly premium for eTerm plan
                using your age, loan term and loan amount for Sum Assured. You
                then multiply this number by your loan tenure.
              </li>
              <li>
                <strong className="text-foreground">Loan Amount</strong> is
                calculated as Home Value + Loan Insurance — Down Payment.
              </li>
              <li>
                <strong className="text-foreground">Interest Rate</strong>{" "}
                charged by the bank / lender.
              </li>
              <li>
                <strong className="text-foreground">Loan Fees & Charges</strong>{" "}
                includes Processing Fees, Administrative Charges etc. along with
                service taxes, entered either in Rupees or as a percentage of
                Loan Amount.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="mb-6 text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "32px",
              letterSpacing: "normal",
              lineHeight: 1.13,
            }}
          >
            Understanding Homeowner Expenses & Prepayments
          </h2>
          <div
            className="flex flex-col gap-4 text-muted-foreground"
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              letterSpacing: "0.16px",
            }}
          >
            <p>
              <strong className="text-foreground">Homeowner Expenses</strong>{" "}
              can be entered either in Rupees or as a percentage of Home Value.
              You will not pay property taxes and home insurance premium each
              month, but it is included in the total monthly payment with the
              assumption that you are setting aside this amount (either through
              Recurring Deposit or some other means) every month. This will
              ensure that you will have the necessary money to make the payment
              once or twice a year.
            </p>
            <p>
              Please note that the recurring expenses will change over the
              lifetime of the home loan due to inflation and other factors. They
              will also continue beyond the home loan tenure. You should
              consider all these factors, especially when making a Rent vs. Buy
              decision.
            </p>
            <ul className="flex flex-col gap-3 pl-2">
              <li>
                <strong className="text-foreground">One-time Expenses</strong>{" "}
                can include Registration Fees, Stamp Duty and money you spent on
                sprucing up your new home.
              </li>
              <li>
                <strong className="text-foreground">Property Taxes</strong> is
                the annual payment that you grudgingly make to your local
                municipal body.
              </li>
              <li>
                <strong className="text-foreground">Home Insurance</strong> is
                the yearly premium you pay to insure your home.
              </li>
              <li>
                <strong className="text-foreground">
                  Monthly Maintenance Expenses
                </strong>{" "}
                is what you pay to keep your apartment secure, clean and
                resourceful.
              </li>
              <li>
                <strong className="text-foreground">Prepayments</strong> help
                you pay off your loan faster and reduce total interest cost. Add
                random partial prepayments or recurring monthly/yearly amounts
                to see how fast you can become debt-free.
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-8">
              <h3 className="mb-4 text-xl font-bold text-foreground">
                Deepen Your Knowledge
              </h3>
              <p className="mb-6 text-muted-foreground">
                Are you maximizing your tax savings? A home loan is the most
                powerful tax-saving tool in India. Learn how to legally claim up
                to ₹5 Lakhs in deductions every year using Section 80C and
                24(b).
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="/blog/section-80c-24b-home-loan-tax-benefits"
                  className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                >
                  Section 80C & 24(b): The Ultimate Home Loan Tax Guide
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <p className="mt-4 font-medium text-foreground">
              We wish you an affordable home loan and a great new home!
            </p>
          </div>
        </section>
      </div>
    </ToolLayout>
  )
}
