import pluginVue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import stylistic from "@stylistic/eslint-plugin"
import globals from "globals"
import { globalIgnores, defineConfig } from "eslint/config"
import importPlugin from "eslint-plugin-import"

export default defineConfig([
  // 忽略文件配置
  globalIgnores([
    "dist",
    "node_modules",
    "public/gt4.js",
    "typed-router.d.ts",
    "auto-imports.d.ts",
    "components.d.ts",
    "src/pages/index/test.vue",
    "LICENSE",
  ]),
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue", "**/*.{js,mjs,cjs,ts,tsx,mts,cts}"], // 适用于所有 JS 和 VUE 文件
    plugins: {
      "@stylistic": stylistic,
      import: importPlugin,
      "@typescript-eslint": tsPlugin,
      vue: pluginVue,
    },

    // 语言和环境设置
    languageOptions: {
      parser: vueParser,
      globals: {
        ...globals.browser, // 浏览器全局变量
      },
      sourceType: "module", // 源文件视为模块
      ecmaVersion: "latest", // ESNext 语法支持
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".vue"],
      },
    },

    // 规则
    rules: {
      // ESLint 基础规则
      semi: ["warn", "never"], // 禁止分号
      camelcase: ["warn", { allow: ["dead_code", "keep_classnames", "keep_fnames"] }], // 强制驼峰命名
      eqeqeq: ["warn", "smart"], // 智能禁止使用 == 和 !=，要求使用 === 和 !==
      "no-multi-str": ["warn"], // 禁止使用多行字符串
      "prefer-template": ["warn"], // 优先使用模板字符串
      "no-var": ["warn"], // 禁止使用 var
      "no-unused-vars": [
        "off",
        {
          vars: "all", // 变量
          args: "none", // 参数
          ignoreRestSiblings: false, // 忽略剩余的解构
          varsIgnorePattern: "required", // 忽略 required(vee-validate)
        },
      ], // 未使用的变量。已禁用，使用 TypeScript 检查
      "prefer-const": ["warn", {
        destructuring: "any",
        ignoreReadBeforeAssign: false
      }], // 优先使用 const

      // 代码风格规则
      "@stylistic/max-len": ["warn", {
        code: 8000,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }], // 单行最大长度
      "@stylistic/no-trailing-spaces": ["warn"], // 禁止行尾空格
      "@stylistic/linebreak-style": ["warn", "unix"], // 换行符风格
      "@stylistic/no-multiple-empty-lines": ["warn", { max: 2, maxEOF: 1, maxBOF: 0 }], // 空行数量
      "@stylistic/quotes": ["warn", "double", { avoidEscape: true }], // 引号
      "@stylistic/brace-style": ["warn", "1tbs", { allowSingleLine: true }], // 大括号风格
      "@stylistic/comma-dangle": ["warn", "always-multiline"], // 逗号后面必须有空格
      "@stylistic/eol-last": ["warn", "always"], // 文件末尾必须有换行符
      "@stylistic/template-curly-spacing": ["warn", "never"], // 模板字符串中花括号内的空格
      "@stylistic/object-curly-spacing": ["warn", "always"], // 对象字面量中花括号内的空格
      "@stylistic/space-infix-ops": ["warn", { int32Hint: false }], // 运算符周围的空格
      "@stylistic/keyword-spacing": ["warn", { before: true, after: true }], // 关键字周围的空格
      "@stylistic/arrow-spacing": ["warn"], // 箭头函数的箭头前后的空格
      "@stylistic/space-before-blocks": ["warn", { functions: "always", keywords: "always", classes: "always" }], // 块语句大括号前的空格
      "@stylistic/no-multi-spaces": ["warn"], // 禁止使用多个空格
      "@stylistic/comma-spacing": ["warn", { before: false, after: true }], // 逗号周围的空格
      "@stylistic/semi-spacing": ["warn", { before: false, after: true }], // 分号周围的空格
      "@stylistic/indent": [
        "warn",
        2, // 默认缩进2个空格
        {
          SwitchCase: 1, //  switch语句缩进1个单位
          VariableDeclarator: 1, // 变量声明符缩进1个单位
          offsetTernaryExpressions: true, //三元表达式缩进
        },
      ], // 缩进

      // import规则
      "import/order": ["warn"], // import排序

      // Vue规则
      "vue/component-api-style": [
        "off",
        ["script-setup", "composition"], // "script-setup", "composition", "composition-vue2", or "options"
      ], // vue组件api风格
      "vue/no-unused-vars": ["warn"], // vue模板中未使用的变量
      "vue/max-attributes-per-line": ["warn", { singleline: { max: Infinity }, multiline: { max: 1 } }], // 每行最多的属性数量
      "vue/no-unused-components": ["warn"], // 未使用的组件
      "vue/no-v-model-argument": ["off"], // v-model 指令禁止使用参数，vue2.7中可使用
      "vue/multi-word-component-names": ["off", { ignores: [] }], // 组件名必须由多个单词组成
      "vue/order-in-components": ["warn"], // 组件属性顺序
      "vue/block-order": ["warn"], // 块顺序
      "vue/no-v-text-v-html-on-component": ["off"], // 组件中禁止使用v-text和v-html
      "vue/component-definition-name-casing": ["warn", "PascalCase"], // 组件命名规范
      "vue/attributes-order": ["warn"], // 属性顺序
      "vue/attribute-hyphenation": ["warn"], // 属性命名规范
      "vue/multiline-html-element-content-newline": ["warn"], // 多行元素内容换行
      "vue/mustache-interpolation-spacing": ["warn", "always"], // 插值表达式周围的空格
      "vue/no-multi-spaces": ["warn"], // 禁止使用多个空格
      "vue/singleline-html-element-content-newline": [
        "off",
        {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: ["pre", "textarea", "h1", "p", "span"], // 忽略的元素
          externalIgnores: [],
        },
      ], // 单行元素内容换行，关闭，允许不换行
      "vue/component-name-in-template-casing": [
        "warn",
        "PascalCase", // 大驼峰 或 短横线命名
        {
          ignores: ["/^rain-/"], // 忽略以rain-开头的组件名
          registeredComponentsOnly: true, // 只检查已注册的组件
        },
      ], // 模板中使用组件名
      "vue/v-slot-style": [
        "warn",
        {
          atComponent: "v-slot",
          default: "v-slot",
          named: "shorthand",
        },
      ], // v-slot 风格
      "vue/html-closing-bracket-newline": [
        "warn",
        {
          singleline: "never", // 单行元素的结束标签换行
          multiline: "never", // 多行元素的结束标签换行
        },
      ], // 多行元素的结束标签换行
      "vue/html-self-closing": [
        "warn",
        {
          html: {
            void: "any",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ], // 自闭合标签, void标签允许省略结束标签


      // 以下所有规则暂未验证
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
      "vue/first-attribute-linebreak": "error",
      "vue/html-closing-bracket-spacing": "error",
      "vue/html-end-tags": "error",
      "vue/html-indent": ["error", 2],
      "vue/html-quotes": "error",
      "vue/no-spaces-around-equal-signs-in-attribute": "error",
      "vue/no-template-shadow": "error",
      "vue/one-component-per-file": "error",
      "vue/prop-name-casing": "error",
      "vue/require-default-prop": "error",
      "vue/require-prop-types": "error",
      "vue/v-bind-style": "error",
      "vue/v-on-style": "error",

      // 基础 ESLint 推荐规则
      "no-undef": "off", // 禁止未声明的变量。已禁用，使用 TypeScript 检查
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "object-shorthand": ["off", "consistent"], // 对象字面量简写语法
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
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "no-unused-labels": "error",
      "no-useless-catch": "error",
      "no-useless-escape": "error",
      "no-with": "error",
      "require-yield": "error",
      "use-isnan": "error",
      "valid-typeof": "error",

      // TypeScript ESLint 推荐规则
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-declaration-merging": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/triple-slash-reference": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",

      "@stylistic/jsx-quotes": ["error", "prefer-double"], // JSX 引号规则 - 对应 Prettier 的 jsxSingleQuote: false
      "@stylistic/array-bracket-spacing": ["error", "never"], // 数组方括号空格
      "@stylistic/arrow-parens": ["error", "always"], // 箭头函数参数括号 - 对应 Prettier 的 arrowParens: "always"
      "@stylistic/space-unary-ops": ["error", { words: true, nonwords: false }], // 一元操作符空格
      "@stylistic/space-in-parens": ["error", "never"], // 括号内空格
      "@stylistic/computed-property-spacing": ["error", "never"], // 计算属性内空格
      "@stylistic/quote-props": ["error", "as-needed"], // 对象属性引号 - 对应 Prettier 的 quoteProps: "as-needed"
      "@stylistic/jsx-closing-bracket-location": ["error", "line-aligned"], // JSX 标签闭合 - 对应 Prettier 的 bracketSameLine: false
      "@stylistic/jsx-indent-props": ["error", 2], // JSX 属性缩进
      "@stylistic/jsx-indent": ["error", 2], // JSX 标签缩进
      "@stylistic/jsx-max-props-per-line": "off", // 单行属性 - 对应 Prettier 的 singleAttributePerLine: false
      "@stylistic/function-call-argument-newline": ["error", "consistent"], // 函数调用参数换行
      "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }], // 对象属性换行
      "@stylistic/array-element-newline": ["error", "consistent"], // 数组元素换行
      "@stylistic/operator-linebreak": ["error", "before"], // 操作符换行位置
      "@stylistic/dot-location": ["error", "property"], // 点操作符换行位置
      "@stylistic/space-before-function-paren": ["error", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      }], // 函数括号前空格
    },
  },
])
