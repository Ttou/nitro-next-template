import { EntityManager } from '@mikro-orm/core'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SysOnlineEntity } from '../entities'
import { ParseService } from '../shared'
import { QueueNameEnum } from './constant'

@Processor(QueueNameEnum.ONLINE_USER)
export class OnlineUserQueue extends WorkerHost {
  private logger = new Logger(OnlineUserQueue.name)

  constructor(
    private parseService: ParseService,
    private em: EntityManager,
  ) {
    super()
  }

  async process(job: Job<any>) {
    const { tokenId, token, user, userAgent, ip } = job.data

    const usResult = this.parseService.parseUserAgent(userAgent)
    const ipResult = await this.parseService.parseIP(ip)
    const em = this.em.fork()

    try {
      const online = em.create(SysOnlineEntity, {
        tokenId,
        token,
        browser: [usResult.browser.name, usResult.browser.version].join(' '),
        os: [usResult.os.name, usResult.os.version].join(' '),
        ip: ipResult.ip,
        location: ipResult.location,
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
