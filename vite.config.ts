import type { PluginOption } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.')
  const dirname = import.meta.dirname
  const plugins: PluginOption[] = [
    vue(),
    ViteEjsPlugin({
      title: env.VITE_APP_TITLE,
    }),
  ]

  if (mode === 'development') {
    plugins.push(
      nitro(),
    )
  }

  return {
    resolve: {
      alias: [
        {
          find: '~web/',
          replacement: `${resolve(dirname, 'web')}/`,
        },
        {
          find: '~shared/',
          replacement: `${resolve(dirname, 'shared')}/`,
        },
      ],
    },
    publicDir: false,
    plugins,
    build: {
      outDir: './.web',
    },
  }
})
