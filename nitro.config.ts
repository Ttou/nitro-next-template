import { resolve } from 'node:path'
import { defineConfig } from 'nitro'

const dirname = import.meta.dirname

export default defineConfig({
  serverDir: './server',
  serverEntry: false,
  routes: {
    '/:path(api|bull-ui|openapi-json|openapi-ui|health)/**': {
      handler: './server/main.ts',
      format: 'node',
    },
  },
  alias: {
    '~db': resolve(dirname, 'db'),
    '~server': resolve(dirname, 'server'),
    '~shared': resolve(dirname, 'shared'),
    '~nestjs-modules': resolve(dirname, 'nestjs-modules'),
  },
  output: {
    dir: './.server',
    serverDir: './.server',

  },
  $production: {
    // 前端静态资源由 build:web 独立产出，服务端构建不再打包
    noPublicDir: true,
    renderer: false,
    traceDeps: ['reflect-metadata', 'tslib'],
  },
})
