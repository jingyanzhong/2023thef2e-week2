/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'standard' // 多加入這行
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
