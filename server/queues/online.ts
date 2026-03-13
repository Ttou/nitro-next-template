import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { LoggerService } from '~server/extends'
import { SysOnlineEntity } from '../entities'
import { IpService } from '../shared'
import { QueueNameEnum } from './constant'

@Processor(QueueNameEnum.ONLINE)
export class OnlineQueue extends WorkerHost {
  constructor(
    private ipService: IpService,
    private em: EntityManager,
    private loggerService: LoggerService,
  ) {
    super()
    this.loggerService.setContext(OnlineQueue.name)
  }

  async process(job: Job<any>) {
    const { user, ip, ...rest } = job.data

    const location = await this.ipService.toLocation(ip)
    const em = this.em.fork()

    try {
      // @ts-ignore
      const online = em.create(SysOnlineEntity, {
        ...rest,
        ip,
        location,
        loginTime: new Date(),
      })
      online.user = user

      await em.persist(online).flush()
    }
    catch (error) {
      this.loggerService.error(error)
    }
  }
}
