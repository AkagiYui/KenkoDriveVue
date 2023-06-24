<script setup lang="ts">
import { useAppConfig } from '@/stores/app-config'
import { storeToRefs } from 'pinia'

const { isDarkMode } = storeToRefs(useAppConfig())
import { ref, computed } from 'vue'

const vh100 = ref(window.innerHeight)
const overlayStyle = computed(() => {
  return {
    'background-position': 'center top', // 设置背景图片位置;
    'background-size': 'cover', // 设置背景大小
    'background-image':
      "url('http://api.cloud.189.cn/guns/img/recommendedPosition/20230621190400_webDUANWU.jpg')",
    height: vh100.value + 'px',
    opacity: '1', // 设置透明度
    transition: 'opacity 0.3s ease-in-out', // 设置过渡效果
    position: 'relative', // 设置位置属性
    width: '100%', // 设置宽度
  }
})
</script>

<template>
  <div :class="isDarkMode ? 'background' : ''" :style="overlayStyle">
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
  </div>
</template>

<style scoped>
.background::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 设置遮罩颜色和透明度 */
}

.login-card {
  position: absolute;
  left: 75%; /* 左边位于父容器75%宽度处 */
  top: 50%;
  transform: translate(-50%, -50%); /* 移动自身宽高的50% */
  width: 400px; /* 设置宽度 */
}
</style>
