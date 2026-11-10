import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'nitro'
import type { Plugin } from 'rolldown'

const dirname = import.meta.dirname

function copyDeployFiles(): Plugin {
  return {
    name: 'copy-deploy-files',
    async closeBundle() {
      const outDir = resolve(dirname, '.server')
      await mkdir(outDir, { recursive: true })
      for (const file of ['.env.deploy', 'package.json']) {
        await copyFile(resolve(dirname, 'deploy', file), resolve(outDir, file))
      }
    },
  }
}

export default defineConfig({
  serverDir: './server',
  serverEntry: false,
  routes: {
    '/:path(api|bull-ui|openapi-json|openapi-ui|health|inspector)/**': {
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
    // NestJS 依赖 legacy 装饰器与 design:* 元数据做依赖注入，需显式交给 Oxc 处理
    rolldownConfig: {
      plugins: [copyDeployFiles()],
      transform: {
        decorator: {
          legacy: true,
          emitDecoratorMetadata: true,
        },
      },
    },
  },
})
