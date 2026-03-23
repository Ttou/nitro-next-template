import type { FindMonitorOperatePageReqDto } from './dto'
import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { SysOperateEntity } from '~server/database'

@Injectable()
export class MonitorOperateService {
  constructor(
    private em: EntityManager,
  ) {}

  async findPage(dto: FindMonitorOperatePageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysOperateEntity, {
      $and: [
        {
          user: {
            userName: rest.userName ? { $like: `%${rest.userName}%` } : {},
            nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {},
          },
          operateTime: rest.beginTime ? { $gte: rest.beginTime, $lte: rest.endTime } : {},
        },
      ],
    }, { limit: pageSize, offset: page - 1, populate: ['user'] })

    return { page, pageSize, data, total }
  }
}
