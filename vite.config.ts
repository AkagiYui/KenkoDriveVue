import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import MsClarity from "vite-plugin-ms-clarity"

// eslint-disable-next-line no-undef
const env = process.env
const isProd = env.NODE_ENV === "production"

/** @type {import("vite").UserConfig} */
const config = {
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:6677",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    host: "0.0.0.0",
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(env.npm_package_version),
  },
  build: {
    minify: isProd ? "terser" : ("esbuild" as "esbuild" | "terser"),
    terserOptions: {
      compress: {
        keep_infinity: true, // 保持 Infinity 不变，否则会被当成 1/0，在Chrome中可能出现性能问题
        drop_console: true, // 删除 console
        drop_debugger: true, // 删除 debugger
      },
    },
  }
}

if (isProd) {
  // 微软 Clarity 分析
  if (!env.VITE_CLARITY_ID) {
    console.warn("Clarity ID is not set, Clarity will be disabled.")
  } else {
    config.plugins.push(
      MsClarity({ id: env.VITE_CLARITY_ID as string, enableInDevMode: false }),
    )
  }
}

export default defineConfig(config)
