interface SeoConfig {
  title: string
  description: string
  path: string
  type?: "website" | "article"
  image?: string
  keywords?: Array<string>
}

export function generateSeoMeta({
  title,
  description,
  path,
  type = "website",
  image,
  keywords,
}: SeoConfig) {
  const baseUrl = "https://financechk.com"
  const url = `${baseUrl}${path === "/" ? "" : path}`
  const finalTitle = title.includes("FinanceChk")
    ? title
    : `${title} | FinanceChk`

  // In a real production setup, we'd use a dynamic Vercel OG endpoint
  // For now, we use a structured path that can be mapped to static assets
  const ogImage = image || `${baseUrl}/og${path === "/" ? "/main" : path}.png`

  const meta = [
    { title: finalTitle },
    { name: "description", content: description },
    ...(keywords && keywords.length > 0
      ? [{ name: "keywords", content: keywords.join(", ") }]
      : []),
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:title", content: finalTitle },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: url },
    { name: "twitter:title", content: finalTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "Rajat Das" },
  ]

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  }
}
