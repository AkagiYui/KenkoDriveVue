import { NTooltip } from "naive-ui"
import type { RendererElement, RendererNode } from "vue"

export const renderTooltip = (
  trigger: VNode<RendererNode, RendererElement, { [key: string]: any }>,
  content: string,
) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}
