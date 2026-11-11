import type { Plugin } from 'rolldown'
import { copyFile, cp, mkdir, rm, stat } from 'node:fs/promises'
import { isAbsolute, dirname as pathDirname, resolve } from 'node:path'
import { defineConfig } from 'nitro'

const dirname = import.meta.dirname

/** 源路径（相对项目根），或 [源路径, 目标路径（相对 .server）] */
type DeployPath = string | [source: string, target: string]

/** deploy/ 下的内容平铺到产物根，其余路径按原结构镜像到 .server/ */
function defaultTarget(source: string): string {
  return source.startsWith('deploy/')
    ? source.slice('deploy/'.length)
    : source
}

function resolveDeployPath(entry: DeployPath): [source: string, target: string] {
  if (typeof entry === 'string') {
    return [
      entry,
      defaultTarget(entry),
    ]
  }
  return entry
}

/**
 * 复制部署所需的文件或目录到 .server/。
 * 目录递归复制（源为 pnpm 符号链接时解引用，保证产物可独立运行），复制前清空旧目标目录。
 * 源不存在时告警跳过：密钥由 pnpm gen:secrets 生成，未准备时让服务启动给出明确报错。
 */
function copyDeployFiles(paths: DeployPath[]): Plugin {
  return {
    name: 'copy-deploy-files',
    async closeBundle() {
      const outDir = resolve(dirname, '.server')
      await mkdir(outDir, { recursive: true })

      for (const entry of paths) {
        const [source, target] = resolveDeployPath(entry)

        if (isAbsolute(target) || target === '..' || target.startsWith('../')) {
          throw new Error(`[copy-deploy-files] 目标路径必须位于 .server/ 内：${target}`)
        }

        const src = resolve(dirname, source)
        const dest = resolve(outDir, target)

        let isDir: boolean
        try {
          isDir = (await stat(src)).isDirectory()
        }
        catch (err) {
          if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn(`[copy-deploy-files] 跳过不存在的路径：${source}`)
            continue
          }
          throw err
        }

        await mkdir(pathDirname(dest), { recursive: true })
        if (isDir) {
          await rm(dest, { recursive: true, force: true })
          await cp(src, dest, { recursive: true, dereference: true, force: true })
        }
        else {
          await copyFile(src, dest)
        }
      }
    },
  }
}

export default defineConfig({
  serverDir: './server',
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
  $development: {
    serverEntry: false,
    routes: {
      '/:path(api|bull-ui|openapi-json|health)/**': {
        handler: './server/main.ts',
        format: 'node',
      },
    },
  },
  $production: {
    // 前端静态资源由 build:web 独立产出，服务端构建不再打包
    noPublicDir: true,
    renderer: false,
    serverEntry: {
      handler: './server/main.ts',
      format: 'node',
    },
    traceDeps: ['reflect-metadata', 'tslib'],
    // NestJS 依赖 legacy 装饰器与 design:* 元数据做依赖注入，需显式交给 Oxc 处理
    rolldownConfig: {
      plugins: [
        copyDeployFiles([
          'deploy/.env.deploy',
          'deploy/package.json',
          'deploy/auth-rsa-public.pem',
          'deploy/auth-rsa-private.pem',
          'deploy/jwt-keys.json',
          // bull-board 面板的静态资源，prod 下按 node_modules 解析 uiBasePath
          'node_modules/@bull-board/ui',
        ]),
      ],
      transform: {
        decorator: {
          legacy: true,
          emitDecoratorMetadata: true,
        },
      },
    },
  },
})
