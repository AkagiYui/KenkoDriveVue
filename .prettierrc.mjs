/** @type {import("prettier").Config} */
const config = {
  printWidth: 120, // 每行字符数
  tabWidth: 2, // 缩进空格数
  useTabs: false, // 使用tab缩进
  semi: false, // 在语句末尾使用分号
  singleQuote: false, // 使用单引号而不是双引号
  quoteProps: "as-needed", // 对象属性的引号使用
  jsxSingleQuote: false, // jsx中使用单引号
  trailingComma: "all", // 多行时尽可能使用尾随逗号
  bracketSpacing: true, // 在对象字面量声明所使用的的花括号后（{）和前（}）输出空格
  bracketSameLine: false, // 将多行 HTML（HTML、JSX、Vue、Angular）元素的 > 放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）。
  arrowParens: "always", // 箭头函数参数使用括号
  htmlWhitespaceSensitivity: "css", // 指定 HTML 文件的全局空白区域敏感度
  vueIndentScriptAndStyle: false, // 是否缩进Vue文件中的脚本和样式标签
  endOfLine: "lf", // 换行符
  embeddedLanguageFormatting: "auto", // 是否格式化嵌入式代码
  singleAttributePerLine: false, // 在 HTML、Vue 和 JSX 中强制每行使用单一属性
}

export default config
