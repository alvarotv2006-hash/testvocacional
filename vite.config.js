import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { includedRoutes } from './src/data/routes.js'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes,
  },
})
