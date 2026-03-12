import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '~web/',
        replacement: `${resolve(__dirname, 'src')}/`,
      },
      {
        find: '~shared/',
        replacement: `${resolve(__dirname, 'shared')}/`,
      },
    ],
  },
  publicDir: false,
  plugins: [
    vue(),
    nitro(),
  ],
})
