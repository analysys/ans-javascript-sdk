const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    wx: true,
    Page: true,
    App: true,
    Component: true,
    getCurrentPages: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "@typescript-eslint/no-this-alias": ["error", {
      allowedNames: ['_this', 'self']
    }],
    "@typescript-eslint/no-explicit-any": ["off"]
  },
});
