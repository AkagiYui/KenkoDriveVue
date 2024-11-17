<route lang="json">
{
  "name": "login",
  "meta": {
    "title": "登录"
  }
}
</route>

<script setup lang="ts">
import {
  CheckmarkOutline,
  KeyOutline,
  LockClosedOutline,
  MailOutline,
  PhonePortraitOutline,
  SendSharp,
} from "@vicons/ionicons5"

const { isDarkMode } = storeToRefs(useAppConfig())
const { setToken } = useUserInfo()
const router = useRouter()
const { $geetest } = useGlobal()

const loginFormRef = ref<FormInst | null>(null)
const registerFormRef = ref<FormInst | null>(null)
const smsFormRef = ref<FormInst | null>(null)
const emailOtpInputRef = ref<HTMLInputElement | null>(null)
const smsOtpInputRef = ref<HTMLInputElement | null>(null)

const selectedTab = ref("sms")
const isCooldown = ref(false)
const sentEmailCode = ref(false)

const isRegisterEnabled = ref(false)
onBeforeMount(async () => {
  isRegisterEnabled.value = await getRegisterEnabled()
})

const formRules = {
  username: {
    key: "username",
    trigger: ["input", "blur"],
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error("请输入账号")
      }
      if (value.length < 5) {
        return new Error("账号长度不能小于5")
      }
      return true
    },
  },
  password: {
    key: "password",
    trigger: ["input", "blur"],
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error("请输入密码")
      }
      if (value.length < 5) {
        return new Error("密码长度不能小于5")
      }
      return true
    },
  },
  repeatPassword: {
    key: "repeatPassword",
    trigger: ["input", "blur"],
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error("请再次输入密码")
      }
      if (value !== formData.value.password) {
        return new Error("两次输入密码不一致")
      }
      return true
    },
  },
  email: {
    key: "email",
    trigger: ["input", "blur"],
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error("请输入邮箱")
      }
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        return new Error("邮箱格式不正确")
      }
      return true
    },
  },
  phone: {
    key: "phone",
    trigger: ["input", "blur"],
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error("请输入手机号")
      }
      if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
        return new Error("手机号格式不正确")
      }
      return true
    },
  },
  otp: {
    key: "otp",
    required: true,
    message: "请输入验证码",
    trigger: ["input"],
  },
}
const [formData, resetFormData] = useResettableRefFn(() => ({
  username: "",
  password: "",
  repeatPassword: "",
  email: "",
  phone: "",
  otp: "",
}))

async function onLoginButtonClick() {
  await loginFormRef.value?.validate()
  const token = await getToken(formData.value.username, formData.value.password)
  setToken(token)
  router.replace("/") // 跳转到首页，使用replace以避免产生历史记录
  resetFormData()
}

async function onRegisterButtonClick() {
  await registerFormRef.value?.validate()
  await confirmEmailRegisterOtp(formData.value.email, formData.value.otp)
  window.$message.success("注册成功")
  formData.value.repeatPassword = ""
  formData.value.email = ""
  formData.value.otp = ""
  formData.value.username = formData.value.email
  selectedTab.value = "signin"
}

async function onSendEmailCodeLogoClick() {
  if (isCooldown.value) return
  await registerFormRef.value?.validate(
    () => {},
    (rule) => {
      if (rule === undefined) return false
      return ["email", "password", "repeatPassword"].includes(rule.key as string)
    },
  )
  const w = await $geetest.validate()
  await sendEmailRegisterOtp(formData.value.password, formData.value.email, w)
  window.$message.success("验证码已发送，请查收")
  isCooldown.value = true
  sentEmailCode.value = true
  setTimeout(() => {
    isCooldown.value = false
  }, 60000)
  smsOtpInputRef.value?.focus()
}

async function onSmsLoginButtonClick() {
  await smsFormRef.value?.validate()
  const res = await getTokenBySms(formData.value.phone, formData.value.otp)
  setToken(res)
  router.replace("/") // 跳转到首页，使用replace以避免产生历史记录
}

async function onSendSmsCodeLogoClick() {
  await smsFormRef.value?.validate(
    () => {},
    (rule) => {
      if (rule === undefined) return false
      return ["phone"].includes(rule.key as string)
    },
  )
  if (isCooldown.value) return
  if (!hasText(formData.value.phone)) {
    return
  }
  const w = await $geetest.validate()
  await sendSmsOtp(formData.value.phone, w)
  window.$message.success("验证码已发送，请查收")
  isCooldown.value = true
  setTimeout(() => {
    isCooldown.value = false
  }, 60000)
}

async function onTabUpdate(value: string) {
  console.debug(value)
}
</script>

<template>
  <div :class="['background', isDarkMode ? 'overlay' : '']" />
  <n-card class="login-card">
    <n-tabs
      v-model:value="selectedTab"
      class="card-tabs"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      @update:value="onTabUpdate"
    >
      <n-tab-pane name="sms" tab="短信登录">
        <h3>验证即登录，未注册将自动创建账号</h3>
        <n-form ref="smsFormRef" :model="formData" :rules="formRules" :show-label="false" :show-require-mark="false">
          <n-form-item-row label="手机号" path="phone">
            <n-input v-model:value="formData.phone" :input-props="{ autocomplete: 'phone' }" placeholder="手机号">
              <template #prefix>
                <n-icon :component="PhonePortraitOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row label="验证码" path="otp">
            <n-input
              ref="smsOtpInputRef"
              v-model:value="formData.otp"
              :input-props="{ autocomplete: 'off' }"
              placeholder="验证码"
              @keyup.enter="onSmsLoginButtonClick"
            >
              <template #prefix>
                <n-icon :component="KeyOutline" />
              </template>
              <template #suffix>
                <n-icon
                  :component="isCooldown ? CheckmarkOutline : SendSharp"
                  :style="isCooldown ? {} : { cursor: 'pointer' }"
                  @click="onSendSmsCodeLogoClick"
                />
              </template>
            </n-input>
          </n-form-item-row>
        </n-form>
        <n-button block secondary strong type="primary" @click="onSmsLoginButtonClick"> 登录 </n-button>
      </n-tab-pane>

      <n-tab-pane name="qrcode" tab="扫码登录">
        <QrCodeLogin />
      </n-tab-pane>

      <n-tab-pane name="signin" tab="登录">
        <n-form ref="loginFormRef" :show-require-mark="false" :show-label="false" :model="formData" :rules="formRules">
          <n-form-item-row path="username" label="账号">
            <n-input
              v-model:value="formData.username"
              placeholder="邮箱/手机号"
              :input-props="{ autocomplete: 'username' }"
            >
              <template #prefix>
                <n-icon :component="MailOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row path="password" label="密码">
            <n-input
              v-model:value="formData.password"
              type="password"
              placeholder="密码"
              show-password-on="click"
              :input-props="{ autocomplete: 'current-password' }"
              @keyup.enter="onLoginButtonClick"
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item-row>
        </n-form>
        <n-button block secondary strong type="primary" @click="onLoginButtonClick"> 登录 </n-button>
      </n-tab-pane>

      <n-tab-pane v-if="isRegisterEnabled" name="signup" tab="注册">
        <n-form
          ref="registerFormRef"
          :model="formData"
          :rules="formRules"
          :show-require-mark="false"
          :show-label="false"
        >
          <n-form-item-row label="邮箱" path="email">
            <n-input
              v-model:value="formData.email"
              :disabled="isCooldown"
              placeholder="邮箱"
              @keyup.enter="onSendEmailCodeLogoClick"
            >
              <template #prefix>
                <n-icon :component="MailOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row path="password" label="密码">
            <n-input
              v-model:value="formData.password"
              placeholder="密码"
              type="password"
              :disabled="isCooldown"
              :input-props="{ autocomplete: 'new-password' }"
              show-password-on="click"
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row path="repeatPassword" label="重复密码">
            <n-input
              v-model:value="formData.repeatPassword"
              placeholder="重复密码"
              :disabled="isCooldown"
              :input-props="{ autocomplete: 'new-password' }"
              type="password"
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item-row>

          <n-form-item-row label="验证码" path="otp">
            <n-input
              ref="emailOtpInputRef"
              v-model:value="formData.otp"
              placeholder="验证码"
              @keyup.enter="onRegisterButtonClick"
            >
              <template #prefix>
                <n-icon :component="KeyOutline" />
              </template>
              <template #suffix>
                <n-icon
                  :component="isCooldown ? CheckmarkOutline : SendSharp"
                  :style="isCooldown ? {} : { cursor: 'pointer' }"
                  @click="onSendEmailCodeLogoClick"
                />
              </template>
            </n-input>
          </n-form-item-row>
        </n-form>
        <n-button :disabled="!sentEmailCode" block secondary strong type="primary" @click="onRegisterButtonClick"
          >注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>
.overlay::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* 设置遮罩颜色和透明度 */
  /* 遮罩动画 */
  animation: fadeOut 0.2s ease-in-out;
}

@keyframes fadeOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media screen and (min-width: 550px) {
  .background {
    background-image: url("/img/background.webp");
    background-size: cover;
    background-position: center top;
    opacity: 1;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .login-card {
    position: absolute;
    left: 75%; /* 左边位于父容器75%宽度处 */
    top: 50%;
    transform: translate(-50%, -50%); /* 移动自身宽高的50% */
    width: 400px; /* 设置宽度 */
  }
}

@media screen and (max-width: 550px) {
  .login-card {
    width: 100%;
    border: 0;
  }
}
</style>
