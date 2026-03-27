import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist", "node_modules"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: globals.node,
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },

    rules: {
      //  General rules
      "no-console": "warn",
      "no-debugger": "error",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      //  Clean code
      "prefer-const": "warn",
    },
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
]);