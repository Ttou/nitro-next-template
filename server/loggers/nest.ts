import type { LoggerService } from '@nestjs/common'
import { logger } from './logger'

export class NestLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    logger.info(message, optionalParams)
  }

  error(message: any, ...optionalParams: any[]) {
    logger.error(message, optionalParams)
  }

  warn(message: any, ...optionalParams: any[]) {
    logger.warn(message, optionalParams)
  }

  debug?(message: any, ...optionalParams: any[]) {
    logger.debug(message, optionalParams)
  }

  verbose?(message: any, ...optionalParams: any[]) {
    logger.debug(message, optionalParams)
  }

  fatal?(message: any, ...optionalParams: any[]) {
    logger.fatal(message, optionalParams)
  }
}
