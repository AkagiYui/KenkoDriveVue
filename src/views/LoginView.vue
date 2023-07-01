<script setup lang="ts">
import { useAppConfig } from '@/stores/app-config'
import { storeToRefs } from 'pinia'

const { isDarkMode } = storeToRefs(useAppConfig())
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
        <n-form>
          <n-form-item-row label="用户名">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong> 登录</n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="重复密码">
            <n-input />
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
  animation: fadeOut 1s ease-in-out;
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
