# Kenko Drive Vue Frontend

我的云盘 Vue 前端

[![GitHub License](https://img.shields.io/github/license/AkagiYui/KenkoDriveVue?style=flat-square)](https://github.com/AkagiYui/KenkoDriveVue?tab=readme-ov-file#MIT-1-ov-file)
![GitHub top language](https://img.shields.io/github/languages/top/AkagiYui/KenkoDriveVue?style=flat-square)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/t/AkagiYui/KenkoDriveVue?style=flat-square)](https://github.com/AkagiYui/KenkoDriveVue/commits/)
[![GitHub last commit](https://img.shields.io/github/last-commit/AkagiYui/KenkoDriveVue?style=flat-square)](https://github.com/AkagiYui/KenkoDriveVue/commits/)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/AkagiYui/KenkoDriveVue?style=flat-square)

> [!IMPORTANT]
> 该项目仅为个人学习项目，不具备商业使用价值，仅供学习交流。

|      相关       |                                                                          链接                                                                          |
|:-------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------:|
|   GitHub仓库    |                                    [github.com/AkagiYui/KenkoDriveVue](https://github.com/AkagiYui/KenkoDriveVue)                                    |
| GitLink中国大陆仓库 |                                [gitlink.org.cn/AkagiYui/KenkoDriveVue](https://gitlink.org.cn/AkagiYui/KenkoDriveVue)                                |
|    在线演示地址     | [![Website](https://img.shields.io/website?url=https%3A%2F%2Fdrive.akagiyui.com%2F&style=flat-square)drive.akagiyui.com](https://drive.akagiyui.com) |
|     后端仓库      |          [github.com/AkagiYui/KenkoDrive](https://github.com/AkagiYui/KenkoDrive) / [中国大陆镜像仓库](https://gitlink.org.cn/AkagiYui/KenkoDrive)           |

## 功能点

- [x] [更新检查](src/updateChecker.ts)

## 技术栈

- [Vue 3](https://cn.vuejs.org/): JavaScript 框架
- [Vite 5](https://cn.vitejs.dev/): 构建工具
- [Naive UI](https://www.naiveui.com/): UI 组件库
- [Pinia](https://pinia.vuejs.org/): 状态管理
- [TypeScript](https://www.typescriptlang.org/): 类型检查
- [ESLint](https://eslint.org/): 代码检查
- [Prettier](https://prettier.io/): 代码格式化
- [Axios](https://axios-http.com/): HTTP 请求
- [Vue Router](https://router.vuejs.org/): 路由管理
- [ArtPlayer](https://artplayer.org/): 视频播放器
- [vue-pdf](https://github.com/TaTo30/vue-pdf): PDF 阅读器（PDF.js封装）
- [VueUse](https://vueuse.org/): Vue 工具库
- [qrcode.vue](https://github.com/scopewu/qrcode.vue): 二维码生成
- [mitt](https://github.com/developit/mitt) 事件总线
- [vue-office](https://github.com/501351981/vue-office) Office 预览

## TODO

- [ ] feat: 国际化[Vue I18n](https://kazupon.github.io/vue-i18n/zh/)
- [ ] feat: 无障碍图标
- [ ] feat: 图片裁剪[vue-cropper](https://github.com/xyxiao001/vue-cropper)
- [ ] feat: 支持PWA[PWA Vite Plugin](https://vite-pwa-org.netlify.app/)
- [ ] feat: 支持input的自动填充
- [ ] feat: 管理员修改用户头像
- [ ] fix: 头像上传点击图片和按钮外的区域会触发文件选择
- [ ] refactor: 二维码组件使用Naive UI自带组件

## 开发注意事项

请按序执行以下命令，并在确保所有所有警告与错误都已处理完毕再提交代码。

```shell
pnpm type-check && pnpm lint && pnpm format
```

## 活跃数据

![Alt](https://repobeats.axiom.co/api/embed/01a8984fbd9998e1b780dce7af875e5f71ba157f.svg "Repobeats analytics image")

## 鸣谢

- 图标：https://remixicon.com/icon/cloud-fill
- [Vue.js 官方文档](https://cn.vuejs.org/)
- [Vue Router 官方文档](https://router.vuejs.org/)
- [Naive UI 官方文档](https://www.naiveui.com/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [typescript-eslint 官方文档](https://typescript-eslint.io/)
- [适用于 Pinia 的持久化存储插件](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)
- [JS 性能利器！Web Worker](https://yby.zone/note/frontend/js-worker.html)
- [Normalize.css](https://necolas.github.io/normalize.css/)
- [vue3+vite 使用monaco-editor 编辑器](https://geekdaxue.co/read/southerly@web/monaco-editor)
- [博客园：TypeScript（接口—泛型）](https://www.cnblogs.com/jing-zhe/p/13061969.html)
- [GitHub: qrcode.vue](https://github.com/scopewu/qrcode.vue/blob/main/README-zh_cn.md)
- [GitHub: BililiveRecorder-WebUI](https://github.com/BililiveRecorder/BililiveRecorder-WebUI)
- [GitHub: cloud-music（首屏加载动画）](https://github.com/path-yu/vue3-cloud-music/blob/master/index.html)
- [Stack Overflow: How to open PDF Blob using browser's PDF viewer rather than downloading?](https://stackoverflow.com/questions/53066089/how-to-open-pdf-blob-using-browsers-pdf-viewer-rather-than-downloading)
- [掘金：[前端项目创新]前端检测版本更新的简易之道](https://juejin.cn/post/6910395895485825037)
- [掘金：控制台报错 -- 被动事件监听器 ！！！](https://juejin.cn/post/7230806990452588581)
- [掘金：vue3实现全屏拖拽上传文件](https://juejin.cn/post/7208099962911850551)
- [知乎: Vue3 Vite3 状态管理 pinia 基本使用、持久化、在路由守卫中的使用](https://zhuanlan.zhihu.com/p/572165769)
- [知乎: Vue3 Vite3 多环境配置 - 基于 vite 创建 vue3 全家桶项目(续篇）](https://zhuanlan.zhihu.com/p/571017133)
- [哔哩哔哩: console.log导致的内存泄露](https://www.bilibili.com/video/BV16x4y117F7)
- [哔哩哔哩: 在vite中手动分包【渡一教育】](https://www.bilibili.com/video/av1403644928)
- [哔哩哔哩: 阿里云的文件上传【渡一教育】](https://www.bilibili.com/video/av1903215359)
- [哔哩哔哩: 拖拽API【渡一教育】](https://www.bilibili.com/video/av323652523)
- [CSDN: Pinia使用方法及持久化存储](https://blog.csdn.net/m0_53808238/article/details/129751966)
- [CSDN: 去掉router-link文字的下划线](https://blog.csdn.net/weixin_52418790/article/details/117361939)
- [CSDN: vue3+vite如何引入本地静态图片](https://blog.csdn.net/weixin_57399180/article/details/128191707)
- [CSDN: 什么是弹性（display: flex）布局 ？](https://blog.csdn.net/weixin_41044151/article/details/114071215)
- [CSDN：vue3.2props设置默认值【defineProps】](https://blog.csdn.net/qq_45487080/article/details/123841563)
- [CSDN: vue怎么获取package.json中的版本号](https://blog.csdn.net/weixin_52335582/article/details/126529422)
- [CSDN: 路由跳转push和replace的区别](https://blog.csdn.net/ourring/article/details/130605265)
- [CSDN: axios请求文件流以及显示](https://blog.csdn.net/weixin_45936690/article/details/115325297)
- [CSDN: vue 默认margin:8px](https://blog.csdn.net/AinUser/article/details/106254235)
- [CSDN: 前端判断当前系统主题](https://blog.csdn.net/u013367867/article/details/124687719)
- [CSDN: ESLint语法检查--indent（缩进）规则](https://blog.csdn.net/pengjunlee/article/details/97750755)
- [CSDN: 拖拽本地文件夹到浏览器中，展示所有文件结构](https://blog.csdn.net/tangran0526/article/details/104108551)
