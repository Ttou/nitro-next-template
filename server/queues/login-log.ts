import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { forwardRef, Inject, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SysLoginLogEntity } from '~db/entities'
import { IpService } from '~server/shared'
import { QueueNameEnum } from './constant'

@Processor(
  QueueNameEnum.LOGIN_LOG,
  {
    removeOnComplete: {
      age: 2 * 24 * 60 * 1000,
      count: 100,
    },
    removeOnFail: {
      age: 5 * 24 * 60 * 1000,
      count: 100,
    },
  },
)
export class LoginLogQueue extends WorkerHost {
  private readonly logger = new Logger(LoginLogQueue.name)

  constructor(
    @Inject(forwardRef(() => IpService)) private ipService: IpService,
    private em: EntityManager,
  ) {
    super()
    this.em = em.fork()
  }

  async process(job: Job<any>) {
    let { ip, ...rest } = job.data

    const location = await this.ipService.toLocation(ip)

    try {
      const loginLog = this.em.create(SysLoginLogEntity, {
        ...rest,
        ip,
        location,
      })

      await this.em.persist(loginLog).flush()
    }
    catch (error) {
      this.logger.error(error)
    }
  }
}
