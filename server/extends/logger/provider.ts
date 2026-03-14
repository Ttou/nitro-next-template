import type { FactoryProvider } from '@nestjs/common'
import type { LogEvent } from '@tsed/logger'
import type { LoggerModuleOptions } from './interface'
import { Logger } from '@tsed/logger'
import { PatternLayout } from '@tsed/logger-pattern-layout'
import { StdoutAppender } from '@tsed/logger-std'
import { ClsServiceManager } from 'nestjs-cls'
import { colorGray, colorYellow } from '~server/utils'
import { formatTime } from '~shared/utils'
import { LOGGER } from './constant'
import { LOGGER_MODULE_OPTIONS } from './module-define'

export const LoggerProvider: FactoryProvider = {
  provide: LOGGER,
  useFactory: async (options: LoggerModuleOptions) => {
    const logger = new Logger()

    logger.appenders.set('console', {
      type: StdoutAppender,
      level: ['debug', 'info', 'trace', 'fatal', 'error', 'warn'],
      layout: {
        type: PatternLayout,
        pattern: '%x{time} [%z] %[[%p]%] %x{message}',
        tokens: {
          time: (logEvent: LogEvent) => {
            return `[${formatTime(logEvent.startTime, 'YYYY-MM-DD HH:mm:ss.SSS')}]`
          },
          message: (logEvent: LogEvent) => {
            const [message, rest] = logEvent.data
            const cls = ClsServiceManager.getClsService()
            const requestId = cls.getId()

            return [
              rest?.context ? colorYellow(`[${rest.context}]`) : undefined,
              requestId ? colorGray(`[${requestId}]`) : undefined,
              `${message}`,
            ]
              .filter(v => v !== undefined)
              .join(' ')
          },
        },
      },
    })

    return logger
  },
  inject: [LOGGER_MODULE_OPTIONS],
}
