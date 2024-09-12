import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  react.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs,mjs}"],
    ignores: ["dist", "node_modules"],
    plugins: {
      "@stylistic": stylistic,
      react,
    },
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.react,
      },
    },
    rules: {
      "@stylistic/quotes": ["error", "double", {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/no-trailing-spaces": ["error"],
      "curly": ["error", "all"],
      "arrow-body-style": ["off", "as-needed"],
      "brace-style": ["warn", "1tbs"],
      "class-methods-use-this": ["warn"],
      "consistent-return": ["warn"],
      "no-alert": ["warn"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": ["warn"],
      "no-await-in-loop": ["warn"],
      "no-param-reassign": ["warn", { props: false }],
      "no-plusplus": ["warn", { "allowForLoopAfterthoughts": true }],
      "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
      "no-return-assign": ["warn", "except-parens"],
      "no-return-await": ["warn"],
      "no-shadow": ["warn", { hoist: "all", allow: ["resolve", "reject", "done", "next", "err", "error"] }],
      "no-use-before-define": ["warn"],
      "no-var": ["warn"],
    },
  },
];
