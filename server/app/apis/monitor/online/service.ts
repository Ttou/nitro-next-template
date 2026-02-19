import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { SysOnlineEntity } from '~server/app/entities'
import { RemoveReqDto } from '~server/app/openapi'
import { LogoutService } from '~server/app/services'
import { FindMonitorOnlinePageReqDto } from './dto'

@Injectable()
export class MonitorOnlineService {
  constructor(
    private readonly em: EntityManager,
    private readonly logoutService: LogoutService,
  ) {}

  async findPage(dto: FindMonitorOnlinePageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysOnlineEntity, {
      $and: [
        {
          user: {
            userName: rest.userName ? { $like: `%${rest.userName}%` } : {},
            nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {},
          },
          loginTime: rest.beginTime ? { $gte: rest.beginTime, $lte: rest.endTime } : {},
        },
      ],
    }, { limit: pageSize, offset: page - 1, populate: ['user'], exclude: ['token'] })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysOnlineEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()

    for (const record of oldRecords) {
      await this.logoutService.addToLogout(record.token)
    }
  }
}
