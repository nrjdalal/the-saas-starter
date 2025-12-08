import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"

import { auth } from "@/lib/auth"

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession()

  if (!session) {
    throw redirect({ to: "/" })
  }

  return await next()
})
