import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { BullBoardConfig, BullConfig } from '../configs'
import { QueueNameEnum } from './constant'
import { OperateQueue } from './operate'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync(BullConfig.asProvider()),
    BullModule.registerQueue(
      { name: QueueNameEnum.OPERATE },
    ),
    BullBoardModule.forRootAsync(BullBoardConfig.asProvider()),
    BullBoardModule.forFeature(
      {
        name: QueueNameEnum.OPERATE,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [
    OperateQueue,
  ],
  exports: [BullModule],
})
export class QueuesModule {}
