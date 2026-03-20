import type { OnModuleInit } from '@nestjs/common'
import type { IServer } from '~server/interfaces'
import type { ConfigSchema } from '../configs'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost } from '@nestjs/core'
import { QueueNameEnum } from './constant'
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
    ),
  ],
  providers: [OnlineQueue, OperateQueue],
  exports: [BullModule],
})
export class QueuesModule implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private httpAdapterHost: HttpAdapterHost,
  ) {}

  onModuleInit() {
    const server = this.httpAdapterHost.httpAdapter.getInstance<IServer>()
    const bullBoardConfig = this.configService.get<ConfigSchema['bullBoard']>('bullBoard')!

    server.addHook('onRequest', (req, res, next) => {
      if (req.url.startsWith(bullBoardConfig.route)) {
        bullBoardConfig.middleware(req.raw, res.raw, next)
      }
      else {
        next()
      }
    })
  }
}
