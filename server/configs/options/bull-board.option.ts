import type { IConfig } from '../config.interface'
import { ConfigService } from '@nestjs/config'

export const bullBoardModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    return configService.getOrThrow<IConfig['bull-board']>('bull-board')
  },
  inject: [ConfigService],
}
