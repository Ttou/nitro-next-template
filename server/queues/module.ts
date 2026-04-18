import type { ConfigSchema } from '../configs'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QueueNameEnum } from './constant'
import { OfflineQueue } from './offline'
import { OnlineQueue } from './online'
import { OperateQueue } from './operate'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get<ConfigSchema['bull']>('bull')!
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QueueNameEnum.ONLINE },
      { name: QueueNameEnum.OPERATE },
      { name: QueueNameEnum.OFFLINE },
    ),
    BullBoardModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get<ConfigSchema['bullBoard']>('bullBoard')!
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forFeature(
      {
        name: QueueNameEnum.ONLINE,
        adapter: BullMQAdapter,
      },
      {
        name: QueueNameEnum.OPERATE,
        adapter: BullMQAdapter,
      },
      {
        name: QueueNameEnum.OFFLINE,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [OnlineQueue, OperateQueue, OfflineQueue],
  exports: [BullModule],
})
export class QueuesModule {}
