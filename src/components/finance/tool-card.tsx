import { Link } from "@tanstack/react-router"
import { IconArrowRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  category: string
  className?: string
}

export function ToolCard({
  title,
  description,
  href,
  icon,
  category,
  className,
}: ToolCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative flex flex-col rounded-2xl bg-card p-6 transition-all hover:-translate-y-0.5",
        className
      )}
      style={{
        boxShadow:
          "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
        transitionDuration: "var(--fc-duration)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
          {icon}
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {category}
        </span>
      </div>
      <h3 className="mb-2 text-base leading-snug font-semibold text-foreground">
        {title}
      </h3>
      <p
        className="text-muted-foreground"
        style={{ fontSize: "16px", lineHeight: 1.5, letterSpacing: "0.16px" }}
      >
        {description}
      </p>
      <div className="mt-auto flex items-center gap-1 pt-4">
        <span
          className="text-[15px] font-medium text-foreground"
          style={{ letterSpacing: "0.15px" }}
        >
          Open tool
        </span>
        <IconArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
