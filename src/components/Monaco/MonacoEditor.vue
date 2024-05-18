<script lang="ts" setup>
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import * as monaco from "monaco-editor"
import { getHighlighter } from "shiki"
import { shikiToMonaco } from "@shikijs/monaco"

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

const content = defineModel<string>("content", { default: "" })
const props = withDefaults(
  defineProps<{
    language?: string
    readOnly?: boolean
    minimap?: boolean
    dark?: boolean
    options?: any
  }>(),
  {
    language: "plaintext",
    readOnly: true,
    minimap: false,
  },
)
const emits = defineEmits<{
  (e: "change", value: string): void
  (e: "editor-mounted", editor: monaco.editor.IStandaloneCodeEditor): void
}>()

const theme = computed(() => {
  console.log("暗色切换", props.dark)
  return props.dark ? "vitesse-dark" : "vitesse-light"
})
watch(theme, () => monaco.editor.setTheme(theme.value))

const language = computed(() => {
  switch (props.language) {
    case "ts":
      return "typescript"
    case "vue":
      return "vue"
    case "js":
      return "javascript"
    default:
      return props.language
  }
})

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
  () => props.options,
  (newValue) => {
    editor.updateOptions(newValue)
  },
  { deep: true },
)
watch(language, (newValue) => {
  monaco.editor.setModelLanguage(editor.getModel()!, newValue)
})
watch(
  () => props.readOnly,
  (newValue) => {
    editor.updateOptions({ readOnly: newValue })
  },
)
watch(
  () => props.minimap,
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
  const highlighter = await getHighlighter({
    themes: ["vitesse-dark", "vitesse-light"],
    langs: ["javascript", "typescript", "vue"],
  })

  // 首先注册需要的语言的 IDs
  monaco.languages.register({ id: "vue" })
  monaco.languages.register({ id: "typescript" })
  monaco.languages.register({ id: "javascript" })

  // 注册 Shiki 主题，并为 Monaco 提供语法高亮
  shikiToMonaco(highlighter, monaco)

  editor = monaco.editor.create(codeEditBox.value, {
    value: content.value,
    language: language.value,
    theme: theme.value,
    readOnly: props.readOnly,
    minimap: {
      enabled: props.minimap,
    },
    ...props.options,
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
