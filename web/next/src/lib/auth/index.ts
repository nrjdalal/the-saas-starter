import { headers } from "next/headers"

import { honoClient } from "@/lib/api/client"

export const auth = {
  api: {
    getSession: async () => {
      const response = await honoClient.api.auth["get-session"].$get(
        {
          query: {},
        },
        {
          headers: Object.fromEntries((await headers()).entries()),
        },
      )
      return response.json()
    },
  },
}
