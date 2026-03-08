import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { nitro } from 'nitro/vite'
import postcssNested from 'postcss-nested'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  css: {
    modules: {
      generateScopedName: '[local]__[hash:base64:5]',
    },
    postcss: {
      plugins: [autoprefixer(), postcssNested({ preserveEmpty: true })],
    },
  },
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
    nitro({
      serverDir: './server',
      serverEntry: './server/entry.ts',
      alias: {
        '~server': resolve(__dirname, 'server'),
        '~shared': resolve(__dirname, 'shared'),
      },
      rolldownConfig: {
        external: [
          'pg',
          'pg-query-stream',
          'mysql',
          'oracledb',
          'better-sqlite3',
          'sqlite3',
          'tedious',
        ],
        output: {},
      },
    }),
  ],
})
