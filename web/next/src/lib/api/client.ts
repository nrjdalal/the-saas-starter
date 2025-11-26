import type { AppType } from "@api/hono"
import { hc } from "hono/client"

export const honoClient = hc<AppType>(process.env.NEXT_PUBLIC_API_URL as string, {
  init: {
    credentials: "include",
  },
})
