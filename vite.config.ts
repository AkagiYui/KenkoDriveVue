import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import MsClarity from "vite-plugin-ms-clarity"
import VueRouter from "unplugin-vue-router/vite"
import {
  getFileBasedRouteName,
  VueRouterAutoImports,
} from "unplugin-vue-router"
import { nodePolyfills } from "vite-plugin-node-polyfills"

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
    VueRouter({
      // 自动生成路由的文件夹
      routesFolder: [
        {
          src: "src/pages",
          path: "",
          // override globals
          exclude: (excluded) => {
            // 排除任何大写字母开头的文件与文件夹，因为它们通常是组件
            // 返回["**/A*", "**/B*", ...]
            return excluded.concat(
              Array.from(
                { length: 26 },
                (_, i) => `**/${String.fromCharCode(65 + i)}*`,
              ),
            )
          },
          filePatterns: (filePatterns) => filePatterns,
          extensions: (extensions) => extensions,
        },
      ],

      // 被作为页面的文件扩展名
      extensions: [".vue"],

      // 路径模式
      filePatterns: ["**/*"],

      // 排除的文件
      exclude: [],

      // 生成的类型声明文件
      dts: "./typed-router.d.ts",

      // 如何生成路由名称
      getRouteName: (routeNode) => getFileBasedRouteName(routeNode),

      // <route> 的默认语言
      routeBlockLang: "json5",

      // 同步或异步导入页面
      importMode: "async",

      // 相对于项目根目录的路径
      root: process.cwd(),

      // options for the path parser
      pathParser: {
        // should `users.[id]` be parsed as `users/:id`?
        dotNesting: true,
      },

      // modify routes individually
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      extendRoute: async (route) => {
        // ...
      },

      // modify routes before writing
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      beforeWriteFiles: async (rootRoute) => {
        // ...
      },
    }),
    nodePolyfills(),
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        "vue",
        VueRouterAutoImports,
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
    rollupOptions: {
      output: {
        manualChunks: (id: string): string | undefined => {
          // 从 node_modules 中引入的模块，按模块名称拆分
          if (id.includes("node_modules")) {
            const packagePath = id.split("node_modules/")[1].split("/")
            const first = packagePath[0]
            let name = first === ".pnpm" ? packagePath[1] : first
            if (name.startsWith("@")) {
              name = name.substring(1)
            }
            name = name.replace(".", "_")
            return "module-" + name.split("@")[0]
          }
        },
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (chunkInfo: any) => {
          if (chunkInfo.name.endsWith(".css")) {
            return "css/[name]-[hash][extname]"
          }
          if (chunkInfo.name.endsWith(".js")) {
            return "js/[name]-[hash][extname]"
          }
          const imgExts = [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".svg",
            ".webp",
            ".ico",
          ]
          if (imgExts.some((ext) => chunkInfo.name.endsWith(ext))) {
            return "img/[name]-[hash][extname]"
          }
          return "assets/[name]-[hash][extname]"
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "monaco-editor/esm/vs/language/json/json.worker",
      "monaco-editor/esm/vs/language/css/css.worker",
      "monaco-editor/esm/vs/language/html/html.worker",
      "monaco-editor/esm/vs/language/typescript/ts.worker",
      "monaco-editor/esm/vs/editor/editor.worker",
    ],
  },
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
