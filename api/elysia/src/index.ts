import { authRouter, v1Router } from "@/routers"
import { cors } from "@elysiajs/cors"
import { openapi } from "@elysiajs/openapi"
import { env } from "@packages/env"
import { Elysia } from "elysia"

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: env.HONO_TRUSTED_ORIGINS,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use(openapi())
  .get("/health", () => "OK")
  .use(authRouter)
  .use(v1Router)
  .listen(4001)

export type App = typeof app

export default app
