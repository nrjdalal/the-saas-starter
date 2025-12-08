import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import virtualNextRoutes from "virtual-next-routes"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    tsConfigPaths(),
    tailwindcss(),
    virtualNextRoutes(),
    tanstackStart({
      router: {
        routesDirectory: "app",
        virtualRouteConfig: "./routes",
      },
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
})

export default config
