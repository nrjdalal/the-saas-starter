import { defineConfig } from "tsdown"

const entries = [
  "src/index.ts",
  "src/api-hono.ts",
  "src/auth.ts",
  "src/db.ts",
  "src/web-next.ts",
] as const

export default entries.map((entry) =>
  defineConfig({
    entry: [entry],
    outDir: "dist",
    minify: true,
  }),
)
