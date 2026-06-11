import { cn } from "@/lib/utils"

interface ResultGridProps {
  children: React.ReactNode
  cols?: 2 | 3 | 4
  className?: string
}

export function ResultGrid({ children, cols = 3, className }: ResultGridProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}
