import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ToolLayout } from "@/components/layout/tool-layout"
import { CurrencyInput } from "@/components/finance/currency-input"
import { ResultCard } from "@/components/finance/result-card"
import { ResultGrid } from "@/components/finance/result-grid"
import { SliderField } from "@/components/finance/slider-field"
import { LastUpdated } from "@/components/finance/last-updated"
import { generateSeoMeta } from "@/lib/seo"

export const Route = createFileRoute("/retirement-planner")({
  head: () =>
    generateSeoMeta({
      title: "Retirement Planner India - Corpus and SIP Calculator",
      description:
        "Estimate retirement corpus, monthly SIP need, and post-retirement income gap with inflation-adjusted planning.",
      path: "/retirement-planner",
    }),
  component: RetirementPlannerPage,
})

const percentFormat = (value: number) => `${value.toFixed(1)}%`
const yearsFormat = (value: number) => `${Math.round(value)}y`

function formatCurrencyINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`
}

function RetirementPlannerPage() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [currentMonthlyExpense, setCurrentMonthlyExpense] = useState(60_000)
  const [currentRetirementSavings, setCurrentRetirementSavings] =
    useState(10_00_000)
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState(12)
  const [expectedInflation, setExpectedInflation] = useState(6)
  const [postRetirementReturn, setPostRetirementReturn] = useState(7)
  const [lifeExpectancy, setLifeExpectancy] = useState(85)

  const safeRetirementAge = Math.max(retirementAge, currentAge + 1)

  const result = useMemo(() => {
    const yearsToRetirement = safeRetirementAge - currentAge
    const retirementYears = Math.max(lifeExpectancy - safeRetirementAge, 1)

    const monthlyInflationRate = expectedInflation / 100 / 12
    const monthlyPreRetReturn = expectedAnnualReturn / 100 / 12
    const monthlyPostRetReturn = postRetirementReturn / 100 / 12

    const futureMonthlyExpense =
      currentMonthlyExpense *
      Math.pow(1 + monthlyInflationRate, yearsToRetirement * 12)

    const realMonthlyPostRetReturn =
      (1 + monthlyPostRetReturn) / (1 + monthlyInflationRate) - 1

    const retirementMonths = retirementYears * 12

    const inflationAdjustedCorpusNeeded =
      realMonthlyPostRetReturn > 0
        ? futureMonthlyExpense *
          ((1 - Math.pow(1 + realMonthlyPostRetReturn, -retirementMonths)) /
            realMonthlyPostRetReturn)
        : futureMonthlyExpense * retirementMonths

    const futureValueOfCurrentSavings =
      currentRetirementSavings *
      Math.pow(1 + monthlyPreRetReturn, yearsToRetirement * 12)

    const corpusGap = Math.max(
      inflationAdjustedCorpusNeeded - futureValueOfCurrentSavings,
      0
    )

    let monthlySipRequired = 0
    const monthsToRetirement = yearsToRetirement * 12

    if (corpusGap > 0) {
      monthlySipRequired =
        monthlyPreRetReturn > 0
          ? corpusGap /
            ((Math.pow(1 + monthlyPreRetReturn, monthsToRetirement) - 1) /
              monthlyPreRetReturn)
          : corpusGap / monthsToRetirement
    }

    const monthlyIncomeFromCorpus =
      monthlyPostRetReturn > 0
        ? inflationAdjustedCorpusNeeded * monthlyPostRetReturn
        : inflationAdjustedCorpusNeeded / retirementMonths

    return {
      yearsToRetirement,
      retirementYears,
      futureMonthlyExpense,
      inflationAdjustedCorpusNeeded,
      futureValueOfCurrentSavings,
      corpusGap,
      monthlySipRequired,
      monthlyIncomeFromCorpus,
    }
  }, [
    currentAge,
    safeRetirementAge,
    currentMonthlyExpense,
    currentRetirementSavings,
    expectedAnnualReturn,
    expectedInflation,
    postRetirementReturn,
    lifeExpectancy,
  ])

  return (
    <ToolLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Retirement Planner" },
      ]}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "42px",
              lineHeight: 1.1,
              letterSpacing: "-0.84px",
            }}
          >
            Retirement Planner
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Plan your target corpus with inflation-adjusted expenses, expected
            returns, and retirement duration.
          </p>
        </div>
        <LastUpdated date="April 2026" author="Rajat Das" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Inputs</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <SliderField
              label="Current Age"
              value={currentAge}
              onChange={(value) => setCurrentAge(Math.round(value))}
              min={18}
              max={70}
              step={1}
              formatValue={yearsFormat}
            />
            <SliderField
              label="Retirement Age"
              value={safeRetirementAge}
              onChange={(value) => setRetirementAge(Math.round(value))}
              min={30}
              max={80}
              step={1}
              formatValue={yearsFormat}
            />
            <SliderField
              label="Life Expectancy"
              value={lifeExpectancy}
              onChange={(value) => setLifeExpectancy(Math.round(value))}
              min={65}
              max={100}
              step={1}
              formatValue={yearsFormat}
            />
            <CurrencyInput
              label="Current Monthly Expense"
              value={currentMonthlyExpense}
              onChange={setCurrentMonthlyExpense}
              min={5_000}
              max={10_00_000}
            />
            <CurrencyInput
              label="Current Retirement Savings"
              value={currentRetirementSavings}
              onChange={setCurrentRetirementSavings}
              min={0}
              max={50_00_00_000}
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <SliderField
              label="Pre-retirement Return"
              value={expectedAnnualReturn}
              onChange={setExpectedAnnualReturn}
              min={4}
              max={18}
              step={0.1}
              formatValue={percentFormat}
            />
            <SliderField
              label="Inflation"
              value={expectedInflation}
              onChange={setExpectedInflation}
              min={2}
              max={10}
              step={0.1}
              formatValue={percentFormat}
            />
            <SliderField
              label="Post-retirement Return"
              value={postRetirementReturn}
              onChange={setPostRetirementReturn}
              min={3}
              max={12}
              step={0.1}
              formatValue={percentFormat}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Projection
          </h2>
          <ResultGrid cols={2}>
            <ResultCard
              label="Years To Retirement"
              value={`${result.yearsToRetirement} years`}
            />
            <ResultCard
              label="Retirement Duration"
              value={`${result.retirementYears} years`}
            />
            <ResultCard
              label="Expense At Retirement"
              value={formatCurrencyINR(result.futureMonthlyExpense)}
              subtitle="Estimated monthly need"
            />
            <ResultCard
              label="Target Corpus"
              value={formatCurrencyINR(result.inflationAdjustedCorpusNeeded)}
            />
            <ResultCard
              label="Future Value Of Existing Savings"
              value={formatCurrencyINR(result.futureValueOfCurrentSavings)}
            />
            <ResultCard
              label="Corpus Gap"
              value={formatCurrencyINR(result.corpusGap)}
              variant={result.corpusGap > 0 ? "loss" : "gain"}
            />
            <ResultCard
              label="Required Monthly SIP"
              value={formatCurrencyINR(result.monthlySipRequired)}
              subtitle="To close corpus gap"
              variant="gain"
            />
            <ResultCard
              label="Monthly Income From Target Corpus"
              value={formatCurrencyINR(result.monthlyIncomeFromCorpus)}
            />
          </ResultGrid>
        </section>
      </div>
    </ToolLayout>
  )
}
