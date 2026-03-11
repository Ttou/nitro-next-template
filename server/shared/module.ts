import type { ConfigSchema } from '../configs'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { ContextService } from './context'
import { LogoutService } from './logout'
import { ParseService } from './parse'

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
    ParseService,
    LogoutService,
  ],
  exports: [
    MulterModule,
    ContextService,
    ParseService,
    LogoutService,
  ],
})
export class SharedModule {}
