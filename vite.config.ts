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

/** @type {import('vite').UserConfig} */
const config = {
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
}

if (env.NODE_ENV === "production") {
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
