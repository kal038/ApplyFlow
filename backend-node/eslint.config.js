import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2022,
      },
      globals: {
        node: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      import: importPlugin,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // Import rules
      "import/no-unresolved": "off", // Turn off or configure resolver

      // General rules
      "no-console": "off", // Change to "off" to disable console warnings
      "no-unused-vars": "off", // Turned off in favor of @typescript-eslint/no-unused-vars
      "no-undef": "off", // TypeScript handles this
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
];
