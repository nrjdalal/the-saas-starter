import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"
import "./utils"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    HONO_APP_URL: z.url(),
    HONO_TRUSTED_ORIGINS: z
      .string()
      .transform((s) => s.split(",").map((v) => v.trim()))
      .pipe(z.array(z.url())),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    HONO_APP_URL: process.env.HONO_APP_URL,
    HONO_TRUSTED_ORIGINS: process.env.HONO_TRUSTED_ORIGINS,
  },
  emptyStringAsUndefined: true,
})
