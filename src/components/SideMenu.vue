<script setup lang="ts">
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

const { expandedMenuKeys, isMenuCollapsed, isDebugMode } = storeToRefs(useAppConfig())
const route = useRoute()
const expandIcon = renderIcon(CaretDownOutline)

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
  },
  {
    label: "我的分享",
    key: "sharing",
    icon: renderIcon(PaperPlaneOutline),
    path: "/sharing",
  },
  {
    label: "相册",
    key: "album",
    icon: renderIcon(ImagesOutline),
    disabled: true,
  },
  {
    label: "文档",
    key: "document",
    icon: renderIcon(DocumentTextOutline),
    disabled: true,
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
          },
          {
            label: "用户分析",
            key: "user-analysis",
            disabled: true,
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
        path: "/admin/files",
        icon: renderIcon(FolderOpenOutline),
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
    :content-style="{ height: '100%' }"
  >
    <n-flex vertical style="height: 100%; width: 100%">
      <n-scrollbar>
        <n-menu
          v-model:expanded-keys="expandedMenuKeys"
          :collapsed="isMenuCollapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :indent="22"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :expand-icon="expandIcon"
          :value="route.name"
        />
      </n-scrollbar>
      <div v-if="isDebugMode" class="quota">
        <n-popover trigger="hover" :keep-alive-on-hover="false" :disabled="!isMenuCollapsed">
          <template #trigger>
            <n-progress
              type="line"
              status="success"
              :percentage="10"
              :show-indicator="false"
              :height="isMenuCollapsed ? 12 : undefined"
            />
          </template>
          <span>{{ "1G / 100G" }}</span>
        </n-popover>
        <span v-show="!isMenuCollapsed">{{ "1G / 100G" }}</span>
      </div>
    </n-flex>
  </n-layout-sider>
</template>

<style scoped>
.quota {
  padding: 5px 10px 20px 10px;
}
</style>
