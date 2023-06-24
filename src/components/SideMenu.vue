<script setup lang="ts">
import { ref } from 'vue'
import { h, type Component } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { NIcon, type MenuOption } from 'naive-ui'
import {
  HomeOutline,
  CaretDownOutline,
  ListOutline,
  SpeedometerOutline,
  FolderOpenOutline,
  SettingsOutline,
  DocumentTextOutline,
  InformationOutline,
  HammerOutline,
  HeartOutline,
  LockClosedOutline,
  AlbumsOutline,
  PaperPlaneOutline,
  TimeOutline,
  PeopleOutline, BulbOutline, LogInOutline,
} from '@vicons/ionicons5'

const collapsed = ref(false)

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '主页',
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
    icon: renderIcon(AlbumsOutline),
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
    icon: renderIcon(SpeedometerOutline),
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
    disabled: true,
    children: [
      {
        label: '文件分析',
        key: 'file-analysis',
      },
      {
        label: '用户分析',
        key: 'user-analysis',
      },
    ]
  },
  {
    label: '用户管理',
    key: 'user-manage',
    icon: renderIcon(PeopleOutline),
    disabled: true,
    children: [
      {
        label: '用户信息',
        key: 'user-list',
      },
      {
        label: '角色信息',
        key: 'role-list',
      },
      {
        label: '权限信息',
        key: 'permission-list',
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
  },
  {
    label: '关于系统',
    key: 'about',
    path: '/about',
    icon: renderIcon(InformationOutline),
  },
  {
    label: '测试',
    key: 'test',
    icon: renderIcon(HammerOutline),
    show: true,
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
]

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
    :collapsed="collapsed"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
    :native-scrollbar="false"
  >
    <n-menu
      style="height: 100%"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="(menuOptions as any)"
      :render-label="renderMenuLabel"
      :expand-icon="expandIcon"
      :value="useRoute().name as string"
    />
  </n-layout-sider>
</template>

<style scoped></style>
