import { InnerProvider } from "@/providers"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router"

import { NavbarHome } from "@/components/navbar/home"

import appCss from "./globals.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <InnerProvider>
          <NavbarHome />
          {children}
        </InnerProvider>
        <Scripts />
      </body>
    </html>
  )
}
