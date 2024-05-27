<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router/auto"
import type { MenuOption } from "naive-ui"
import { storeToRefs } from "pinia"
import {
  BulbOutline,
  CaretDownOutline,
  DocumentTextOutline,
  FlaskOutline,
  FolderOpenOutline,
  HeartOutline,
  HomeOutline,
  ImagesOutline,
  InformationOutline,
  KeyOutline,
  LockClosedOutline,
  LogInOutline,
  MegaphoneOutline,
  PaperPlaneOutline,
  PeopleOutline,
  ReceiptOutline,
  SettingsOutline,
  ShieldCheckmarkOutline,
  SpeedometerOutline,
  TerminalOutline,
  TimeOutline,
  TrashOutline,
  CogOutline,
} from "@vicons/ionicons5"
import { useAppConfig } from "@/stores/app-config"
import { renderIcon } from "@/utils"

const { expandedMenuKeys, isMenuCollapsed, isDebugMode } = storeToRefs(useAppConfig())

const menuOptions = ref([
  {
    label: "总览",
    key: "home",
    path: "/",
    icon: renderIcon(HomeOutline),
  },
  {
    label: "我的文件",
    key: "files",
    path: "/files",
    icon: renderIcon(FolderOpenOutline),
  },
  {
    label: "最近使用",
    key: "recent",
    icon: renderIcon(TimeOutline),
    disabled: true,
    show: false,
  },
  {
    label: "我的分享",
    key: "share",
    icon: renderIcon(PaperPlaneOutline),
    disabled: true,
  },
  {
    label: "相册",
    key: "album",
    icon: renderIcon(ImagesOutline),
    disabled: true,
    show: false,
  },
  {
    label: "文档",
    key: "document",
    icon: renderIcon(DocumentTextOutline),
    disabled: true,
    show: false,
  },
  {
    label: "收藏夹",
    key: "like",
    icon: renderIcon(HeartOutline),
    disabled: true,
    show: false,
  },
  {
    label: "密码箱",
    key: "vault",
    icon: renderIcon(LockClosedOutline),
    disabled: true,
    show: false,
  },
  {
    label: "回收站",
    key: "recycle",
    icon: renderIcon(TrashOutline),
    disabled: true,
    show: false,
  },
  {
    label: "设置",
    key: "settings",
    path: "/settings",
    icon: renderIcon(SettingsOutline),
  },
  {
    label: "管理员",
    key: "admin",
    icon: renderIcon(KeyOutline),
    children: [
      {
        label: "系统状态",
        key: "system-status",
        icon: renderIcon(SpeedometerOutline),
        show: false,
        children: [
          {
            label: "运行信息",
            key: "runtime-info",
            path: "/admin/system/status",
            icon: renderIcon(TerminalOutline),
          },
          {
            label: "系统日志",
            key: "system-log",
            path: "/admin/system/log",
            icon: renderIcon(ReceiptOutline),
          },
          {
            label: "文件分析",
            key: "file-analysis",
            disabled: true,
            show: false,
          },
          {
            label: "用户分析",
            key: "user-analysis",
            disabled: true,
            show: false,
          },
        ],
      },
      {
        label: "用户信息",
        key: "user-manage",
        path: "/admin/users",
        icon: renderIcon(PeopleOutline),
      },
      {
        label: "角色管理",
        key: "role-manage",
        path: "/admin/roles",
        icon: renderIcon(ShieldCheckmarkOutline),
      },
      {
        label: "文件管理",
        key: "file-manage",
        icon: renderIcon(FolderOpenOutline),
        disabled: true,
      },
      {
        label: "分享管理",
        key: "share-manage",
        icon: renderIcon(PaperPlaneOutline),
        disabled: true,
      },
      {
        label: "公告管理",
        key: "announcement-manage",
        path: "/admin/announcements",
        icon: renderIcon(MegaphoneOutline),
      },
      {
        label: "系统设置",
        key: "system-settings",
        path: "/admin/system/settings",
        icon: renderIcon(CogOutline),
      },
    ],
  },
  {
    key: "divider-2",
    type: "divider",
    show: isDebugMode,
  },
  {
    label: "关于系统",
    key: "about",
    path: "/about",
    icon: renderIcon(InformationOutline),
    show: isDebugMode,
  },
  {
    label: "实验室",
    key: "test",
    icon: renderIcon(FlaskOutline),
    show: isDebugMode,
    children: [
      {
        label: "登录页",
        key: "login",
        path: "/login",
        icon: renderIcon(LogInOutline),
      },
      {
        label: "404页",
        key: "404",
        path: "/404",
      },
      {
        label: "测试页",
        key: "test",
        path: "/test",
        icon: renderIcon(BulbOutline),
      },
    ],
  },
])

const renderMenuLabel = (option: MenuOption) => {
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
    v-model:collapsed="isMenuCollapsed"
    bordered
    show-trigger
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
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
      :expand-icon="renderIcon(CaretDownOutline)"
      :value="useRoute().name as string"
      :expanded-keys="expandedMenuKeys"
      @update:expanded-keys="expandedMenuKeys = $event"
    />
  </n-layout-sider>
</template>

<style scoped></style>
