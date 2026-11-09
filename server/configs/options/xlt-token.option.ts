import type { XltTokenModuleAsyncOptions } from '@xlt-token/nestjs'
import type { IConfig } from '../config.interface'
import { ConfigService } from '@nestjs/config'
import { CustomXltRedis, CustomXltStp } from '~server/customs'

export const xltTokenModuleAsyncOptions: XltTokenModuleAsyncOptions = {
  isGlobal: true,
  stpInterface: CustomXltStp,
  store: {
    useClass: CustomXltRedis,
  },
  useFactory: (configService: ConfigService) => {
    return configService.getOrThrow<IConfig['xlt-token']>('xlt-token')
  },
  inject: [ConfigService],
}
