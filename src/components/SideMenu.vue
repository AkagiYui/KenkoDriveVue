<script setup lang="ts">
import { ref } from 'vue'
import { h, Component } from 'vue'
import { RouterLink } from 'vue-router'
import { NIcon } from 'naive-ui'
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
} from '@vicons/ionicons5'

const collapsed = ref(true)

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '首页',
    key: 'index',
    path: '/',
    icon: renderIcon(HomeOutline),
  },
  {
    label: '关于',
    key: 'about',
    path: '/about',
    icon: renderIcon(InformationOutline),
  },
  {
    label: '工具箱',
    key: 'toolbox',
    path: '/toolbox',
    icon: renderIcon(HammerOutline),
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
      value="dd"
    />
  </n-layout-sider>
</template>

<style scoped></style>
