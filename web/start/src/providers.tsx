import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "sonner"

import DevTools from "@/components/devtools"

export function getContext() {
  const queryClient = new QueryClient()
  return {
    queryClient,
  }
}

export function OuterProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <DevTools />}
    </QueryClientProvider>
  )
}

export function InnerProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors />
    </NextThemesProvider>
  )
}
