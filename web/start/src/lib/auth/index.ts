import type { Session } from "@packages/auth"
import { getRequest } from "@tanstack/react-start/server"

import { apiClient } from "@/lib/api/client"

export const auth = {
  api: {
    getSession: async () => {
      const response = await apiClient.auth["get-session"].$get(
        {},
        {
          headers: Object.fromEntries(getRequest().headers.entries()),
        },
      )
      return response.json() as Promise<Session | null>
    },
  },
}
