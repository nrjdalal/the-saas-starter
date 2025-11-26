import { headers } from "next/headers"

import type { Session as AuthSession, User as AuthUser } from "@api/hono"

import { honoClient } from "@/lib/api/client"

export const auth = {
  api: {
    getSession: async (): Promise<{ user: AuthUser; session: AuthSession } | null> => {
      const response = await honoClient.api.auth["get-session"].$get(
        {
          query: {},
        },
        {
          headers: Object.fromEntries((await headers()).entries()),
        },
      )
      return response.json() as Promise<{ user: AuthUser; session: AuthSession } | null>
    },
  },
}
