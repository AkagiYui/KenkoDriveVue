import { type Component, h } from "vue"
import { NIcon } from "naive-ui"

/* Render an icon component. */
export default (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}
