import { useCallback, useEffect, useId, useState } from "react"
import { cva } from "class-variance-authority"
import { Input } from "@/components/ui/input"
import { formatIndianNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  variant?: "sm" | "md" | "lg"
  currency?: "INR" | "USD"
  placeholder?: string
}

// size variants: sm, md, lg

const inputVariants = cva("h-11 rounded-xl pl-8 text-right font-mono text-sm", {
  variants: {
    size: {
      sm: "h-9.5",
      md: "h-11",
      lg: "h-12",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

export function CurrencyInput({
  label,
  value,
  onChange,
  min = 0,
  max = 99_99_99_999,
  className,
  variant = "sm",
  currency = "INR",
  placeholder,
}: CurrencyInputProps) {
  const id = useId()
  const currencySymbol = currency === "USD" ? "$" : "₹"

  const formatFn =
    currency === "USD"
      ? (v: number) => v.toLocaleString("en-US")
      : formatIndianNumber

  const [displayValue, setDisplayValue] = useState(() => formatFn(value))
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatFn(value))
    }
  }, [value, isFocused, formatFn])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    const cleaned = displayValue.replace(/[^0-9]/g, "")
    const parsed = parseFloat(cleaned) || 0
    const clamped = Math.max(min, Math.min(max, parsed))
    onChange(clamped)
    setDisplayValue(formatFn(clamped))
  }, [displayValue, min, max, onChange, formatFn])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    setDisplayValue(raw)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleBlur()
      }
    },
    [handleBlur]
  )

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-foreground",
          variant === "sm" && "text-xs",
          variant === "lg" && "text-base"
        )}
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 font-mono text-sm text-muted-foreground">
          {currencySymbol}
        </span>
        <Input
          id={id}
          type="text"
          value={displayValue}
          placeholder={placeholder || currencySymbol}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={inputVariants({ size: variant })}
          inputMode="numeric"
        />
      </div>
    </div>
  )
}
