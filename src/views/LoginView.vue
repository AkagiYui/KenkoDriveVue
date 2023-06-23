<script setup lang="ts">
import TopBar from '@/components/TopBar.vue'
import SideMenu from '@/components/SideMenu.vue'
import { useAppConfig } from '@/stores/app-config'
import { storeToRefs } from 'pinia'

const { isDarkMode } = storeToRefs(useAppConfig())
import { ref, computed } from 'vue'
const vh100 = ref(window.innerHeight);
const overlayStyle = computed(() => {
  return {
    'background-image': 'url(your-image-url)', // 设置背景图像
    'background-size': 'cover', // 设置背景大小
    opacity: '1', // 设置透明度
    transition: 'opacity 0.3s ease-in-out', // 设置过渡效果
    position: 'relative', // 设置位置属性
    width: '100%', // 设置宽度
    height: '100%', // 设置高度
    class: isDarkMode.value ? 'dark-mode' : 'light-mode', // 根据isDarkMode的值添加不同的class
  }
})
</script>

<template>
  <div :class="isDarkMode ? 'backgroundD' : 'background'" :style="{ height: vh100 + 'px' }">
    <n-card class="my-element">
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
.background {
  background-image: url('http://api.cloud.189.cn/guns/img/recommendedPosition/20230621190400_webDUANWU.jpg');
  background-size: cover;
  background-position: center top; /* 将背景图片居中并靠顶部对齐 */
  position: relative; /* 确保 .my-element 的位置相对于 .my-container 进行定位 */
  width: 100%; /* 设置 .my-container 的宽度为屏幕的宽度 */
  transition: opacity 0.3s ease-in-out;
}

.backgroundD {
  background-image: url('http://api.cloud.189.cn/guns/img/recommendedPosition/20230621190400_webDUANWU.jpg');
  background-size: cover;
  background-position: center top; /* 将背景图片居中并靠顶部对齐 */
  position: relative; /* 确保 .my-element 的位置相对于 .my-container 进行定位 */
  width: 100%; /* 设置 .my-container 的宽度为屏幕的宽度 */
  transition: opacity 0.3s ease-in-out;
}

.backgroundD::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 设置遮罩颜色和透明度 */
}

.my-element {
  position: absolute;
  left: 75%; /* 左边位于父容器75%宽度处 */
  top: 50%;
  transform: translate(-50%, -50%); /* 移动自身宽高的50% */
  width: 400px; /* 设置 .my-element 的宽度 */
}
</style>
