interface LastUpdatedProps {
  date: string
  author?: string
}

export function LastUpdated({ date, author }: LastUpdatedProps) {
  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
      <span>Updated: {date}</span>
      {author && (
        <>
          <span className="text-muted-foreground/30">·</span>
          <span>By {author}</span>
        </>
      )}
    </div>
  )
}
