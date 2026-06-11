import { useState } from "react"
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconPrinter,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { usePrint } from "@/hooks/usePrint"

interface GeneratorActionsProps {
  title: string
  content: string
  fileName: string
  className?: string
}

function sanitizeFileName(fileName: string): string {
  const safe = fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, "-")
    .replace(/-+/g, "-")
  return safe || "generated-draft.txt"
}


export function GeneratorActions({
  title,
  content,
  fileName,
  className,
}: GeneratorActionsProps) {
  const [copied, setCopied] = useState(false)
  const print = usePrint()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error("Failed to copy generated content", error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = sanitizeFileName(fileName)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () =>
    print({
      title,
      content,
      isHtml: false,
    })

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold tracking-wide text-foreground uppercase transition-colors hover:bg-secondary"
      >
        {copied ? (
          <IconCheck className="size-3.5 text-fc-gain" />
        ) : (
          <IconCopy className="size-3.5" />
        )}
        {copied ? "Copied" : "Copy Draft"}
      </button>

      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold tracking-wide text-foreground uppercase transition-colors hover:bg-secondary"
      >
        <IconDownload className="size-3.5" />
        Download TXT
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold tracking-wide text-foreground uppercase transition-colors hover:bg-secondary"
      >
        <IconPrinter className="size-3.5" />
        Print / PDF
      </button>
    </div>
  )
}
