import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: Array<FAQItem>
  className?: string
}

export function FAQSection({ items, className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2
        className="text-lg font-semibold text-foreground"
        style={{ letterSpacing: "-0.01em" }}
      >
        Frequently Asked Questions
      </h2>
      <div
        className="rounded-2xl"
        style={{ boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={
              i < items.length - 1
                ? { borderBottom: "1px solid rgba(0,0,0,0.05)" }
                : undefined
            }
          >
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary/50"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span style={{ letterSpacing: "0.01em" }}>{item.question}</span>
              <IconChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  openIndex === i && "rotate-180"
                )}
              />
            </button>
            {openIndex === i && (
              <div
                className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
                style={{ letterSpacing: "0.01em" }}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
