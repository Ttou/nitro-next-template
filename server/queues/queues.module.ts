import type { DynamicModule } from '@nestjs/common'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { ConfigService } from '@nestjs/config'
import { bullBoardModuleAsyncOptions, BullModuleOptions } from '~server/configs'
import { LoginLogProcessor } from './login-log.processor'
import { QueueForFeature, QueueForRegister } from './queues.constant'
import { StorageOrphanProcessor } from './storage-orphan.processor'
import { StorageOrphanScheduler } from './storage-orphan.scheduler'

export const QueuesModule: DynamicModule = {
  global: true,
  imports: [
    BullModule.forRootAsync({
      useClass: BullModuleOptions,
      inject: [ConfigService],
    }),
    BullModule.registerQueue(...QueueForRegister),
    BullBoardModule.forRootAsync(bullBoardModuleAsyncOptions),
    BullBoardModule.forFeature(...QueueForFeature),
  ],
  providers: [
    LoginLogProcessor,
    StorageOrphanProcessor,
    StorageOrphanScheduler,
  ],
  exports: [BullModule],
  module: class QueuesModule {},
}
