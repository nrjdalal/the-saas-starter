import { createEnv } from "@t3-oss/env-core"
import { config } from "dotenv"
import path from "node:path"
import { z } from "zod"

if (typeof window === "undefined") {
  try {
    config({ path: path.resolve(process.cwd(), "../../.env") })
  } catch (e) {
    console.error(e)
  }
}

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    BETTER_AUTH_SECRET: process.env.CI
      ? z.string().default("Generate using `openssl rand -base64 32`")
      : z.string().min(1),
    GITHUB_CLIENT_ID: process.env.CI
      ? z.string().default("Generate at `https://github.com/settings/developers`")
      : z.string().min(1),
    GITHUB_CLIENT_SECRET: process.env.CI
      ? z.string().default("Generate at `https://github.com/settings/developers`")
      : z.string().min(1),
    HONO_APP_URL: z.url().default("http://localhost:4000"),
    HONO_TRUSTED_ORIGINS: z
      .string()
      .default("http://localhost:3000")
      .transform((s) => s.split(",")),
    POSTGRES_URL: process.env.CI
      ? z.string().default("Generate using `bunx pglaunch -k`")
      : z.url(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_API_URL: z.url().default("http://localhost:4000"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export const getSafeEnv = () => {
  const redactKeys = ["db_url", "key", "password", "postgres_url", "secret", "token"]

  const result = Object.fromEntries(
    Object.entries(env).map(([key, value]) => {
      const isRedacted = redactKeys.some((redactKey) =>
        key.toLowerCase().includes(redactKey.toLowerCase()),
      )
      if (isRedacted) {
        return [key, "******** REDACTED ********"]
      }
      return [key, value]
    }),
  )
  console.log("@packages/env:getSafeEnv:", result)
  return result
}
