/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

const config = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended", // 使用推荐的规则
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    semi: ["warn", "never"], // 分号
    indent: ["error", 2], // 缩进
    quotes: ["error", "double"], // 引号

    "no-unused-vars": "warn", // 禁止未使用过的变量
    "no-undef": "off", // 禁止未声明的变量。已禁用，使用typescript检查
    "no-var": "error", // 禁止使用 var

    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
  },
}

module.exports = config