import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '~web',
        replacement: `${resolve(__dirname, 'web')}`,
      },
      {
        find: '~shared',
        replacement: `${resolve(__dirname, 'shared')}`,
      },
    ],
  },
  plugins: [
    vue(),
    nitro({
      serverDir: './server',
      serverEntry: './server/entry.ts',
      alias: {
        '~server': resolve(__dirname, 'server'),
        '~shared': resolve(__dirname, 'shared'),
      },
    }),
  ],
})
