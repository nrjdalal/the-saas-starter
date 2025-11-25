import type { AppType } from "@api/hono"
import { hc } from "hono/client"

const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL as string) as AppType & {
  api: {
    auth: {
      "get-session": {
        $get: (args: {}, init: { init: RequestInit }) => Promise<Response>
      }
    }
  }
}

export const auth = {
  api: {
    getSession: async ({ headers }: { headers: Headers }) => {
      try {
        const response = await client.api.auth["get-session"].$get(
          {},
          {
            init: {
              headers,
            },
          },
        )
        if (!response.ok) return null
        return await response.json()
      } catch (error) {
        console.error(error)
        return null
      }
    },
  },
}
