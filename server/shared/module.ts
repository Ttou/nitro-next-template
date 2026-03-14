import type { ConfigSchema } from '../configs'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { ContextService } from './context'
import { IpService } from './ip'

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.get<ConfigSchema['multer']>('multer')!
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    ContextService,
    IpService,
  ],
  exports: [
    MulterModule,
    ContextService,
    IpService,
  ],
})
export class SharedModule {}
