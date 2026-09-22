import type { PluginOption } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'

// https://vite.dev/config/
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
      nitro({
        serverDir: './server',
        serverEntry: false,
        routes: {
          '/:path(api|bull-ui|openapi-json)/**': {
            handler: './server/main.ts',
            format: 'node',
          },
        },
        alias: {
          '~db': resolve(dirname, 'db'),
          '~server': resolve(dirname, 'server'),
          '~shared': resolve(dirname, 'shared'),
          '~fastify-plugins': resolve(dirname, 'fastify-plugins'),
          '~nestjs-modules': resolve(dirname, 'nestjs-modules'),
        },
      }),
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
