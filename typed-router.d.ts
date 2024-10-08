/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    'index-layout': RouteRecordInfo<'index-layout', '/', Record<never, never>, Record<never, never>>,
    'home': RouteRecordInfo<'home', '/', Record<never, never>, Record<never, never>>,
    'about': RouteRecordInfo<'about', '/about', Record<never, never>, Record<never, never>>,
    'announcement-manage': RouteRecordInfo<'announcement-manage', '/admin/announcements', Record<never, never>, Record<never, never>>,
    'file-manage': RouteRecordInfo<'file-manage', '/admin/files', Record<never, never>, Record<never, never>>,
    'role-manage': RouteRecordInfo<'role-manage', '/admin/roles', Record<never, never>, Record<never, never>>,
    'system-settings': RouteRecordInfo<'system-settings', '/admin/system/settings', Record<never, never>, Record<never, never>>,
    'runtime-info': RouteRecordInfo<'runtime-info', '/admin/system/status', Record<never, never>, Record<never, never>>,
    'user-manage': RouteRecordInfo<'user-manage', '/admin/users', Record<never, never>, Record<never, never>>,
    'files': RouteRecordInfo<'files', '/files', Record<never, never>, Record<never, never>>,
    'qrlogin': RouteRecordInfo<'qrlogin', '/qrlogin', Record<never, never>, Record<never, never>>,
    'scanner': RouteRecordInfo<'scanner', '/scanner', Record<never, never>, Record<never, never>>,
    'settings': RouteRecordInfo<'settings', '/settings', Record<never, never>, Record<never, never>>,
    'sharing': RouteRecordInfo<'sharing', '/sharing', Record<never, never>, Record<never, never>>,
    'playground': RouteRecordInfo<'playground', '/test', Record<never, never>, Record<never, never>>,
    '404': RouteRecordInfo<'404', '/:path(.*)', { path: ParamValue<true> }, { path: ParamValue<false> }>,
    'login': RouteRecordInfo<'login', '/login', Record<never, never>, Record<never, never>>,
    'docx-preview': RouteRecordInfo<'docx-preview', '/preview/docx', Record<never, never>, Record<never, never>>,
    'pdf-preview': RouteRecordInfo<'pdf-preview', '/preview/pdf', Record<never, never>, Record<never, never>>,
    'video-preview': RouteRecordInfo<'video-preview', '/preview/video', Record<never, never>, Record<never, never>>,
    'xlsx-preview': RouteRecordInfo<'xlsx-preview', '/preview/xlsx', Record<never, never>, Record<never, never>>,
    'share': RouteRecordInfo<'share', '/share/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
  }
}
