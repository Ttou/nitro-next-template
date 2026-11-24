import type { LoggerModuleAsyncParams } from 'nestjs-pino'
import type { IConfig } from '../config.interface'
import { ConfigService } from '@nestjs/config'

export const loggerModuleAsyncOptions: LoggerModuleAsyncParams = {
  useFactory: (configService: ConfigService) => {
    return configService.getOrThrow<IConfig['logger']>('logger')
  },
  inject: [ConfigService],
}
