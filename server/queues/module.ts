import type { ConfigSchema } from '../configs'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QueueNameEnum } from './constant'
import { OnlineUserQueue } from './online-user'

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
    ),
  ],
  providers: [OnlineUserQueue],
  exports: [BullModule],
})
export class QueuesModule {}
