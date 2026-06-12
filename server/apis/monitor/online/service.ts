import { EntityManager, serialize } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { RemoveReqDto, SysOnlineEntityDto } from '~server/openapi'
import { LogoutService } from '~server/shared'
import { SysOnlineEntity } from '~shared/entities'
import { FindMonitorOnlinePageReqDto } from './dto'

@Injectable()
export class MonitorOnlineService {
  constructor(
    private em: EntityManager,
    private logoutService: LogoutService,
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

    // 必须先转换为普通对象，再转换为 dto，否则会报错
    const serializedData = data.map(item => plainToInstance(SysOnlineEntityDto, serialize(item, { populate: ['user'] })))

    return { page, pageSize, data: serializedData, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysOnlineEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()

    for (const record of oldRecords) {
      await this.logoutService.add(record.token)
    }
  }
}
