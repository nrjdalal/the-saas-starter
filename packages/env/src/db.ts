import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"
import "./utils"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    POSTGRES_URL: z.url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_URL: process.env.INTERNAL_API_URL
      ? process.env.POSTGRES_URL?.replace("localhost", "host.docker.internal")
      : process.env.POSTGRES_URL,
  },
  emptyStringAsUndefined: true,
})
