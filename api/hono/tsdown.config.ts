import { defineConfig } from "tsdown"

export default [
  defineConfig({
    entry: ["src/index.ts"],
    minify: true,
    noExternal: ["@packages/auth", "@packages/db", "@packages/env"],
    hooks: {
      "build:prepare": async () => {
        const { getSafeEnv } = await import("@packages/env")
        const { env } = await import("@packages/env/api-hono")
        getSafeEnv(env)
      },
    },
  }),
]
