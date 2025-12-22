import { config } from "@/lib/config"
import { blogSource, docsSource } from "@/lib/source"

import blogMeta from "../../../content/blog/meta.json"
import docsMeta from "../../../content/docs/meta.json"

export const revalidate = false

function sortByMeta<T extends { url: string }>(pages: T[], order: string[], baseUrl: string): T[] {
  const getSlug = (url: string) => url.replace(baseUrl, "").replace(/^\//, "") || "index"
  return [...pages].sort((a, b) => {
    if (order.indexOf(getSlug(a.url)) === -1) return 1
    if (order.indexOf(getSlug(b.url)) === -1) return -1
    return order.indexOf(getSlug(a.url)) - order.indexOf(getSlug(b.url))
  })
}

export async function GET() {
  const pages = [
    ...sortByMeta(docsSource.getPages(), docsMeta.pages, "/docs"),
    ...sortByMeta(
      blogSource.getPages().filter((p) => p.url !== "/blog"),
      blogMeta.pages,
      "/blog",
    ),
  ]

  const scanned = await Promise.all(
    pages.map(async (page) => {
      let content: string
      try {
        content = await page.data.getText("processed")
      } catch {
        content = await page.data.getText("raw")
      }
      return `# [${page.data.title}](${config.app.url}${page.url})\n${content}`
    }),
  )

  return new Response(
    `# ${config.app.name}

> ${config.app.description}

${scanned.join("\n---\n\n")}`,
    {
      headers: {
        "Content-Type": "text/markdown",
      },
    },
  )
}
