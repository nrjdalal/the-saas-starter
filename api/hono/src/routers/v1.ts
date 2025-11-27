import { Hono } from "hono"

import type { Variables } from "@/types"

import { authMiddleware } from "@/middlewares/auth"

const app = new Hono<{
  Variables: Variables
}>()

app.use("/*", authMiddleware)

export const v1Router = app
  .get("/session", (c) => {
    const session = c.get("session")
    return c.json(session)
  })
  .get("/user", (c) => {
    const user = c.get("user")
    return c.json(user)
  })
