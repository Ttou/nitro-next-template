import type { IAuthConfig, IConfig, ISharedConfig } from './config.interface'
import { generateKeyPairSync } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { cwd, env } from 'node:process'
import { ExpressAdapter } from '@bull-board/express'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import { LocalDisk } from '@nestjs/storage'
import { createJwtStrategyConfig, JwtStrategy } from '@xlt-token/jwt'
import { nativeLoggerOptions } from 'nestjs-pino'
import pinoPretty from 'pino-pretty'
import { match, P } from 'ts-pattern'
import * as entities from '~db/entities'
import { genSalt } from '~nestjs-modules/hash'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { CustomOrmLogger } from '~server/customs'
import { generateId } from '~shared/utils'

/** 各环境共用配置 */
export const sharedConfig: ISharedConfig = match(APP_ENV)
  .returnType<ISharedConfig>()
  .with(AppEnvEnum.DEV, () => ({
    appName: 'nitro_template',
    basicAuth: {
      user: 'admin',
      pass: '123456',
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
  }))
  .with(AppEnvEnum.PROD, () => ({} as ISharedConfig))
  .run()

/**
 * 未配置路径时的默认密钥文件（相对进程工作目录）。
 * 密钥由 pnpm gen:secrets 生成到 deploy/；dev 直接读源码目录，
 * prod 读构建产物根目录（nitro 构建时已把 deploy/ 下的密钥复制到 .server/）。
 */
const defaultKeyDir = APP_ENV === AppEnvEnum.DEV
  ? 'deploy'
  : '.'
const DEFAULT_AUTH_PUBLIC_KEY_PATH = join(defaultKeyDir, 'auth-rsa-public.pem')
const DEFAULT_AUTH_PRIVATE_KEY_PATH = join(defaultKeyDir, 'auth-rsa-private.pem')

/** 从 PEM 文件读取密钥，相对路径以进程工作目录为基准 */
function readAuthKeyFile(envName: string, filePath: string): string {
  const absPath = resolve(filePath)
  try {
    return readFileSync(absPath, 'utf8')
  }
  catch (err) {
    throw new Error(`读取 ${envName} 指向的密钥文件失败：${absPath}`, { cause: err })
  }
}

/** JWT 签名密钥文件（由 pnpm gen:secrets 生成到 deploy/） */
const JWT_KEYS_PATH = join(defaultKeyDir, 'jwt-keys.json')
type JwtKeys = Parameters<typeof createJwtStrategyConfig>[0]['keys']

/** 从 JSON 文件读取 JWT keys，相对路径以进程工作目录为基准 */
function readJwtKeys(): JwtKeys {
  const absPath = resolve(JWT_KEYS_PATH)
  try {
    return JSON.parse(readFileSync(absPath, 'utf8')) as JwtKeys
  }
  catch (err) {
    throw new Error(`读取 JWT 密钥文件失败：${absPath}，请执行 pnpm gen:secrets`, { cause: err })
  }
}

/**
 * 登录密码加密密钥对。
 * AUTH_RSA_PUBLIC_KEY / AUTH_RSA_PRIVATE_KEY 为 PEM 文件路径（不再是密钥内容），
 * 未配置时回退到 deploy/（prod 为构建产物根目录）下的默认文件；都取不到时 dev 临时生成、prod 直接失败。
 * 前端每次登录都会重新拉取公钥，因此 dev 的临时密钥不影响登录。
 */
function createAuthKeys(): IAuthConfig {
  const publicKeyPath = env.AUTH_RSA_PUBLIC_KEY || DEFAULT_AUTH_PUBLIC_KEY_PATH
  const privateKeyPath = env.AUTH_RSA_PRIVATE_KEY || DEFAULT_AUTH_PRIVATE_KEY_PATH

  // 防止沿用旧配置把 PEM 内容直接塞进环境变量：那样会被当成路径，且私钥可能出现在报错中
  if ([publicKeyPath, privateKeyPath].some(value => value.includes('-----BEGIN'))) {
    throw new Error('AUTH_RSA_PUBLIC_KEY / AUTH_RSA_PRIVATE_KEY 现为 PEM 文件路径，不再接受密钥内容；请执行 pnpm gen:secrets 生成密钥文件')
  }

  if (existsSync(resolve(publicKeyPath)) && existsSync(resolve(privateKeyPath))) {
    return {
      publicKey: readAuthKeyFile('AUTH_RSA_PUBLIC_KEY', publicKeyPath),
      privateKey: readAuthKeyFile('AUTH_RSA_PRIVATE_KEY', privateKeyPath),
    }
  }

  // 生产环境缺文件时直接失败，避免多实例各自生成密钥导致登录随机解密失败
  if (APP_ENV === AppEnvEnum.PROD) {
    throw new Error(
      '缺少登录 RSA 密钥文件，请配置 AUTH_RSA_PUBLIC_KEY / AUTH_RSA_PRIVATE_KEY 为 PEM 文件路径，或执行 pnpm gen:secrets 后重新 build:server：\n'
      + `  publicKey:  ${resolve(publicKeyPath)}\n`
      + `  privateKey: ${resolve(privateKeyPath)}`,
    )
  }

  const pair = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })

  return {
    publicKey: pair.publicKey,
    privateKey: pair.privateKey,
  }
}

/**
 * 默认 local 磁盘实例。uploadToDisk 按磁盘名解析时依赖按 HTTP server 实例建立的注册表，
 * 而 dev 环境应用只 app.init() 不 listen、请求由 nitro 服务器处理，注册表无法命中，
 * 因此上传处需直接传入该实例
 */
export const localDisk = new LocalDisk({
  root: match(APP_ENV)
    .returnType<string>()
    .with(AppEnvEnum.DEV, () => './uploads')
    .with(AppEnvEnum.PROD, () => join(tmpdir(), 'nestjs-tmp-storage'))
    .run(),
})

export const configuration = registerAs<IConfig>('', (): IConfig => {
  const { appName, redis } = sharedConfig

  return {
    'auth': createAuthKeys(),
    'cls': match(APP_ENV)
      .returnType<IConfig['cls']>()
      .with(AppEnvEnum.DEV, () => ({
        middleware: {
          mount: true,
          saveReq: true,
          saveRes: true,
          generateId: true,
          idGenerator: req => (req.id = generateId()),
        },
      }))
      .with(AppEnvEnum.PROD, () => ({}) as IConfig['cls'])
      .run(),
    'logger': match(APP_ENV)
      .returnType<IConfig['logger']>()
      .with(AppEnvEnum.DEV, () => ({
        pinoHttp: {
          stream: pinoPretty({
            hideObject: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            messageFormat(log, messageKey, levelLabel, { colors }) {
              /**
               * 响应时间
               * @description 请求会记录响应时间
               */
              const responseTime = log.responseTime !== undefined
                ? colors.yellow(`[${log.responseTime}ms]`)
                : undefined
              // NativeLogger 把异常序列化到 log.error，pino-http 请求错误挂在 log.err
              const errorObj = (log.error as { stack?: string } | undefined)
                ?? (log.err as { stack?: string } | undefined)
              // 仅 NativeLogger 的异常打印堆栈；pino-http customErrorMessage 不打印堆栈
              const errorStack = (log.error as { stack?: string } | undefined)?.stack

              const message = [
                responseTime
                  ? colors.gray(`[HttpLogging]`)
                  : undefined,
                log.context
                  ? colors.gray(`[${log.context}]`)
                  : undefined,
                log.req?.id
                  ? colors.gray(`[${log.req.id}]`)
                  : undefined,
                log.namespace
                  ? colors.gray(`[${log.namespace}]`)
                  : undefined, // ORM 日志命名空间
                log[messageKey],
                responseTime,
              ]
                .filter(Boolean)
                .join(' ')

              // 错误日志（含 pino-http customErrorMessage）的消息与堆栈使用 ERROR 级别颜色（红色）
              if (errorObj) {
                if (errorStack) {
                  return `${colors.red(message)}\n${colors.red(errorStack)}`
                }
                return colors.red(message)
              }
              return message
            },
          }),
          customSuccessMessage(req, res, responseTime) {
            return `${req.method} - ${req.url} - ${res.statusCode}`
          },
          customErrorMessage(req, res, err) {
            return `${req.method} - ${req.url} - ${res.statusCode}`
          },
        },
        exclude: [
          '/bull-*splat',
          '/health',
          '/openapi-*splat',
        ],
        nativeLogger: {
          // 让对象形式的附加参数展开到日志根字段，例如 ORM 日志的 namespace
          flattenParams: true,
        },
      }))
      .with(AppEnvEnum.PROD, () => ({
        pinoHttp: nativeLoggerOptions,
      }))
      .run(),
    'redis': match(APP_ENV)
      .returnType<IConfig['redis']>()
      .with(AppEnvEnum.DEV, () => ({
        type: 'single',
        options: {
          ...redis,
        },
      }))
      .with(AppEnvEnum.PROD, () => ({} as IConfig['redis']))
      .run(),
    'mikro-orm': match(APP_ENV)
      .returnType<IConfig['mikro-orm']>()
      .with(AppEnvEnum.DEV, () => ({
        driver: MySqlDriver,
        metadataProvider: ReflectMetadataProvider,
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'root',
        dbName: 'nitro_template',
        debug: true,
        entities: Object.values(entities),
        loggerFactory: options => new CustomOrmLogger(options),
      }))
      .with(AppEnvEnum.PROD, () => ({}))
      .run(),
    'storage': {
      default: 'local',
      disks: {
        local: localDisk,
      },
    },
    'alova': match(APP_ENV)
      .returnType<IConfig['alova']>()
      .with(AppEnvEnum.DEV, () => ({}))
      .with(AppEnvEnum.PROD, () => ({}))
      .run(),
    'xlt-token': match(APP_ENV)
      .returnType<IConfig['xlt-token']>()
      .with(AppEnvEnum.DEV, () => ({
        config: {
          timeout: '7d',
        },
        strategy: {
          useValue: new JwtStrategy(
            createJwtStrategyConfig({
              activeKid: '2026-08',
              keys: readJwtKeys(),
              issuer: 'xlt-token',
            }),
          ),
        },
      }))
      .with(AppEnvEnum.PROD, () => ({}))
      .run(),
    'cache': match(APP_ENV)
      .returnType<IConfig['cache']>()
      .with(AppEnvEnum.DEV, () => ({
        keyPrefix: [appName, 'cache'].join(':'),
        expire: '15m',
      }))
      .with(AppEnvEnum.PROD, () => ({}))
      .run(),
    'captcha': match(APP_ENV)
      .returnType<IConfig['captcha']>()
      .with(AppEnvEnum.DEV, () => ({
        keyPrefix: [appName, 'captcha'].join(':'),
        expire: '3m',
      }))
      .with(AppEnvEnum.PROD, () => ({}))
      .run(),
    'excel': match(APP_ENV)
      .returnType<IConfig['excel']>()
      .with(AppEnvEnum.DEV, () => ({}))
      .with(AppEnvEnum.PROD, () => ({}))
      .run(),
    'hash': match(APP_ENV)
      .returnType<IConfig['hash']>()
      .with(AppEnvEnum.DEV, () => ({
        bcrypt: {
          salt: genSalt(),
          costFactor: 10,
        },
      }))
      .with(AppEnvEnum.PROD, () => ({}))
      .run(),
    'bull': match(APP_ENV)
      .returnType<IConfig['bull']>()
      .with(AppEnvEnum.DEV, () => ({
        prefix: [appName, 'bull'].join(':'),
        connection: {
          ...redis,
        },
      }))
      .with(AppEnvEnum.PROD, () => ({} as IConfig['bull']))
      .run(),
    'bull-board': match(APP_ENV)
      .returnType<IConfig['bull-board']>()
      .with(P.union(AppEnvEnum.DEV, AppEnvEnum.PROD), () => ({
        route: '/bull-ui',
        adapter: ExpressAdapter,
        boardOptions: {
          // 以启动命令的 cwd 为基准，避免打包后 __dirname 指向构建产物目录导致路径失效
          uiBasePath: join(cwd(), 'node_modules/@bull-board/ui'),
        },
      }))
      .run(),
  }
})
