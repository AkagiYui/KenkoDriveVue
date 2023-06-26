<script setup lang="ts">
import { ref, watch } from 'vue'
import { h, type Component } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { NIcon, type MenuOption } from 'naive-ui'
import {
  HomeOutline,
  CaretDownOutline,
  SpeedometerOutline,
  FolderOpenOutline,
  SettingsOutline,
  DocumentTextOutline,
  InformationOutline,
  FlaskOutline,
  HeartOutline,
  LockClosedOutline,
  ImagesOutline,
  PaperPlaneOutline,
  TimeOutline,
  PeopleOutline,
  BulbOutline,
  LogInOutline,
  TrashOutline,
  PersonOutline,
  ShieldCheckmarkOutline,
  TerminalOutline
} from '@vicons/ionicons5'
import { useAppConfig } from '@/stores/app-config'
import { storeToRefs } from 'pinia'

const { isMenuCollapsed, isDebugMode } = storeToRefs(useAppConfig())

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = ref([
  {
    label: '总览',
    key: 'home',
    path: '/',
    icon: renderIcon(HomeOutline),
  },
  {
    label: '文件',
    key: 'file',
    icon: renderIcon(FolderOpenOutline),
    disabled: true,
  },
  {
    label: '最近使用',
    key: 'recent',
    icon: renderIcon(TimeOutline),
    disabled: true,
  },
  {
    label: '我的分享',
    key: 'share',
    icon: renderIcon(PaperPlaneOutline),
    disabled: true,
  },
  {
    label: '相册',
    key: 'album',
    icon: renderIcon(ImagesOutline),
    disabled: true,
  },
  {
    label: '文档',
    key: 'document',
    icon: renderIcon(DocumentTextOutline),
    disabled: true,
  },
  {
    label: '收藏夹',
    key: 'like',
    icon: renderIcon(HeartOutline),
    disabled: true,
  },
  {
    label: '密码箱',
    key: 'vault',
    icon: renderIcon(LockClosedOutline),
    disabled: true,
  },
  {
    label: '回收站',
    key: 'recycle',
    icon: renderIcon(TrashOutline),
    disabled: true,
  },
  {
    label: '设置',
    key: 'settings',
    path: '/settings',
    icon: renderIcon(SettingsOutline),
  },
  {
    key: 'divider-1',
    type: 'divider',
  },
  {
    label: '系统状态',
    key: 'system-status',
    icon: renderIcon(SpeedometerOutline),
    children: [
      {
        label: '运行状态',
        key: 'system',
        path: '/system',
        icon: renderIcon(TerminalOutline),
      },
      {
        label: '文件分析',
        key: 'file-analysis',
        disabled: true,
      },
      {
        label: '用户分析',
        key: 'user-analysis',
        disabled: true,
      },
    ],
  },
  {
    label: '用户管理',
    key: 'user-manage',
    icon: renderIcon(PeopleOutline),
    children: [
      {
        label: '用户信息',
        key: 'users',
        path: '/users',
        icon: renderIcon(PersonOutline),
      },
      {
        label: '角色权限',
        key: 'role-info',
        icon: renderIcon(ShieldCheckmarkOutline),
        disabled: true,
      },
    ],
  },
  {
    label: '文件管理',
    key: 'file-manage',
    icon: renderIcon(FolderOpenOutline),
    disabled: true,
  },
  {
    label: '分享管理',
    key: 'share-manage',
    icon: renderIcon(PaperPlaneOutline),
    disabled: true,
  },
  {
    label: '系统设置',
    key: 'system-setting',
    icon: renderIcon(SettingsOutline),
    disabled: true,
  },
  {
    key: 'divider-2',
    type: 'divider',
    show: isDebugMode,
  },
  {
    label: '关于系统',
    key: 'about',
    path: '/about',
    icon: renderIcon(InformationOutline),
    show: isDebugMode,
  },
  {
    label: '测试',
    key: 'test',
    icon: renderIcon(FlaskOutline),
    show: isDebugMode,
    children: [
      {
        label: '登录页',
        key: 'login',
        path: '/login',
        icon: renderIcon(LogInOutline),
      },
      {
        label: '404页',
        key: '404',
        path: '/404',
      },
      {
        label: '测试页',
        key: 'test',
        path: '/test',
        icon: renderIcon(BulbOutline),
      },
    ],
  },
])

function expandIcon() {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}

function renderMenuLabel(option: MenuOption) {
  if (option.path && !option.disabled) {
    return h(
      RouterLink,
      {
        to: {
          path: option.path as string,
        },
      },
      { default: () => option.label },
    )
  }
  return option.label as string
}
</script>

<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="isMenuCollapsed"
    show-trigger
    @collapse="isMenuCollapsed = true"
    @expand="isMenuCollapsed = false"
    :native-scrollbar="false"
  >
    <n-menu
      style="height: 100%; width: 100%"
      :collapsed="isMenuCollapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :indent="22"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :expand-icon="expandIcon"
      :value="useRoute().name as string"
    />
  </n-layout-sider>
</template>

<style scoped></style>
