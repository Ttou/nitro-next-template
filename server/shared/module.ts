import type { ConfigSchema } from '../configs'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { ContextService } from './context'
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
  ],
  exports: [
    MulterModule,
    ContextService,
    ParseService,
  ],
})
export class SharedModule {}
