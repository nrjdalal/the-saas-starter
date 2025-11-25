export const auth = {
  api: {
    getSession: async ({ headers }: { headers: Headers }) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
          headers,
          cache: "no-store",
        })
        if (!response.ok) {
          return null
        }
        return await response.json()
      } catch (error) {
        console.error("Failed to fetch session:", error)
        return null
      }
    },
  },
}
