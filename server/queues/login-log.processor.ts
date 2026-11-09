import { EntityManager } from '@mikro-orm/mysql'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { HttpStatus, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SysLoginLogEntity } from '~db/entities'
import { RemoteIpService } from '~server/remote'
import { QueueNameEnum } from './queue.constant'

export interface LoginLogQueueData {
  ip: string
  userName: any
  userAgent: string
  token: string
  operateTime: Date
  costTime: number
  status: HttpStatus
  errorMsg?: string
}

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
    private remoteIpService: RemoteIpService,
    private em: EntityManager,
  ) {
    super()
    this.em = em.fork()
  }

  async process(job: Job<LoginLogQueueData>) {
    const { ip, ...rest } = job.data

    const location = await this.remoteIpService.toLocation(ip)

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
