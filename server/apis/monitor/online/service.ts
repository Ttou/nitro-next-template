import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { StpLogic } from '@xlt-token/core'
import { RemoveReqDto } from '~server/openapi'
import { SysUserEntity } from '~shared/database/entities'
import { FindMonitorOnlinePageReqDto } from './dto'

@Injectable()
export class MonitorOnlineService {
  constructor(
    private em: EntityManager,
    private stp: StpLogic,
  ) {}

  async findPage(dto: FindMonitorOnlinePageReqDto) {
    const { page, pageSize, ...rest } = dto
    const ids = await this.stp.getOnlineLoginIds({ page, pageSize })

    const result = await this.em.findAll(SysUserEntity, {
      where: {
        id: { $in: ids },
        userName: rest.userName ? { $like: `%${rest.userName}%` } : {},
        nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {},
      },
      exclude: ['password'],
    })

    return { page, pageSize, data: result, total: result.length }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    for (const id of ids) {
      await this.stp.logoutByLoginId(id)
    }
  }
}
