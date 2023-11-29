import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dsv from '@rollup/plugin-dsv'
const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dsv()
  ],
  base: '/2023thef2e-week2/',
  publicPath: process.env.NODE_ENV === 'production' ? '/2023thef2e-week2/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
    }
  }
})
