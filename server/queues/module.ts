import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { BullBoardConfig, BullConfig } from '../configs'
import { QueueNameEnum } from './constant'
import { LoginLogQueue } from './login-log'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync(BullConfig.asProvider()),
    BullModule.registerQueue(
      { name: QueueNameEnum.LOGIN_LOG },
    ),
    BullBoardModule.forRootAsync(BullBoardConfig.asProvider()),
    BullBoardModule.forFeature(
      {
        name: QueueNameEnum.LOGIN_LOG,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [
    LoginLogQueue,
  ],
  exports: [BullModule],
})
export class QueuesModule {}
