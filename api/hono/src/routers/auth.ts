import { Hono } from "hono"
import { auth } from "@/lib/auth"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

export const authRouter = new Hono()
  .get(
    "/get-session",
    zValidator(
      "query",
      z.object({
        select: z.string().optional(),
      }),
    ),
    async (c) => {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      })

      if (!session) return c.json(null)

      const { select } = c.req.valid("query")

      if (!select) return c.json(session)

      const selections = select
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const result: Partial<typeof session> = {}

      for (const key of selections) {
        if (key === "user") {
          result.user = session.user
        }

        if (key === "session") {
          result.session = session.session
        }
      }

      return c.json(result)
    },
  )
  .on(["GET", "POST"], "/*", (c) => auth.handler(c.req.raw))
