import { getSafeEnv } from "@packages/env"
import { defineConfig } from "tsdown"

export default [
  defineConfig({
    entry: ["src/index.ts"],
    minify: true,
    hooks: {
      "build:prepare": () => {
        getSafeEnv()
      },
    },
  }),
]
