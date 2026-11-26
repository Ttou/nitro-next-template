import type { FindMonitorLoginLogPageReqDto } from './login-log.dto'
import { serialize } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/mysql'
import { Injectable } from '@nestjs/common'
import { SysLoginLogEntity } from '~db/entities'
import { parseUserAgent } from '~server/dtos'

@Injectable()
export class MonitorLoginLogService {
  constructor(
    private em: EntityManager,
  ) {}

  async findPage(dto: FindMonitorLoginLogPageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysLoginLogEntity, {
      $and: [
        {
          userName: rest.userName
            ? { $like: `%${rest.userName}%` }
            : {},
          operateTime: rest.beginTime
            ? { $gte: rest.beginTime, $lte: rest.endTime }
            : {},
        },
      ],
    }, {
      limit: pageSize,
      offset: page - 1,
      orderBy: { operateTime: 'desc' },
    })

    // 必须先转换为普通对象，否则实体上的循环引用会导致序列化报错
    const serializedData = data.map(item => ({
      ...serialize(item),
      userAgentParsed: parseUserAgent(item.userAgent),
    }))

    return {
      page,
      pageSize,
      data: serializedData,
      total,
    }
  }
}
