import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SysOnlineEntity } from '../entities'
import { IpService } from '../shared'
import { QueueNameEnum } from './constant'

@Processor(QueueNameEnum.ONLINE)
export class OnlineQueue extends WorkerHost {
  private logger = new Logger(OnlineQueue.name)

  constructor(
    private ipService: IpService,
    private em: EntityManager,
  ) {
    super()
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
      this.logger.error(error)
    }
  }
}
