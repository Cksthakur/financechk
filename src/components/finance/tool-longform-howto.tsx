import { cn } from "@/lib/utils"

export type ToolGuideCategory =
  | "loans"
  | "investment"
  | "tax"
  | "trading"
  | "general"

interface ToolLongformHowToProps {
  toolName: string
  category: ToolGuideCategory
  updated: string
  author?: string
  className?: string
}

interface CategoryGuidePreset {
  articleSubtitle: string
  executiveSummary: string
  introduction: string
  foundation: string
  subsectionTitle: string
  subsectionBody: string
  expertQuote: string
  expertSource: string
  deepDive: string
  comparisonA: string
  comparisonB: string
  factor1A: string
  factor1B: string
  factor2A: string
  factor2B: string
  application: string
  appStep1Action: string
  appStep1Detail: string
  appStep2Action: string
  appStep2Detail: string
  conclusion: string
  references: [string, string, string]
  difficulty: string
  timeRequired: string
  needs: [string, string, string]
  overview: string
  beforeStart: [string, string, string]
  howStep1Title: string
  howStep1Detail: string
  howTip: string
  howStep2Title: string
  howStep2Detail: string
  howWarning: string
  howStep3Title: string
  howStep3Detail: string
  troubleshooting: [
    { problem: string; solution: string },
    { problem: string; solution: string },
  ]
  nextSteps: [string, string]
  faq: [
    { question: string; answer: string },
    { question: string; answer: string },
  ]
  readMinutes: number
}

const presets: Record<ToolGuideCategory, CategoryGuidePreset> = {
  tax: {
    articleSubtitle: "Tax optimization, documentation, and filing confidence",
    executiveSummary:
      "Treat tax planning as a year-round workflow, not a filing-season event. Correct sequencing reduces leakage and improves compliance quality.",
    introduction:
      "Tax outcomes depend on timing, deduction structure, data accuracy, and documentation discipline. This framework helps you move from rough estimate to filing-ready plan with fewer surprises.",
    foundation:
      "Start with income-map clarity: salary, capital gains, business/professional receipts, and one-time events. Then layer deduction eligibility and regime assumptions before acting on any optimization recommendation.",
    subsectionTitle: "Subsection: Source-of-truth data hygiene",
    subsectionBody:
      "Maintain alignment between Form 16, AIS, 26AS, payroll declarations, and investment proofs. Most filing friction is a data mismatch issue, not a formula issue.",
    expertQuote:
      "A clean trail of facts beats last-minute deduction chasing every time.",
    expertSource:
      "Indian tax-practice standard for salaried and professional filers",
    deepDive:
      "Run at least two scenarios before locking decisions: a conservative case (lower deductions, delayed investments) and a realistic case (actual spend and proof readiness).",
    comparisonA: "Lower deduction path",
    comparisonB: "Higher deduction path",
    factor1A: "Faster filing, lower proof load",
    factor1B: "Better savings, higher proof dependency",
    factor2A: "Predictable monthly cash flow",
    factor2B: "Requires disciplined quarterly tracking",
    application:
      "Implement decisions in quarterly cycles so your final-quarter tax outgo remains manageable and documentation is complete well before filing deadlines.",
    appStep1Action: "Map all taxable streams and deduction ceilings",
    appStep1Detail:
      "Prepare a single tracker for salary components, investments, insurance, interest, and gain events.",
    appStep2Action: "Validate assumptions with proof availability",
    appStep2Detail:
      "Prefer deductions you can document confidently over aggressive but weakly-supported claims.",
    conclusion:
      "The best tax strategy is one that is both efficient and defensible. Optimize, but keep evidence quality high so filing and scrutiny response stay smooth.",
    references: [
      "Income Tax Act provisions applicable to your filing profile",
      "CBDT circulars and annual filing guidance",
      "Payroll and tax-audit documentation best practices",
    ],
    difficulty: "Beginner to Intermediate",
    timeRequired: "25-40 minutes",
    needs: [
      "Salary/tax documents (Form 16, AIS/26AS where relevant)",
      "Deduction and investment proof summary",
      "Current-year income and cash-flow assumptions",
    ],
    overview:
      "This guide helps you build a practical tax workflow from baseline estimation to filing-ready action planning.",
    beforeStart: [
      "Compile all income sources and one-time transactions",
      "List likely deductions with realistic claim values",
      "Keep supporting proofs ready before finalizing numbers",
    ],
    howStep1Title: "Establish baseline tax liability",
    howStep1Detail:
      "Use your current income and deduction assumptions to generate the first-pass liability view.",
    howTip:
      "Tip: Save one conservative and one realistic scenario for faster quarterly updates.",
    howStep2Title: "Stress-test with documentation and timing constraints",
    howStep2Detail:
      "Validate whether each claim is evidence-backed and whether payment/investment timing supports current-year eligibility.",
    howWarning:
      "Warning: Never rely on deductions that you cannot substantiate with clear records.",
    howStep3Title: "Finalize action plan and review cadence",
    howStep3Detail:
      "Set monthly/quarterly checkpoints for proof collection, tax provisioning, and revision after major income events.",
    troubleshooting: [
      {
        problem: "Mismatch between estimate and payroll computation",
        solution:
          "Reconcile salary components and declaration entries; then re-run with corrected inputs.",
      },
      {
        problem: "Unexpected tax due near year-end",
        solution:
          "Use advance-tax and cash-flow checks earlier in the year; move to quarterly reviews.",
      },
    ],
    nextSteps: [
      "Cross-check final numbers with filing documents before submission",
      "Use related calculators for salary impact, capital gains, or notice-response readiness",
    ],
    faq: [
      {
        question: "Should I optimize deductions before choosing regime?",
        answer:
          "Compare both regimes first, then optimize deductions in the context of the likely better regime.",
      },
      {
        question: "How often should I update tax projections?",
        answer:
          "Quarterly is practical for most users, and immediately after salary hikes, gains, or major deductions.",
      },
    ],
    readMinutes: 9,
  },
  loans: {
    articleSubtitle: "Affordability, total cost, and repayment resilience",
    executiveSummary:
      "A loan decision is sustainable when EMI comfort, total interest, and prepayment flexibility are all modeled together.",
    introduction:
      "Borrowing decisions are often made on EMI alone, but the true outcome depends on tenure, rate path, fees, and future cash-flow resilience. This structure helps you evaluate all these dimensions systematically.",
    foundation:
      "Start by identifying safe EMI range under conservative income assumptions. Then estimate total repayment and interest share before considering optimization levers like prepayment or balance transfer.",
    subsectionTitle: "Subsection: Stress-case affordability",
    subsectionBody:
      "Test scenarios with temporary income dip, higher rates, or delayed bonus. A robust loan choice should remain manageable without forcing high-interest short-term debt.",
    expertQuote:
      "The right EMI is the one you can pay comfortably in a bad quarter, not only in a good quarter.",
    expertSource: "Retail credit-risk and personal-finance planning practice",
    deepDive:
      "Compare two structures: lower EMI/longer tenure vs higher EMI/shorter tenure. Evaluate the tradeoff between monthly comfort and lifetime interest outgo.",
    comparisonA: "Lower EMI, longer tenure",
    comparisonB: "Higher EMI, shorter tenure",
    factor1A: "Cash-flow comfort in near term",
    factor1B: "Lower total interest over lifecycle",
    factor2A: "Higher long-run interest burden",
    factor2B: "Needs stronger monthly discipline",
    application:
      "After selecting baseline structure, run optimization checks for annual prepayment and transfer break-even to reduce total borrowing cost.",
    appStep1Action: "Set affordability cap and run baseline EMI",
    appStep1Detail:
      "Define safe monthly commitment first, then evaluate loan amount and tenure around that cap.",
    appStep2Action: "Model optimization scenarios",
    appStep2Detail:
      "Test prepayment cadence, transfer costs, and revised-tenure outcomes before final decision.",
    conclusion:
      "Loan optimization is most effective when affordability and risk discipline are locked first. Cost savings then become sustainable and repeatable.",
    references: [
      "RBI borrower communication and lending transparency guidelines",
      "Bank/NBFC product terms for tenure, fees, and foreclosure",
      "Household cash-flow planning frameworks",
    ],
    difficulty: "Beginner to Intermediate",
    timeRequired: "20-35 minutes",
    needs: [
      "Income and fixed-expense details",
      "Current and proposed loan terms",
      "Fee structure and prepayment policy",
    ],
    overview:
      "This guide helps you move from raw eligibility to an actionable and resilient borrowing plan.",
    beforeStart: [
      "Estimate safe EMI under conservative assumptions",
      "Collect lender terms including fees and penalties",
      "List expected surplus for annual prepayment",
    ],
    howStep1Title: "Run baseline affordability scenario",
    howStep1Detail:
      "Calculate EMI, total interest, and repayment timeline using realistic income and obligations.",
    howTip: "Tip: Keep emergency corpus assumptions separate from EMI budget.",
    howStep2Title: "Test cost-reduction options",
    howStep2Detail:
      "Compare prepayment and transfer scenarios with fee-adjusted net savings.",
    howWarning:
      "Warning: A lower quoted rate is not enough; include all switching and processing costs.",
    howStep3Title: "Finalize structure and monitor quarterly",
    howStep3Detail:
      "Lock the preferred path and review after major rate moves or income changes.",
    troubleshooting: [
      {
        problem: "EMI is affordable but total interest is too high",
        solution:
          "Increase EMI modestly or add annual prepayment schedule to shorten effective tenure.",
      },
      {
        problem: "Balance transfer shows unclear benefit",
        solution:
          "Recalculate with full transfer costs and remaining tenure; accept only clear net gain.",
      },
    ],
    nextSteps: [
      "Create a prepayment calendar based on bonus and variable income",
      "Revisit assumptions after major policy-rate or income changes",
    ],
    faq: [
      {
        question: "Is minimum EMI always the best choice?",
        answer:
          "Not always. Lower EMI improves short-term comfort but usually increases lifetime interest.",
      },
      {
        question: "How often should I re-evaluate loan strategy?",
        answer:
          "Quarterly or after significant rate changes, salary shifts, or large one-time surplus.",
      },
    ],
    readMinutes: 8,
  },
  investment: {
    articleSubtitle:
      "Goal-based investing, risk balance, and post-tax outcomes",
    executiveSummary:
      "Strong investing outcomes come from contribution discipline and allocation quality, not return chasing.",
    introduction:
      "Investment planning improves when you connect goal timeline, contribution rhythm, and post-tax return quality. This structure helps translate product choices into a realistic wealth path.",
    foundation:
      "Define objective first: safety, growth, or income. Then choose instruments and contribution approach that align with liquidity needs and risk tolerance.",
    subsectionTitle: "Subsection: Contribution behavior as alpha",
    subsectionBody:
      "In long horizons, regular investing and timely step-up often matter more than perfect entry timing. Consistency compounds better than sporadic optimization.",
    expertQuote: "Process beats prediction in long-duration wealth creation.",
    expertSource: "Evidence-backed personal investing practice",
    deepDive:
      "Compare stability-heavy and growth-heavy allocations under conservative, base, and optimistic assumptions to understand drawdown comfort and target reliability.",
    comparisonA: "Stability-first mix",
    comparisonB: "Growth-first mix",
    factor1A: "Lower volatility, slower compounding",
    factor1B: "Higher upside, larger interim swings",
    factor2A: "Better short-term liquidity comfort",
    factor2B: "Requires stronger behavioral discipline",
    application:
      "Implement with periodic contribution review, step-up planning, and annual rebalancing so your portfolio stays aligned with goals and risk profile.",
    appStep1Action: "Set target corpus and timeline",
    appStep1Detail:
      "Translate goals into monthly/annual contribution requirements using realistic return ranges.",
    appStep2Action: "Design allocation and review rhythm",
    appStep2Detail:
      "Choose instrument mix and set quarterly review checkpoints for contribution and risk drift.",
    conclusion:
      "Investment success is a systems outcome. If your process is disciplined and review-driven, returns become a byproduct of consistency.",
    references: [
      "SEBI investor education and mutual-fund risk frameworks",
      "Long-horizon compounding and allocation research",
      "Tax-treatment rules for key savings and investment instruments",
    ],
    difficulty: "Beginner to Intermediate",
    timeRequired: "25-40 minutes",
    needs: [
      "Goal amount and target timeline",
      "Current monthly/annual investable surplus",
      "Tax-slab and liquidity requirements",
    ],
    overview:
      "This guide helps you design a practical investment workflow from baseline projection to execution discipline.",
    beforeStart: [
      "Separate emergency corpus from long-term investing pool",
      "Define goal priority and expected timeline",
      "Set conservative and base return assumptions",
    ],
    howStep1Title: "Build baseline projection",
    howStep1Detail:
      "Estimate corpus trajectory using current contribution and realistic return assumptions.",
    howTip:
      "Tip: Use step-up contribution assumptions linked to salary growth.",
    howStep2Title: "Layer risk and tax filters",
    howStep2Detail:
      "Check post-tax outcomes, lock-in constraints, and liquidity needs before final allocation.",
    howWarning:
      "Warning: Do not compare instruments only on headline return without tax and liquidity context.",
    howStep3Title: "Automate and review",
    howStep3Detail:
      "Set contribution automation and re-evaluate assumptions quarterly or after major life events.",
    troubleshooting: [
      {
        problem: "Target corpus looks unattainable",
        solution:
          "Increase contribution rate gradually, extend timeline, or adjust return-risk expectations.",
      },
      {
        problem: "Plan breaks during volatile markets",
        solution:
          "Use rule-based contribution and rebalance framework to reduce emotional decisions.",
      },
    ],
    nextSteps: [
      "Create annual step-up plan and checkpoint dates",
      "Add withdrawal-phase modeling for long-term goals",
    ],
    faq: [
      {
        question: "Should I prioritize SIP or lumpsum?",
        answer:
          "It depends on cash availability and behavior. A disciplined SIP workflow works well for most users.",
      },
      {
        question: "How frequently should I rebalance?",
        answer:
          "Annual rebalance is common, with interim review after large allocation drifts.",
      },
    ],
    readMinutes: 8,
  },
  trading: {
    articleSubtitle: "Risk-adjusted execution and net-P&L discipline",
    executiveSummary:
      "Trading decisions improve when risk sizing and charge modeling are done before order execution.",
    introduction:
      "Gross setup quality is only part of trading performance. Net profitability is shaped by turnover, charges, slippage, and position-size discipline. This structure focuses on that complete execution picture.",
    foundation:
      "Fix risk per trade first, then derive quantity/lot size. Next, estimate STT, brokerage, and other costs to validate whether net reward remains attractive.",
    subsectionTitle: "Subsection: Net-P&L realism",
    subsectionBody:
      "Evaluate setups on contract-note-style net outcomes, not optimistic gross assumptions. This improves strategy survival over larger sample sizes.",
    expertQuote: "Your system is only as good as its post-cost expectancy.",
    expertSource: "Systematic trading-risk management practice",
    deepDive:
      "Compare high-turnover and selective-trade styles under charge-heavy and charge-efficient broker assumptions to understand structural edge.",
    comparisonA: "Higher turnover style",
    comparisonB: "Selective setup style",
    factor1A: "More opportunities, higher cost drag",
    factor1B: "Fewer trades, tighter quality filter",
    factor2A: "Needs very strong execution edge",
    factor2B: "Lower friction on net expectancy",
    application:
      "Use calculators as a pre-trade checklist: risk cap, charge forecast, break-even, and scenario pass/fail before placing orders.",
    appStep1Action: "Define per-trade risk and size",
    appStep1Detail:
      "Set rupee risk ceiling and derive lot/quantity from stop distance and volatility context.",
    appStep2Action: "Validate net break-even",
    appStep2Detail:
      "Estimate all charges and confirm that expected move still leaves healthy net reward.",
    conclusion:
      "When risk and cost control become automatic, strategy quality is easier to evaluate and scale.",
    references: [
      "SEBI and exchange guidance on trading cost components",
      "Broker contract-note charge structures and disclosures",
      "Position-sizing and expectancy-based risk management frameworks",
    ],
    difficulty: "Intermediate",
    timeRequired: "20-30 minutes",
    needs: [
      "Instrument details (segment, lot size, turnover assumptions)",
      "Entry/exit plan with stop and target context",
      "Broker charge structure for realistic cost estimation",
    ],
    overview:
      "This guide gives a repeatable pre-trade process to evaluate risk and net profitability before execution.",
    beforeStart: [
      "Define per-trade risk in rupees",
      "Collect segment-wise charge assumptions",
      "Set realistic slippage range by instrument",
    ],
    howStep1Title: "Calculate risk-based position size",
    howStep1Detail:
      "Use stop distance and allowed risk to determine lot size or quantity.",
    howTip:
      "Tip: Keep risk per trade fixed across setups to improve performance consistency.",
    howStep2Title: "Compute all-in charges and break-even",
    howStep2Detail:
      "Add STT and brokerage impact before confirming setup viability.",
    howWarning:
      "Warning: Ignoring costs can turn positive gross expectancy into negative net expectancy.",
    howStep3Title: "Execute only if net reward is acceptable",
    howStep3Detail:
      "Proceed only when post-cost reward-to-risk remains within your strategy rules.",
    troubleshooting: [
      {
        problem: "Good hit-rate but weak net returns",
        solution:
          "Reduce turnover, improve setup filter quality, or optimize charge structure.",
      },
      {
        problem: "Frequent drawdown spikes",
        solution:
          "Re-check position sizing discipline and stop-loss execution consistency.",
      },
    ],
    nextSteps: [
      "Track gross vs net expectancy over rolling sample windows",
      "Audit broker-plan fit based on your actual turnover profile",
    ],
    faq: [
      {
        question: "Should I evaluate strategy on gross returns?",
        answer:
          "No. Use post-cost net returns for realistic decision-making and long-term sustainability.",
      },
      {
        question: "How often should I revisit cost assumptions?",
        answer:
          "Monthly is practical, and immediately after regulatory, exchange, or broker pricing changes.",
      },
    ],
    readMinutes: 10,
  },
  general: {
    articleSubtitle:
      "Decision quality, scenario planning, and execution clarity",
    executiveSummary:
      "A financial tool is most useful when it converts uncertainty into a repeatable decision workflow.",
    introduction:
      "Numbers become actionable when they are tied to assumptions, tradeoffs, and practical next steps. This framework helps you move from calculation to implementation with fewer blind spots.",
    foundation:
      "Define objective, constraints, and timeline before trusting any output. A clear problem statement produces better inputs and better decisions.",
    subsectionTitle: "Subsection: Scenario-based decision quality",
    subsectionBody:
      "Use at least two scenarios (conservative and realistic) so your plan remains robust under changing conditions.",
    expertQuote:
      "Good decisions come from good assumptions, not perfect predictions.",
    expertSource: "Applied personal-finance planning practice",
    deepDive:
      "Compare convenience-first and optimization-first approaches based on effort, confidence, and expected outcome quality.",
    comparisonA: "Convenience-first",
    comparisonB: "Optimization-first",
    factor1A: "Fast but less precise",
    factor1B: "Better outcomes with higher analysis effort",
    factor2A: "Lower planning friction",
    factor2B: "Higher confidence in execution",
    application:
      "Translate result into next actions, deadlines, and review cadence so the output does not remain a one-time estimate.",
    appStep1Action: "Clarify objective and baseline",
    appStep1Detail:
      "Set target and constraints explicitly before finalizing assumptions.",
    appStep2Action: "Convert output into action plan",
    appStep2Detail:
      "Decide what to do, when to do it, and what to monitor after implementation.",
    conclusion:
      "Consistent financial progress usually comes from structured decisions repeated over time, not one-off optimization events.",
    references: [
      "Regulatory and policy sources relevant to the decision",
      "Institutional product disclosures and contract notes",
      "Household budgeting and risk-management best practices",
    ],
    difficulty: "Beginner",
    timeRequired: "15-25 minutes",
    needs: [
      "Clear objective and timeline",
      "Current financial inputs and constraints",
      "At least one conservative assumption set",
    ],
    overview:
      "This guide provides a practical sequence to move from tool output to executable action.",
    beforeStart: [
      "Define what success looks like for this decision",
      "Collect current numbers from reliable sources",
      "Set conservative fallback assumptions",
    ],
    howStep1Title: "Run baseline calculation",
    howStep1Detail:
      "Enter realistic starting inputs and generate the first scenario.",
    howTip: "Tip: Save the baseline result and compare changes incrementally.",
    howStep2Title: "Run alternative scenarios",
    howStep2Detail:
      "Change key assumptions and observe impact on result quality and risk.",
    howWarning:
      "Warning: Single-scenario planning can hide downside risk and overstate confidence.",
    howStep3Title: "Finalize implementation plan",
    howStep3Detail:
      "Choose the preferred scenario and define review checkpoints.",
    troubleshooting: [
      {
        problem: "Output feels unrealistic",
        solution:
          "Audit key inputs and assumptions, then re-run with validated data.",
      },
      {
        problem: "Unable to decide between scenarios",
        solution:
          "Prioritize downside protection and execution simplicity when outcomes are close.",
      },
    ],
    nextSteps: [
      "Document your chosen assumptions and decision reason",
      "Set a review reminder to update after major changes",
    ],
    faq: [
      {
        question: "How many scenarios are enough?",
        answer: "At minimum, use one conservative and one realistic scenario.",
      },
      {
        question: "When should I revisit the plan?",
        answer:
          "Review quarterly or immediately after major income, cost, or policy changes.",
      },
    ],
    readMinutes: 7,
  },
}

export function ToolLongformHowTo({
  toolName,
  category,
  updated,
  author = "Rajat",
  className,
}: ToolLongformHowToProps) {
  const preset = presets[category]

  return (
    <section className={cn("space-y-10", className)}>
      <article className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "34px",
            letterSpacing: "normal",
            lineHeight: 1.12,
          }}
        >
          {toolName}: {preset.articleSubtitle}
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          <strong>Author:</strong> {author} | <strong>Updated:</strong>{" "}
          {updated}
          {" | "}
          <strong>{preset.readMinutes} min read</strong>
        </p>

        <blockquote className="mt-4 rounded-xl border border-border bg-secondary/35 p-4 text-sm text-foreground">
          {preset.executiveSummary}
        </blockquote>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Table of Contents
        </h3>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Section 1: Foundation</li>
          <li>Section 2: Deep Dive</li>
          <li>Section 3: Application</li>
        </ol>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Introduction
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.introduction}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Section 1: Foundation
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.foundation}
        </p>

        <h4 className="mt-4 text-base font-semibold text-foreground">
          {preset.subsectionTitle}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {preset.subsectionBody}
        </p>

        <blockquote className="mt-4 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Expert Quote:</strong> "
          {preset.expertQuote}"{" — "}
          {preset.expertSource}
        </blockquote>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Section 2: Deep Dive
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.deepDive}
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-secondary/50 text-xs text-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Comparison</th>
                <th className="px-4 py-3 font-medium">Option A</th>
                <th className="px-4 py-3 font-medium">Option B</th>
              </tr>
            </thead>
            <tbody className="divide-y border-border">
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Approach
                </td>
                <td className="px-4 py-3">{preset.comparisonA}</td>
                <td className="px-4 py-3">{preset.comparisonB}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Factor 1
                </td>
                <td className="px-4 py-3">{preset.factor1A}</td>
                <td className="px-4 py-3">{preset.factor1B}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Factor 2
                </td>
                <td className="px-4 py-3">{preset.factor2A}</td>
                <td className="px-4 py-3">{preset.factor2B}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Section 3: Application
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.application}
        </p>

        <p className="mt-4 text-sm text-foreground">
          <strong>Step 1:</strong> {preset.appStep1Action}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {preset.appStep1Detail}
        </p>

        <p className="mt-3 text-sm text-foreground">
          <strong>Step 2:</strong> {preset.appStep2Action}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {preset.appStep2Detail}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Conclusion
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.conclusion}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          References
        </h3>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {preset.references.map((reference) => (
            <li key={reference}>{reference}</li>
          ))}
        </ol>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "34px",
            letterSpacing: "normal",
            lineHeight: 1.12,
          }}
        >
          How to Use {toolName}: A Step-by-Step Guide
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          <strong>Difficulty:</strong> {preset.difficulty}
          {" | "}
          <strong>Time Required:</strong> {preset.timeRequired}
          {" | "}
          <strong>What You'll Need:</strong> {preset.needs.join(", ")}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">Overview</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.overview}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Before You Start
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {preset.beforeStart.map((item) => (
            <li key={item}>[ ] {item}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Step 1: {preset.howStep1Title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.howStep1Detail}
        </p>

        <div className="mt-3 rounded-xl border border-dashed border-border bg-secondary/25 p-4 text-xs text-muted-foreground">
          Step 1 Screenshot / Image Placeholder
        </div>

        <p className="mt-3 text-sm text-foreground">
          <strong>Tip:</strong> {preset.howTip.replace(/^Tip:\s*/, "")}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Step 2: {preset.howStep2Title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.howStep2Detail}
        </p>
        <p className="mt-3 text-sm text-foreground">
          ⚠️ <strong>Warning:</strong>{" "}
          {preset.howWarning.replace(/^Warning:\s*/, "")}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Step 3: {preset.howStep3Title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preset.howStep3Detail}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Troubleshooting
        </h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-secondary/50 text-xs text-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Problem</th>
                <th className="px-4 py-3 font-medium">Solution</th>
              </tr>
            </thead>
            <tbody className="divide-y border-border">
              {preset.troubleshooting.map((row) => (
                <tr key={row.problem}>
                  <td className="px-4 py-3 text-foreground">{row.problem}</td>
                  <td className="px-4 py-3">{row.solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Next Steps
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Now that you've completed this workflow, you can:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {preset.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-xl font-semibold text-foreground">FAQ</h3>
        {preset.faq.map((item) => (
          <div key={item.question} className="mt-3 text-sm leading-relaxed">
            <p className="text-foreground">
              <strong>Q:</strong> {item.question}
            </p>
            <p className="mt-1 text-muted-foreground">
              <strong>A:</strong> {item.answer}
            </p>
          </div>
        ))}
      </article>
    </section>
  )
}
