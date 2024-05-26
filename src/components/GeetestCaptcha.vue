<script lang="ts" setup>
let geetest: Geetest
const props = defineProps<{
  config: GeetestConfig
}>()
defineExpose({
  validate: (onFail: (w: GeetestFailInfo) => void = () => {}): Promise<GeetestSuccessInfo> =>
    new Promise<GeetestSuccessInfo>((resolve: (value: GeetestSuccessInfo) => void = () => {}, reject = () => {}) => {
      if (!geetest) {
        reject(new Error("geetest not ready"))
        return
      }
      geetest.onSuccess(() => resolve(geetest.getValidate()))
      geetest.onFail(onFail)
      geetest.onError(reject)
      geetest.showCaptcha()
    }),
})

onBeforeMount(() => {
  const script = document.createElement("script")
  script.src = "https://static.geetest.com/v4/gt4.js"
  script.onload = () => {
    window.initGeetest4(
      {
        language: "zho",
        ...props.config,
        product: "bind",
        hideSuccess: true,
      },
      (e) => {
        e.onReady(() => (geetest = e))
      },
    )
  }
  document.body.appendChild(script)
})
</script>

<template>
  <div id="captcha"></div>
</template>
