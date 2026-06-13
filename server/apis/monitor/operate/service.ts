import type { FindMonitorOperatePageReqDto } from './dto'
import { EntityManager, serialize } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { SysOperateEntityDto } from '~server/openapi'
import { SysOperateEntity } from '~shared/database/entities'

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
    }, { limit: pageSize, offset: page - 1, orderBy: { operateTime: 'desc' }, populate: ['user'] })

    // 必须先转换为普通对象，再转换为 dto，否则会报错
    const serializedData = data.map(item => plainToInstance(SysOperateEntityDto, serialize(item, { populate: ['user'] })))

    return { page, pageSize, data: serializedData, total }
  }
}
