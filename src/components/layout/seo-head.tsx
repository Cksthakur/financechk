interface SeoHeadProps {
  title: string
  description: string
  path: string
  ogType?: "website" | "article"
  ogImage?: string
}

export function SeoHead({
  title,
  description,
  path,
  ogType = "website",
  ogImage,
}: SeoHeadProps) {
  const baseUrl = "https://financechk.com"
  const url = `${baseUrl}${path === "/" ? "" : path}`

  // Default OG image if none provided
  // In a real production setup, this would point to a dynamic Vercel OG endpoint
  // e.g., `${baseUrl}/api/og?title=${encodeURIComponent(title)}`
  const finalOgImage = ogImage || `${baseUrl}/og-main.png`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Search Engine Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Rajat Das" />

      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en-IN" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </>
  )
}
