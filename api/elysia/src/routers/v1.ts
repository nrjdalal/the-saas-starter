import { Elysia } from "elysia"

import { authMiddleware } from "@/middlewares/auth"

export const v1Router = new Elysia({ prefix: "/v1" })
  .use(authMiddleware)
  .get("/session", ({ session }) => session)
  .get("/user", ({ user }) => user)
