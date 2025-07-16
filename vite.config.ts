import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import basicSsl from "@vitejs/plugin-basic-ssl"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import MsClarity from "vite-plugin-ms-clarity"
import VueRouter from "unplugin-vue-router/vite"
import { getFileBasedRouteName, VueRouterAutoImports } from "unplugin-vue-router"

const env = process.env
const isProd = env.NODE_ENV === "production"

/** @type {import("vite").UserConfig} */
const config = {
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:6677",
        changeOrigin: false, // true表示使用前端访问的地址
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
            return excluded.concat(Array.from({ length: 26 }, (_, i) => `**/${String.fromCharCode(65 + i)}*`))
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
      extendRoute: async (route) => {
        // ...
      },

      // modify routes before writing
      beforeWriteFiles: async (rootRoute) => {
        // ...
      },
    }),
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        "vue",
        "pinia",
        VueRouterAutoImports,
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
            "useThemeVars",
            "NButton",
            "NCheckbox",
            "NDropdown",
            "NFlex",
            "NProgress",
            "NSpace",
            "NSwitch",
            "NText",
            "NTooltip",
            "NInput",
            "NIcon",
            "NImage",
          ],
          "vue-router": ["RouterLink"],
        },
        {
          from: "naive-ui",
          imports: ["MenuOption", "PaginationProps", "FormInst", "FormItemRule", "UploadFileInfo", "DataTableColumns"],
          type: true,
        },
        {
          from: "naive-ui/es/data-table/src/interface",
          imports: ["TableColumn"],
          type: true,
        },
        {
          from: "vue",
          imports: ["HTMLAttributes", "WatchStopHandle"],
          type: true,
        },
      ],
      dirs: ["./src/api", "./src/hooks", "./src/utils", "./src/stores", "./src/types"],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      globs: ["./src/components/**/*.vue"],
    }),
    basicSsl(),
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
        entryFileNames: "js/entry-[name]-[hash].js",
        chunkFileNames: "js/chunk-[name]-[hash].js",
        assetFileNames: (chunkInfo) => {
          const name: string = chunkInfo.names?.[0]
          const extnamesForPrefix = {
            "css/": [".css"],
            "js/": [".js"],
            "img/": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"],
            "font/": [".woff", ".woff2", ".ttf", ".eot", ".otf"],
            "media/": [".mp3", ".mp4", ".webm", ".ogg", ".wav", ".flac"],
            "assets/": [".wasm"],
          }

          for (const [prefix, extnames] of Object.entries(extnamesForPrefix)) {
            if (extnames.some((ext) => name.endsWith(ext))) {
              return `${prefix}[name]-[hash][extname]`
            }
          }
          console.warn(`Unknown asset type: ${name}`, JSON.stringify(chunkInfo).slice(0, 100))
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
    exclude: ["@undecaf/zbar-wasm"],
  },
}

if (isProd) {
  // 微软 Clarity 分析
  if (!env.VITE_CLARITY_ID) {
    console.warn("Clarity ID is not set, Clarity will be disabled.")
  } else {
    config.plugins.push(MsClarity({ id: env.VITE_CLARITY_ID as string, enableInDevMode: false }))
  }
}

export default defineConfig(config)
