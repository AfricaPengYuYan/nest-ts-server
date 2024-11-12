// 导入 @antfu/eslint-config 配置包，用于扩展 ESLint 规则
const antfu = require("@antfu/eslint-config").default;

const PRINTWIDTH = 180;
const INDENT = 4;

// 导出配置对象，该对象基于 @antfu/eslint-config 进行定制
module.exports = antfu({
    // 定义样式规则
    stylistic: {
        printWidth: PRINTWIDTH,

        // 缩进空格的数量
        indent: INDENT,

        // 字符串引号的风格
        quotes: "double", // 单引号
        // quotes: 'double', // 双引号

        // 使用箭头函数还是 function 关键字
        arrow: true, // 使用箭头函数
        // arrow: false, // 使用 function 关键字

        // 是否允许空的 return 语句
        emptyReturn: true, // 允许
        // emptyReturn: false, // 不允许

        // 函数参数的括号风格
        funcCallSpacing: "always", // 不允许空格
        // funcCallSpacing: 'always', // 总是允许空格
        // funcCallSpacing: 'never', // 不允许空格

        // 是否允许使用分号
        semi: true, // 使用分号
        // semi: false, // 不使用分号

        // 对象属性的引号风格
        quoteProps: "as-needed", // 只有当需要时才使用引号
        // quoteProps: 'always', // 始终使用引号
        // quoteProps: 'consistent', // 保持一致

        // 是否允许在模板字符串中使用单引号
        templateCurlySpacing: "never", // 不允许空格
        // templateCurlySpacing: 'always', // 总是允许空格

        // 是否允许在对象字面量中的逗号前有空格
        objectCurlySpacing: "never", // 不允许空格
        // objectCurlySpacing: 'always', // 总是允许空格

        // 是否允许在数组和对象的最后一个元素后面使用逗号
        trailingComma: "all", // 所有情况下都允许
        // trailingComma: 'es5', // ES5 风格
        // trailingComma: 'none', // 不允许

        // 是否允许在单行块语句中使用大括号
        blockSpacing: true, // 允许
        // blockSpacing: false, // 不允许

        // 是否允许在运算符两边使用空格
        operatorLinebreak: "before", // 在运算符之前
        // operatorLinebreak: 'after', // 在运算符之后
        // operatorLinebreak: 'none', // 不允许空格

        // 是否允许在注释前有空格
        commentSpacing: "always", // 总是允许空格
        // commentSpacing: 'never', // 不允许空格

        // 是否允许在对象字面量的属性和值之间使用空格
        keySpacing: "always", // 总是允许空格
        // keySpacing: 'never', // 不允许空格

        // 是否允许在对象字面量的属性和值之间使用空格
        objectPropertyNewline: "always", // 总是换行
        // objectPropertyNewline: 'never', // 不换行

        // 是否允许在函数调用时的括号前后使用空格
        spaceBeforeFunctionParen: "never", // 不允许空格
        // spaceBeforeFunctionParen: 'always', // 总是允许空格
        // spaceBeforeFunctionParen: 'alwaysTryFirst', // 尝试总是允许空格

        // 是否允许在函数声明时的括号前后使用空格
        spaceInfixOps: "always", // 总是允许空格
        // spaceInfixOps: 'never', // 不允许空格

        // 是否允许在函数声明时的括号前后使用空格
        spaceBeforeBlockStatements: true, // 允许空格
        // spaceBeforeBlockStatements: false, // 不允许空格

        // 是否允许在括号内使用空格
        spaceInParens: "never", // 不允许空格
        // spaceInParens: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceInFixOps: "always", // 总是允许空格
        // spaceInFixOps: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceUnaryOps: "always", // 总是允许空格
        // spaceUnaryOps: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceUnaryWords: "always", // 总是允许空格
        // spaceUnaryWords: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceAfterKeywords: "always", // 总是允许空格
        // spaceAfterKeywords: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceBeforeKeywords: "always", // 总是允许空格
        // spaceBeforeKeywords: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceBeforeSemicolon: "never", // 不允许空格
        // spaceBeforeSemicolon: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceAfterSemicolon: "never", // 不允许空格
        // spaceAfterSemicolon: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceAroundOperators: "always", // 总是允许空格
        // spaceAroundOperators: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceAroundTemplateLiterals: "always", // 总是允许空格
        // spaceAroundTemplateLiterals: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceBeforeTemplateLiterals: "always", // 总是允许空格
        // spaceBeforeTemplateLiterals: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceAfterTemplateLiterals: "always", // 总是允许空格
        // spaceAfterTemplateLiterals: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceBeforeParens: "never", // 不允许空格
        // spaceBeforeParens: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceAfterParens: "never", // 不允许空格
        // spaceAfterParens: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceBeforeBlocks: "always", // 总是允许空格
        // spaceBeforeBlocks: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceAfterBlocks: "always", // 总是允许空格
        // spaceAfterBlocks: 'never', // 不允许空格

        // 是否允许在括号内使用空格
        spaceBeforeBrackets: "never", // 不允许空格
        // spaceBeforeBrackets: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceAfterBrackets: "never", // 不允许空格
        // spaceAfterBrackets: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceBeforeSquareBrackets: "never", // 不允许空格
        // spaceBeforeSquareBrackets: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceAfterSquareBrackets: "never", // 不允许空格
        // spaceAfterSquareBrackets: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceBeforeCurlyBraces: "never", // 不允许空格
        // spaceBeforeCurlyBraces: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceAfterCurlyBraces: "never", // 不允许空格
        // spaceAfterCurlyBraces: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceBeforeObjectBraces: "never", // 不允许空格
        // spaceBeforeObjectBraces: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceAfterObjectBraces: "never", // 不允许空格
        // spaceAfterObjectBraces: 'always', // 总是允许空格

        // 是否允许在括号内使用空格
        spaceBeforeArrayBrackets: "never", // 不允许空格
        // spaceBeforeArrayBrackets: 'always', // 总是允许空格
    },
    // 启用 TypeScript 支持
    typescript: true,
}, {
    // 自定义规则覆盖
    rules: {
        "max-len": ["error", PRINTWIDTH, INDENT],

        // https://typescript-eslint.io/rules/no-unused-expressions/
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "off",

        // 允许 console.log 等语句
        "no-console": "off",
        // 关闭未使用的变量警告
        "unused-imports/no-unused-vars": "off",
        // 开启未使用的导入检查，设置为 2 表示警告级别
        "unused-imports/no-unused-imports": 2,

        // https://ota-meshi.github.io/eslint-plugin-regexp/rules/no-super-linear-backtracking.html
        "regexp/no-super-linear-backtracking": "off",
        // https://ota-meshi.github.io/eslint-plugin-regexp/rules/no-contradiction-with-assertion.html
        "regexp/no-contradiction-with-assertion": "off",

        // 关闭一致的类型导入规则
        "ts/consistent-type-imports": "off",
        // 允许使用全局的 process 变量
        "node/prefer-global/process": "off",
        // 允许使用全局的 Buffer 类
        "node/prefer-global/buffer": "off",

        // 设置导入顺序规则
        "import/order": [
            2,
            {
                "pathGroups": [
                    {
                        pattern: "~/**",
                        group: "external",
                        position: "after",
                    },
                ],
                "alphabetize": { order: "asc", caseInsensitive: false },
                "newlines-between": "always-and-inside-groups",
                "warnOnUnassignedImports": true,
            },
        ],
    },
});
