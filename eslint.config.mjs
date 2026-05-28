import { defineConfig } from "eslint/config"
import nextPlugin from "@next/eslint-plugin-next"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import prettierConfig from "eslint-config-prettier"

export default defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,mts}"],
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...tsPlugin.configs["recommended"].rules,
    },
  },
  prettierConfig,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
])
