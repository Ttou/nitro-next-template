import type { LogContext, LoggerNamespace } from '@mikro-orm/core'
import { DefaultLogger } from '@mikro-orm/core'
import { pascalCase } from 'es-toolkit'
import { logger } from './logger'

export class OrmLogger extends DefaultLogger {
  override log(namespace: LoggerNamespace, message: string, context?: LogContext) {
    logger.info(message, { 0: pascalCase(namespace), ...context })
  }

  override error(namespace: LoggerNamespace, message: string, context?: LogContext) {
    logger.error(message, { 0: pascalCase(namespace), ...context })
  }

  override warn(namespace: LoggerNamespace, message: string, context?: LogContext) {
    logger.warn(message, { 0: pascalCase(namespace), ...context })
  }
}
