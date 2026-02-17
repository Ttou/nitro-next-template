import type { ICtxClsStore } from '../utils'
import { EntityManager } from '@mikro-orm/core'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { SysUserEntity } from '../entities'

@Injectable()
export class SharedService {
  constructor(
    private readonly clsService: ClsService<ICtxClsStore>,
    private readonly em: EntityManager,
  ) {}

  async setCurrentUser(payload: any) {
    const user = await this.em.findOne(SysUserEntity, {
      id: { $eq: payload.sub },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    this.clsService.set('user', user)
  }
}
