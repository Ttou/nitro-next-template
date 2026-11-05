import type { ConfigType } from '@nestjs/config'
import type { Params as LoggerModuleOptions } from 'nestjs-pino'
import { registerAs } from '@nestjs/config'
import { nativeLoggerOptions } from 'nestjs-pino'
import pinoPretty from 'pino-pretty'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'

export const LoggerConfig = registerAs('logger', () => {
  return match(APP_ENV)
    .returnType<LoggerModuleOptions>()
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
      exclude: ['/bull-*splat', '/openapi-*splat'],
      nativeLogger: {
        // 让对象形式的附加参数展开到日志根字段，例如 ORM 日志的 namespace
        flattenParams: true,
      },
    }))
    .with(AppEnvEnum.PROD, () => ({
      pinoHttp: nativeLoggerOptions,
    }))
    .run()
})

export type ILoggerConfig = ConfigType<typeof LoggerConfig>
