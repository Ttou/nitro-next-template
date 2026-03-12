import type { ConfigSchema } from '../configs'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { ContextService } from './context'
import { IpService } from './ip'
import { LogoutService } from './logout'

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
    LogoutService,
    IpService,
  ],
  exports: [
    MulterModule,
    ContextService,
    LogoutService,
    IpService,
  ],
})
export class SharedModule {}
