import { defineConfig } from "tsdown"

export default [
  defineConfig({
    entry: ["src/index.ts"],
    minify: true,
  }),
  defineConfig({
    entry: ["src/web-next.ts"],
    outDir: "dist",
    minify: true,
  }),
  defineConfig({
    entry: ["src/api-hono.ts"],
    outDir: "dist",
    minify: true,
  }),
  defineConfig({
    entry: ["src/auth.ts"],
    outDir: "dist",
    minify: true,
  }),
  defineConfig({
    entry: ["src/db.ts"],
    outDir: "dist",
    minify: true,
  }),
]
