import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import { VitePluginEjsHtml } from './plugins/index.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.')
  const dirname = import.meta.dirname

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
    plugins: [
      vue(),
      nitro(),
      VitePluginEjsHtml({
        data: {
          title: env.VITE_APP_TITLE,
        },
      }),
    ],
  }
})
