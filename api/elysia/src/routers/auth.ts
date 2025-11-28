import { auth } from "@packages/auth"
import { Elysia } from "elysia"
import { z } from "zod"

export const authRouter = new Elysia({ prefix: "/auth" })
  .get(
    "/get-session",
    async ({ request, query }) => {
      const session = await auth.api.getSession({
        headers: request.headers,
      })

      if (!session) return null

      const { select } = query

      if (!select) return session

      const selections = select
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      if (selections.length === 1) {
        const key = selections[0]
        if (key === "session") return session.session
        if (key === "user") return session.user
      }

      const result: Partial<typeof session> = {}

      for (const key of selections) {
        if (key === "session") result.session = session.session
        if (key === "user") result.user = session.user
      }

      return result
    },
    {
      query: z.object({
        select: z.string().optional(),
      }),
    },
  )
  .all("/*", ({ request }) => auth.handler(request))
