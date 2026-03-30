import type { FactoryProvider } from '@nestjs/common'
import type { LoggerModuleOptions } from './interface'
import { ConsoleAppender, layout, Logger } from '@tsed/logger'
import { BasicLayout } from '@tsed/logger/layouts/BasicLayout'
import { ColoredLayout } from '@tsed/logger/layouts/ColoredLayout'
import { LOGGER } from './constant'
import { CustomConsoleLayout } from './custom-console'
import { LOGGER_MODULE_OPTIONS } from './module-define'

layout('basic', BasicLayout)
layout('colored', ColoredLayout)
layout('customConsole', CustomConsoleLayout)

export const LoggerProvider: FactoryProvider = {
  provide: LOGGER,
  useFactory: async (options: LoggerModuleOptions) => {
    const logger = new Logger()

    logger.appenders.set('console', {
      type: ConsoleAppender,
      layout: {
        type: CustomConsoleLayout,
      },
    })

    return logger
  },
  inject: [LOGGER_MODULE_OPTIONS],
}
