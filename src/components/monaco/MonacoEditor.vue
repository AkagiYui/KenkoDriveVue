<script lang="ts" setup>
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import * as monaco from "monaco-editor"
import { getHighlighter } from "shiki"
import { shikiToMonaco } from "@shikijs/monaco"

const content = defineModel<string>("content", { default: "" })

const {
  language = "plaintext",
  readOnly = true,
  minimap = false,
  dark = false,
  options = {},
} = defineProps<{
  language?: string
  readOnly?: boolean
  minimap?: boolean
  dark?: boolean
  options?: any
}>()

const emits = defineEmits<{
  (e: "change", value: string): void
  (e: "editor-mounted", editor: monaco.editor.IStandaloneCodeEditor): void
}>()

const theme = computed(() => {
  return dark ? "vitesse-dark" : "vitesse-light"
})
watch(theme, () => monaco.editor.setTheme(theme.value))

const textLanguage = computed(() => {
  switch (language) {
    case "ts":
      return "typescript"
    case "js":
      return "javascript"
    default:
      return language
  }
})

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "json") {
      return new jsonWorker()
    }
    if (["css", "scss", "less"].includes(label)) {
      return new cssWorker()
    }
    if (["html", "handlebars", "razor"].includes(label)) {
      return new htmlWorker()
    }
    if (["typescript", "javascript"].includes(label)) {
      return new tsWorker()
    }
    return new EditorWorker()
  },
}

let editor: monaco.editor.IStandaloneCodeEditor
const codeEditBox = ref()

watch(content, (newValue) => {
  if (editor) {
    const value = editor.getValue()
    if (newValue !== value) {
      editor.setValue(newValue)
    }
  }
})
watch(
  () => options,
  (newValue) => {
    editor.updateOptions(newValue)
  },
  { deep: true },
)
watch(textLanguage, (newValue) => {
  monaco.editor.setModelLanguage(editor.getModel()!, newValue)
})
watch(
  () => readOnly,
  (newValue) => {
    editor.updateOptions({ readOnly: newValue })
  },
)
watch(
  () => minimap,
  (newValue) => {
    editor.updateOptions({ minimap: { enabled: newValue } })
  },
)

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})
onMounted(async () => {
  // 语法检查
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
  })
  // 创建一个可复用的语法高亮器
  const langs = ["javascript", "typescript", "vue", "java"]
  const highlighter = await getHighlighter({
    themes: ["vitesse-dark", "vitesse-light"],
    langs: langs,
  })

  // 首先注册需要的语言的 IDs
  for (const lang of langs) {
    monaco.languages.register({ id: lang })
  }

  // 注册 Shiki 主题，并为 Monaco 提供语法高亮
  shikiToMonaco(highlighter, monaco)

  editor = monaco.editor.create(codeEditBox.value, {
    value: content.value,
    language: textLanguage.value,
    theme: theme.value,
    readOnly: readOnly,
    minimap: {
      enabled: minimap,
    },
    ...options,
  })
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    content.value = value
    emits("change", value)
  })
  emits("editor-mounted", editor)
})
</script>

<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<style scoped>
.codeEditBox {
  width: 100%;
  height: 100%;
}
</style>
