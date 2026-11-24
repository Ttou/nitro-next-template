import type { ClsModuleAsyncOptions } from 'nestjs-cls'
import type { IConfig } from '../config.interface'
import { ConfigService } from '@nestjs/config'

export const clsModuleAsyncOptions: ClsModuleAsyncOptions = {
  global: true,
  useFactory: (configService: ConfigService) => {
    return configService.getOrThrow<IConfig['cls']>('cls')
  },
  inject: [ConfigService],
}
