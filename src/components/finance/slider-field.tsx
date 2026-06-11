import { useId } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SliderFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  formatValue?: (value: number) => string
  className?: string
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit: _unit,
  formatValue,
  className,
}: SliderFieldProps) {
  const id = useId()
  const displayValue = formatValue ? formatValue(value) : value.toString()

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <Input
            id={id}
            type="text"
            value={displayValue}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, "")
              const num = parseFloat(raw)
              if (!isNaN(num)) {
                onChange(Math.min(max, Math.max(min, num)))
              }
            }}
            className="h-9 w-24 rounded-xl text-right font-mono text-sm"
          />
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(Array.isArray(vals) ? vals[0] : vals)}
        min={min}
        max={max}
        step={step}
      />
      <div className="flex justify-between text-xs text-muted-foreground/60">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  )
}
