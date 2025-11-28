import { auth } from "@packages/auth"
import { Elysia } from "elysia"

export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ request, status }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) throw status(401, { message: "Unauthorized" })

    return {
      session: session.session,
      user: session.user,
    }
  })
