<script setup lang="ts">
import { h, ref, onBeforeMount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { type FormInst } from 'naive-ui'

import { useAppConfig } from '@/stores/app-config'
import { useUserInfo } from '@/stores/user-info'
import { storeToRefs } from 'pinia'
import { getToken } from '@/api/user'

const { isDarkMode } = storeToRefs(useAppConfig())
const { requestToken, isLoggedIn } = storeToRefs(useUserInfo())
const { setToken } = useUserInfo()
const route = useRouter()

onBeforeMount(() => {
  // 如果已经登录，跳转到首页
  console.log('isLoggedIn: ', isLoggedIn.value)
  if (isLoggedIn.value) {
    route.push('/')
  }
})

const modalFormRef = ref<FormInst | null>(null)
const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    min: 3,
    trigger: ['input', 'blur'],
  },
  password: {
    required: true,
    min: 6,
    message: '请输入密码',
    trigger: ['input', 'blur'],
  },
  repeatPassword: {
    required: true,
    min: 6,
    message: '请再次输入密码',
    trigger: ['input', 'blur'],
  },
}
const loginForm = ref({
  username: '',
  password: '',
  repeatPassword: '',
})
const onLogin = () => {
  modalFormRef.value?.validate((errors) => {
    if (errors) {
      return
    }
    getToken(loginForm.value.username, loginForm.value.password)
      .then((res) => {
        console.trace('login success')
        route.replace('/') // 跳转到首页，使用replace以避免产生历史记录
        loginForm.value.username = ''
        loginForm.value.password = ''
        loginForm.value.repeatPassword = ''
        requestToken.value = res.data.token
        setToken(res.data.token)
      })
      .catch((err) => {
        const code = err.response?.status
        if (code === 401) {
          window.$message.error('用户名或密码错误')
        } else {
          console.error(err)
        }
      })
  })
}
</script>

<template>
  <div :class="['background', isDarkMode ? 'overlay' : '']" />
  <n-card class="login-card">
    <n-tabs
      class="card-tabs"
      default-value="signin"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <n-tab-pane name="signin" tab="登录">
        <n-form :show-require-mark="false" :model="loginForm" :rules="rules" ref="modalFormRef">
          <n-form-item-row path="username" label="账号">
            <n-input v-model:value="loginForm.username" placeholder="用户名/邮箱/手机号" />
          </n-form-item-row>
          <n-form-item-row path="password" label="密码">
            <n-input
              type="password"
              show-password-on="mousedown"
              v-model:value="loginForm.password"
            />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong @click="onLogin"> 登录</n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form :show-require-mark="false" :model="loginForm" :rules="rules">
          <n-form-item-row path="username" label="用户名">
            <n-input v-model:value="loginForm.username" />
          </n-form-item-row>
          <n-form-item-row path="password" label="密码">
            <n-input
              type="password"
              show-password-on="mousedown"
              v-model:value="loginForm.password"
            />
          </n-form-item-row>
          <n-form-item-row path="repeatPassword" label="重复密码">
            <n-input type="password" v-model:value="loginForm.repeatPassword" />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong> 注册</n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>
.overlay::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 设置遮罩颜色和透明度 */
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
  background-image: url('http://api.cloud.189.cn/guns/img/recommendedPosition/20230621190400_webDUANWU.jpg');
  background-size: cover;
  background-position: center top;
  opacity: 1;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
