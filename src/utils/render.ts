import { h } from "vue"
import type { RendererElement, RendererNode, VNode, Component } from "vue"
import { NTooltip, NIcon } from "naive-ui"
import {
  AndroidTwotone,
  AppleOutlined,
  AudiotrackOutlined,
  InsertDriveFileOutlined,
  QueueMusicOutlined,
  SpaceDashboardOutlined,
  TerminalOutlined,
} from "@vicons/material"
import {
  DocumentPdf32Regular,
  SlideLayout24Regular,
  Gif24Regular,
} from "@vicons/fluent"
import { Java, Markdown, Vuejs } from "@vicons/fa"
import {
  ArchiveOutline,
  CogOutline,
  DocumentOutline,
  DocumentTextOutline,
  FilmOutline,
  ImageOutline,
} from "@vicons/ionicons5"

/**
 * 渲染弹出提示
 * @param trigger 触发元素
 * @param content 提示内容
 * @returns 提示组件
 */
export function renderTooltip(
  trigger: VNode<RendererNode, RendererElement, { [key: string]: any }>,
  content: string,
) {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}

/**
 * 渲染图标
 * @param icon 图标组件
 * @returns 图标组件
 */
export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

/**
 * 获取文件类型对应的图标
 * @param mime 文件类型
 * @param filename 文件名
 * @returns 图标组件
 */
export function type2Icon(mime?: string, filename?: string): Component {
  if (!mime && !filename) {
    // 完全未知类型
    console.log(`unknown mime: ${mime}, filename: ${filename}`)
    return InsertDriveFileOutlined
  }

  // 该类型一般根据文件名后缀而得
  switch (mime) {
    case "image/gif":
      return Gif24Regular
    case "image/png":
    case "image/jpeg":
      return ImageOutline
    case "application/zip":
    case "application/x-zip-compressed":
    case "application/x-compressed":
      return ArchiveOutline
    case "application/x-msdownload":
      return CogOutline
    case "application/pdf":
      return DocumentPdf32Regular
    case "text/csv":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return SpaceDashboardOutlined
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return DocumentTextOutline
    case "apk":
      return AndroidTwotone
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return SlideLayout24Regular
  }

  if (mime?.startsWith("audio")) {
    return AudiotrackOutlined
  }
  if (mime?.startsWith("video")) {
    return FilmOutline
  }
  if (filename?.endsWith(".d.ts")) {
    return DocumentOutline // TypeScript 声明文件
  }

  const suffix = filename?.split(".").pop()
  switch (suffix) {
    case "apk":
      return AndroidTwotone
    case "vue":
      return Vuejs
    case "md":
      return Markdown
    case "lrc":
      return QueueMusicOutlined
    case "jar":
    case "java":
      return Java
    case "ipa":
      return AppleOutlined
    case "exe":
      return TerminalOutlined
  }

  console.log(`unknown mime: ${mime}, filename: ${filename}`)
  return InsertDriveFileOutlined
}
