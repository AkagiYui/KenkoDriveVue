<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router"
import { type MenuOption, NIcon } from "naive-ui"
import { storeToRefs } from "pinia"
import { useAppConfig } from "@/stores/app-config"
import renderIcon from "@/utils/render-icon"
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
  PersonOutline,
  ReceiptOutline,
  SettingsOutline,
  ShieldCheckmarkOutline,
  SpeedometerOutline,
  TerminalOutline,
  TimeOutline,
  TrashOutline,
} from "@vicons/ionicons5"

const { expandedMenuKeys } = storeToRefs(useAppConfig())

const { isMenuCollapsed, isDebugMode } = storeToRefs(useAppConfig())

const menuOptions = ref([
  {
    label: "总览",
    key: "home",
    path: "/",
    icon: renderIcon(HomeOutline),
  },
  {
    label: "文件",
    key: "file",
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
  },
  {
    label: "密码箱",
    key: "vault",
    icon: renderIcon(LockClosedOutline),
    disabled: true,
  },
  {
    label: "回收站",
    key: "recycle",
    icon: renderIcon(TrashOutline),
    disabled: true,
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
        children: [
          {
            label: "运行信息",
            key: "system",
            path: "/system",
            icon: renderIcon(TerminalOutline),
          },
          {
            label: "系统日志",
            key: "log",
            path: "/log",
            icon: renderIcon(ReceiptOutline),
            disabled: true,
          },
          {
            label: "文件分析",
            key: "file-analysis",
            disabled: true,
          },
          {
            label: "用户分析",
            key: "user-analysis",
            disabled: true,
          },
        ],
      },
      {
        label: "用户管理",
        key: "user-manage",
        icon: renderIcon(PeopleOutline),
        children: [
          {
            label: "用户信息",
            key: "users",
            path: "/users",
            icon: renderIcon(PersonOutline),
          },
          {
            label: "角色权限",
            key: "roles",
            path: "/roles",
            icon: renderIcon(ShieldCheckmarkOutline),
          },
        ],
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
        key: "announcements",
        path: "/announcements",
        icon: renderIcon(MegaphoneOutline),
      },
      {
        label: "系统设置",
        key: "system-settings",
        path: "/system/settings",
        icon: renderIcon(SettingsOutline),
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

const expandIcon = () => {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}

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
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="isMenuCollapsed"
    show-trigger
    :native-scrollbar="false"
    @collapse="isMenuCollapsed = true"
    @expand="isMenuCollapsed = false"
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
      :expanded-keys="expandedMenuKeys"
      @update:expanded-keys="expandedMenuKeys = $event"
    />
  </n-layout-sider>
</template>

<style scoped></style>
