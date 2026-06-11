import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const resultCardVariants = cva("rounded-2xl p-5 transition-all", {
  variants: {
    variant: {
      default: "bg-secondary",
      gain: "bg-fc-gain-bg",
      loss: "bg-fc-loss-bg",
      neutral: "bg-secondary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface ResultCardProps extends VariantProps<typeof resultCardVariants> {
  label: string
  value: string
  subtitle?: string
  className?: string
}

export function ResultCard({
  label,
  value,
  subtitle,
  variant,
  className,
}: ResultCardProps) {
  return (
    <div className={cn(resultCardVariants({ variant }), className)}>
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-mono text-2xl font-bold",
          variant === "gain" && "text-fc-gain-text",
          variant === "loss" && "text-fc-loss-text",
          (!variant || variant === "default" || variant === "neutral") &&
            "text-foreground"
        )}
        style={{ letterSpacing: "-0.04em" }}
      >
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
