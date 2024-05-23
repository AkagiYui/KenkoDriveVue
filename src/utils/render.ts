import { h } from "vue"
import type { RendererElement, RendererNode, VNode, Component } from "vue"
import { NTooltip, NIcon } from "naive-ui"

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
