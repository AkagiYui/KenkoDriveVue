<script setup lang="ts">
import { useRouter } from "vue-router"
import { type FormInst, type FormItemRule, NIcon } from "naive-ui"
import {
  CheckmarkOutline,
  KeyOutline,
  LockClosedOutline,
  MailOutline,
  PhonePortraitOutline,
  SendSharp,
} from "@vicons/ionicons5"
import { ResponseMessagesSimplifiedChinese } from "@/types/ResponseMessages"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"
import { storeToRefs } from "pinia"
import {
  confirmRegisterEmailCode,
  confirmSmsCode,
  getToken,
  sendRegisterEmailCode,
  sendSmsCode,
} from "@/api/user"
import { getRegisterEnabled } from "@/api/server"
import { hasText } from "@/utils/string"

const { isDarkMode } = storeToRefs(useAppConfig())
const { isLoggedIn } = storeToRefs(useUserInfo())
const { setToken } = useUserInfo()
const route = useRouter()

const isRegisterEnabled = ref(false)

onBeforeMount(() => {
  // 如果已经登录，跳转到首页
  if (isLoggedIn.value) {
    route.push("/")
  }
  getRegisterEnabled().then((res) => {
    isRegisterEnabled.value = res.data
  })
})

const modalFormRef = ref<FormInst | null>(null)
const registerFormRef = ref<FormInst | null>(null)
const rules = {
  username: {
    required: true,
    message: "请输入用户名",
    min: 3,
    trigger: ["input", "blur"],
  },
  password: {
    required: true,
    min: 5,
    message: "请输入密码",
    trigger: ["input", "blur"],
  },
  repeatPassword: {
    required: true,
    min: 8,
    message: "请再次输入密码",
    trigger: ["input", "blur"],
  },
  email: {
    // 邮箱格式校验
    required: true,
    message: "请输入邮箱",
    trigger: ["input", "blur"],
  },
}
const loginForm = ref({
  username: "",
  password: "",
  repeatPassword: "",
  email: "",
  code: "",
})
const onLoginButtonClick = () => {
  modalFormRef.value?.validate((errors) => {
    if (errors) {
      return
    }
    getToken(loginForm.value.username, loginForm.value.password)
      .then((res) => {
        setToken(res.data.token)
        route.replace("/") // 跳转到首页，使用replace以避免产生历史记录
        loginForm.value.username = ""
        loginForm.value.password = ""
        loginForm.value.repeatPassword = ""
        loginForm.value.email = ""
        loginForm.value.code = ""
      })
      .catch((err) => {
        const code = err.response?.status
        if (code === 401) {
          window.$message.error("用户名或密码错误")
        } else {
          console.error(err)
        }
      })
  })
}
const isCooldown = ref(false)
const sentEmailCode = ref(false)

function onRegisterButtonClick() {
  registerFormRef.value?.validate().then(() => {
    confirmRegisterEmailCode(loginForm.value.email, loginForm.value.code)
      .then(() => {
        window.$message.success("注册成功")
        loginForm.value.repeatPassword = ""
        loginForm.value.email = ""
        loginForm.value.code = ""
        selectedTab.value = "signin"
      })
      .catch(() => {
        window.$message.error("验证失败，请检查验证码是否正确")
      })
  })
}

const codeInputRef = ref<HTMLInputElement | null>(null)
const geetest = getCurrentInstance()!.proxy!.$geetest

function onSendEmailCodeLogoClick() {
  if (isCooldown.value) return
  registerFormRef.value
    ?.validate()
    .then(() => {
      geetest.validate().then((w) => {
        sendRegisterEmailCode(
          loginForm.value.username,
          loginForm.value.password,
          loginForm.value.email,
          w,
        )
          .then(() => {
            window.$message.success("验证码已发送，请查收")
            isCooldown.value = true
            sentEmailCode.value = true
            setTimeout(() => {
              isCooldown.value = false
            }, 60000)
            codeInputRef.value?.focus()
          })
          .catch((err) => {
            const code = err.response?.status
            if (code === 400) {
              const code = err.response?.data.code
              window.$message.error(ResponseMessagesSimplifiedChinese[code])
            }
          })
      })
    })
    .catch(() => {})
}

const selectedTab = ref("sms")
const smsLoginForm = ref({
  phone: "",
  code: "",
})
const smsFormRules = {
  phone: {
    required: true,
    trigger: ["input", "blur"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("请输入手机号")
      }
      if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
        return new Error("手机号格式不正确")
      }
      return true
    },
  },
  code: {
    required: true,
    message: "请输入验证码",
    trigger: ["input"],
  },
}
const smsFormRef = ref<FormInst | null>(null)
const onSmsLoginButtonClick = () => {
  smsFormRef.value?.validate().then(() => {
    console.log(123)
    confirmSmsCode(smsLoginForm.value.phone, smsLoginForm.value.code)
      .then((res) => {
        setToken(res.data.token)
        route.replace("/") // 跳转到首页，使用replace以避免产生历史记录
        smsLoginForm.value.phone = ""
        smsLoginForm.value.code = ""
      })
      .catch((err) => {
        const code = err.response?.status
        if (code === 401) {
          window.$message.error("验证码错误")
        } else {
          console.error(err)
        }
      })
  })
}

const onSendSmsCodeLogoClick = () => {
  if (isCooldown.value) return
  if (hasText(smsLoginForm.value.phone)) {
    geetest.validate().then((w) => {
      sendSmsCode(smsLoginForm.value.phone, w)
        .then(() => {
          window.$message.success("验证码已发送，请查收")
          isCooldown.value = true
          setTimeout(() => {
            isCooldown.value = false
          }, 60000)
        })
        .catch((err) => {
          const code = err.response?.status
          if (code === 400) {
            const code = err.response?.data.code
            window.$message.error(ResponseMessagesSimplifiedChinese[code])
          }
        })
    })
  }
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
    >
      <n-tab-pane name="sms" tab="短信登录">
        <h3>验证即登录，未注册将自动创建账号</h3>
        <n-form
          ref="smsFormRef"
          :model="smsLoginForm"
          :rules="smsFormRules"
          :show-label="false"
          :show-require-mark="false"
        >
          <n-form-item-row label="手机号" path="phone">
            <n-input
              v-model:value="smsLoginForm.phone"
              :input-props="{ autocomplete: 'phone' }"
              placeholder="手机号"
            >
              <template #prefix>
                <n-icon :component="PhonePortraitOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row label="验证码" path="code">
            <n-input
              v-model:value="smsLoginForm.code"
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
        <n-button
          block
          secondary
          strong
          type="primary"
          @click="onSmsLoginButtonClick"
        >
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signin" tab="登录">
        <n-form
          ref="modalFormRef"
          :show-require-mark="false"
          :show-label="false"
          :model="loginForm"
          :rules="rules"
        >
          <n-form-item-row path="username" label="账号">
            <n-input
              v-model:value="loginForm.username"
              placeholder="用户名/邮箱/手机号"
              :input-props="{ autocomplete: 'username' }"
            >
              <template #prefix>
                <n-icon :component="MailOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row path="password" label="密码">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              placeholder="请输入密码"
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
        <n-button
          block
          secondary
          strong
          type="primary"
          @click="onLoginButtonClick"
        >
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane v-if="isRegisterEnabled" name="signup" tab="注册">
        <n-form
          ref="registerFormRef"
          :model="loginForm"
          :rules="rules"
          :show-require-mark="false"
        >
          <n-form-item-row path="username" label="用户名">
            <n-input
              v-model:value="loginForm.username"
              :disabled="isCooldown"
              :input-props="{ autocomplete: 'username' }"
            />
          </n-form-item-row>
          <n-form-item-row path="password" label="密码">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              :disabled="isCooldown"
              :input-props="{ autocomplete: 'new-password' }"
              show-password-on="click"
            />
          </n-form-item-row>
          <n-form-item-row path="repeatPassword" label="重复密码">
            <n-input
              v-model:value="loginForm.repeatPassword"
              :disabled="isCooldown"
              :input-props="{ autocomplete: 'new-password' }"
              type="password"
            />
          </n-form-item-row>
          <n-form-item-row label="邮箱" path="email">
            <n-input
              v-model:value="loginForm.email"
              :disabled="isCooldown"
              @keyup.enter="onSendEmailCodeLogoClick"
            >
              <template #suffix>
                <n-icon
                  :component="isCooldown ? CheckmarkOutline : SendSharp"
                  :style="isCooldown ? {} : { cursor: 'pointer' }"
                  @click="onSendEmailCodeLogoClick"
                />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row label="验证码" path="code">
            <n-input
              ref="codeInputRef"
              v-model:value="loginForm.code"
              :disabled="!sentEmailCode"
            />
          </n-form-item-row>
        </n-form>
        <n-button
          :disabled="!sentEmailCode"
          block
          secondary
          strong
          type="primary"
          @click="onRegisterButtonClick"
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

.login-card {
  position: absolute;
  left: 75%; /* 左边位于父容器75%宽度处 */
  top: 50%;
  transform: translate(-50%, -50%); /* 移动自身宽高的50% */
  width: 400px; /* 设置宽度 */
}

.background {
  background-image: url("/img/background.webp");
  background-size: cover;
  background-position: center top;
  opacity: 1;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
