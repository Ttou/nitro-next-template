import type { FactoryProvider } from '@nestjs/common'
import type { LoggerModuleOptions } from './interface'
import { ConsoleAppender, layout, Logger } from '@tsed/logger'
import { FileAppender } from '@tsed/logger-file'
import { BasicLayout } from '@tsed/logger/layouts/BasicLayout'
import { ColoredLayout } from '@tsed/logger/layouts/ColoredLayout'
import { LOGGER } from './constant'
import { CustomConsoleLayout } from './custom-console'
import { CustomJsonLayout } from './custom-json'
import { LOGGER_MODULE_OPTIONS } from './module-define'

layout('basic', BasicLayout)
layout('colored', ColoredLayout)
layout('customJson', CustomJsonLayout)
layout('customConsole', CustomConsoleLayout)

export const LoggerProvider: FactoryProvider = {
  provide: LOGGER,
  useFactory: async (options: LoggerModuleOptions) => {
    const logger = new Logger()

    logger.appenders
      .set('console', {
        type: ConsoleAppender,
        layout: {
          type: CustomConsoleLayout,
        },
      })

    if (options.dateFile) {
      logger.appenders.set('date-file', {
        type: FileAppender,
        layout: {
          type: CustomJsonLayout,
        },
        ...options.dateFile,
      })
    }

    return logger
  },
  inject: [LOGGER_MODULE_OPTIONS],
}
