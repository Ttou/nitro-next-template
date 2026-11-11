import type { IConfig, ISharedConfig } from './config.interface'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ExpressAdapter } from '@bull-board/express'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import { LocalDisk } from '@nestjs/storage'
import { createJwtStrategyConfig, JwtStrategy } from '@xlt-token/jwt'
import { nativeLoggerOptions } from 'nestjs-pino'
import pinoPretty from 'pino-pretty'
import { match } from 'ts-pattern'
import * as entities from '~db/entities'
import { genSalt } from '~nestjs-modules/hash'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { CustomOrmLogger, xltEventBuffer } from '~server/customs'
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
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  return {
    'shared': sharedConfig,
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
          '/inspector/*splat',
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
        eventSink: xltEventBuffer.sink,
        strategy: {
          useValue: new JwtStrategy(
            createJwtStrategyConfig({
              activeKid: '2026-08',
              keys: [
                { kid: '2026-08', algorithm: 'HS256', secret: 'c426fcc9dd2776153bb58b8b9ec69f3c53f02a2053f398ca513f4104ad482ad5' },
              ],
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
      .with(AppEnvEnum.DEV, () => ({
        route: '/bull-ui',
        adapter: ExpressAdapter,
        boardOptions: {
          uiBasePath: dirname(resolve(__dirname, '../../node_modules/@bull-board/ui/package.json')),
        },
      }))
      .with(AppEnvEnum.PROD, () => ({} as IConfig['bull-board']))
      .run(),
  }
})
