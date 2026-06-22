import type { ConfigType } from '@nestjs/config'
import type { Params as LoggerModuleOptions } from 'nestjs-pino'
import { registerAs } from '@nestjs/config'
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
            const responseTime = log.responseTime !== undefined ? colors.yellow(`[${log.responseTime}ms]`) : undefined

            return [
              responseTime ? colors.gray(`[HttpLogging]`) : undefined,
              log.context ? colors.gray(`[${log.context}]`) : undefined,
              log.req?.id ? colors.gray(`[${log.req.id}]`) : undefined,
              log.namespace ? colors.gray(`[${log.namespace}]`) : undefined, // ORM 日志命名空间
              log[messageKey],
              responseTime,
            ]
              .filter(Boolean)
              .join(' ')
          },
        }),
        customSuccessMessage(req, res, responseTime) {
          return `${req.method} - ${req.url} - ${res.statusCode}`
        },
        customErrorMessage(req, res, err) {
          return `${req.method} - ${req.url} - ${res.statusCode}`
        },

      },
      exclude: ['/bull-ui/*splat', '/openapi-*splat'],
    }))
    .with(AppEnvEnum.PROD, () => ({

    }))
    .run()
})

export type ILoggerConfig = ConfigType<typeof LoggerConfig>
