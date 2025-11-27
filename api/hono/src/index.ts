import { Hono } from "hono"
import { cors } from "hono/cors"

import { logger } from "hono/logger"
import { authRouter } from "@/routers/auth"

const app = new Hono().basePath("/api")

app.use(logger())

app.use(
  "/auth/*",
  cors({
    origin: process.env.HONO_PUBLIC_ORIGINS ? process.env.HONO_PUBLIC_ORIGINS.split(",") : [],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
)

const routes = app
  .get("/health", (c) => {
    return c.text("OK")
  })
  .route("/auth", authRouter)

export type { User, Session } from "@/lib/auth"
export type AppType = typeof routes

export default {
  port: 4000,
  fetch: app.fetch,
}
