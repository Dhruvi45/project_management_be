/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parserOptions: {
      project: "./tsconfig.json",
    },
    rules: {
      "no-console": "warn",
      semi: ["error", "always"],
    },
  },
];
