import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import { VitePluginEjsHtml } from './vite-plugins'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.')

  return {
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
      VitePluginEjsHtml({
        data: {
          title: env.VITE_APP_TITLE,
        },
      }),
    ],
  }
})
