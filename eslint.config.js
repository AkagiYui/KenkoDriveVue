import pluginVue from "eslint-plugin-vue"
import * as parserVue from "vue-eslint-parser"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import stylistic from "@stylistic/eslint-plugin"
import globals from "globals"
import { globalIgnores } from "eslint/config"

export default [
  // 忽略文件配置
  globalIgnores([
    "dist",
    "node_modules",
    "public/gt4.js",
    "typed-router.d.ts",
    "auto-imports.d.ts",
    "components.d.ts",
    "src/pages/index/test.vue",
    "LICENSE"]),
  // 基础 JavaScript/TypeScript 配置
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // 基础 ESLint 推荐规则
      "constructor-super": "error",
      "for-direction": "error",
      "getter-return": "error",
      "no-async-promise-executor": "error",
      "no-case-declarations": "error",
      "no-class-assign": "error",
      "no-compare-neg-zero": "error",
      "no-cond-assign": "error",
      "no-const-assign": "error",
      "no-constant-condition": "error",
      "no-control-regex": "error",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-delete-var": "error",
      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-empty": "error",
      "no-empty-character-class": "error",
      "no-empty-pattern": "error",
      "no-ex-assign": "error",
      "no-extra-boolean-cast": "error",
      "no-fallthrough": "error",
      "no-func-assign": "error",
      "no-global-assign": "error",
      "no-import-assign": "error",
      "no-inner-declarations": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-misleading-character-class": "error",
      "no-mixed-spaces-and-tabs": "error",
      "no-new-symbol": "error",
      "no-nonoctal-decimal-escape": "error",
      "no-obj-calls": "error",
      "no-octal": "error",
      "no-prototype-builtins": "error",
      "no-redeclare": "error",
      "no-regex-spaces": "error",
      "no-self-assign": "error",
      "no-setter-return": "error",
      "no-shadow-restricted-names": "error",
      "no-sparse-arrays": "error",
      "no-this-before-super": "error",
      "no-undef": "off", // 使用 TypeScript 检查
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "no-unused-labels": "error",
      "no-unused-vars": "off", // 使用 TypeScript 检查
      "no-useless-catch": "error",
      "no-useless-escape": "error",
      "no-with": "error",
      "require-yield": "error",
      "use-isnan": "error",
      "valid-typeof": "error",

      // TypeScript ESLint 推荐规则
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-declaration-merging": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/triple-slash-reference": "error",

      // 自定义规则
      semi: ["warn", "never"],
      "no-var": "error",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "object-shorthand": ["off", "consistent"],
    },
  },

  // Vue 文件配置
  {
    files: ["**/*.vue"],
    plugins: {
      vue: pluginVue,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: parserVue,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      // Vue 推荐规则
      "vue/comment-directive": "off", // 关闭这个规则，因为它可能与我们的配置冲突
      "vue/jsx-uses-vars": "error",
      "vue/no-async-in-computed-properties": "error",
      "vue/no-dupe-keys": "error",
      "vue/no-duplicate-attributes": "error",
      "vue/no-parsing-error": "error",
      "vue/no-reserved-keys": "error",
      "vue/no-shared-component-data": "error",
      "vue/no-side-effects-in-computed-properties": "error",
      "vue/no-template-key": "error",
      "vue/no-textarea-mustache": "error",
      "vue/no-unused-components": "error",
      "vue/no-unused-vars": "error",
      "vue/no-use-v-if-with-v-for": "error",
      "vue/require-component-is": "error",
      "vue/require-render-return": "error",
      "vue/require-v-for-key": "error",
      "vue/require-valid-default-prop": "error",
      "vue/return-in-computed-property": "error",
      "vue/valid-template-root": "error",
      "vue/valid-v-bind": "error",
      "vue/valid-v-cloak": "error",
      "vue/valid-v-else-if": "error",
      "vue/valid-v-else": "error",
      "vue/valid-v-for": "error",
      "vue/valid-v-html": "error",
      "vue/valid-v-if": "error",
      "vue/valid-v-model": "error",
      "vue/valid-v-on": "error",
      "vue/valid-v-once": "error",
      "vue/valid-v-pre": "error",
      "vue/valid-v-show": "error",
      "vue/valid-v-text": "error",

      // Vue 3 强烈推荐规则
      "vue/attribute-hyphenation": "error",
      "vue/component-definition-name-casing": "error",
      "vue/first-attribute-linebreak": "error",
      "vue/html-closing-bracket-newline": "error",
      "vue/html-closing-bracket-spacing": "error",
      "vue/html-end-tags": "error",
      "vue/html-indent": ["error", 2],
      "vue/html-quotes": "error",
      "vue/html-self-closing": "error",
      "vue/max-attributes-per-line": "error",
      "vue/multiline-html-element-content-newline": "error",
      "vue/mustache-interpolation-spacing": "error",
      "vue/no-multi-spaces": "error",
      "vue/no-spaces-around-equal-signs-in-attribute": "error",
      "vue/no-template-shadow": "error",
      "vue/one-component-per-file": "error",
      "vue/prop-name-casing": "error",
      "vue/require-default-prop": "error",
      "vue/require-prop-types": "error",
      "vue/singleline-html-element-content-newline": "error",
      "vue/v-bind-style": "error",
      "vue/v-on-style": "error",
      "vue/v-slot-style": "error",

      // 自定义 Vue 规则
      "vue/multi-word-component-names": "off", // 组件名必须是多个单词

      // TypeScript 规则（继承）
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Vue 文件的 TypeScript 解析配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".vue"],
      },
    },
  },

  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      // ===== 基础 ESLint 规则 =====
      semi: ["warn", "never"], // 分号 - 对应 Prettier 的 semi: false
      "no-unused-vars": "off", // 禁止未使用过的变量。已禁用，使用 TypeScript 检查
      "no-undef": "off", // 禁止未声明的变量。已禁用，使用 TypeScript 检查
      "no-var": "error", // 禁止使用 var
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "object-shorthand": ["off", "consistent"], // 对象字面量简写语法

      // ===== Vue 相关规则 =====
      "vue/multi-word-component-names": "off", // 组件名必须是多个单词

      // ===== @stylistic 格式化规则 (替代 Prettier) =====

      // 缩进规则 - 对应 Prettier 的 tabWidth: 2, useTabs: false
      "@stylistic/indent": ["error", 2, {
        SwitchCase: 1, // switch 语句缩进 1 个单位
        offsetTernaryExpressions: true, // 三元表达式缩进
      }],

      // 引号规则 - 对应 Prettier 的 singleQuote: false
      "@stylistic/quotes": ["error", "double"],

      // JSX 引号规则 - 对应 Prettier 的 jsxSingleQuote: false
      "@stylistic/jsx-quotes": ["error", "prefer-double"],

      // 行宽规则 - 对应 Prettier 的 printWidth: 120
      "@stylistic/max-len": ["error", {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],

      // 尾随逗号 - 对应 Prettier 的 trailingComma: "all"
      "@stylistic/comma-dangle": ["error", "always-multiline"],

      // 对象花括号空格 - 对应 Prettier 的 bracketSpacing: true
      "@stylistic/object-curly-spacing": ["error", "always"],

      // 数组方括号空格
      "@stylistic/array-bracket-spacing": ["error", "never"],

      // 箭头函数参数括号 - 对应 Prettier 的 arrowParens: "always"
      "@stylistic/arrow-parens": ["error", "always"],

      // 换行符 - 对应 Prettier 的 endOfLine: "lf"
      "@stylistic/linebreak-style": ["error", "unix"],

      // 分号前后空格
      "@stylistic/semi-spacing": ["error", { before: false, after: true }],

      // 逗号前后空格
      "@stylistic/comma-spacing": ["error", { before: false, after: true }],

      // 关键字前后空格
      "@stylistic/keyword-spacing": ["error", { before: true, after: true }],

      // 操作符前后空格
      "@stylistic/space-infix-ops": "error",

      // 一元操作符空格
      "@stylistic/space-unary-ops": ["error", { words: true, nonwords: false }],

      // 块语句前空格
      "@stylistic/space-before-blocks": "error",

      // 函数括号前空格
      "@stylistic/space-before-function-paren": ["error", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      }],

      // 括号内空格
      "@stylistic/space-in-parens": ["error", "never"],

      // 计算属性内空格
      "@stylistic/computed-property-spacing": ["error", "never"],

      // 行末空格
      "@stylistic/no-trailing-spaces": "error",

      // 文件末尾换行
      "@stylistic/eol-last": ["error", "always"],

      // 多个空行
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],

      // 对象属性引号 - 对应 Prettier 的 quoteProps: "as-needed"
      "@stylistic/quote-props": ["error", "as-needed"],

      // JSX 标签闭合 - 对应 Prettier 的 bracketSameLine: false
      "@stylistic/jsx-closing-bracket-location": ["error", "line-aligned"],

      // JSX 属性缩进
      "@stylistic/jsx-indent-props": ["error", 2],

      // JSX 标签缩进
      "@stylistic/jsx-indent": ["error", 2],

      // 单行属性 - 对应 Prettier 的 singleAttributePerLine: false
      "@stylistic/jsx-max-props-per-line": "off",

      // 函数调用参数换行
      "@stylistic/function-call-argument-newline": ["error", "consistent"],

      // 对象属性换行
      "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],

      // 数组元素换行
      "@stylistic/array-element-newline": ["error", "consistent"],

      // 操作符换行位置
      "@stylistic/operator-linebreak": ["error", "before"],

      // 点操作符换行位置
      "@stylistic/dot-location": ["error", "property"],
    },
  },
]
