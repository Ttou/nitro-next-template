import type { ConfigSchema } from '../configs'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QueueNameEnum } from './constant'
import { OnlineUserQueue } from './online-user'
import { OperateLogQueue } from './operate-log'

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
      { name: QueueNameEnum.ONLINE_USER },
      { name: QueueNameEnum.OPERATE_LOG },
    ),
    BullBoardModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get<ConfigSchema['bullBoard']>('bullBoard')!
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forFeature(
      {
        name: QueueNameEnum.ONLINE_USER,
        adapter: BullMQAdapter,
      },
      {
        name: QueueNameEnum.OPERATE_LOG,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [OnlineUserQueue, OperateLogQueue],
  exports: [BullModule],
})
export class QueuesModule {}
