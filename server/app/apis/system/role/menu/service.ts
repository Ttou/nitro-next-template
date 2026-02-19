import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { SysMenuEntity, SysRoleEntity } from '~server/app/entities'
import { AssignMenuForRoleReqDto, FindAssignedMenuForRoleReqDto } from './dto'

@Injectable()
export class SystemRoleMenuService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async assign(dto: AssignMenuForRoleReqDto) {
    const role = await this.em.findOne(SysRoleEntity, {
      id: { $eq: dto.id },
    }, {
      populate: ['menus'],
    })

    const menus = await this.em.find(SysMenuEntity, {
      id: { $in: dto.menuIds },
    })

    role.menus.removeAll()

    for (const menu of menus) {
      role.menus.add(menu)
    }

    await this.em.persist(role).flush()
  }

  async assigned(dto: FindAssignedMenuForRoleReqDto) {
    const role = await this.em.findOne(SysRoleEntity, {
      id: { $eq: dto.id },
    }, { populate: ['menus'] })

    return role.menus.map(v => String(v.id))
  }
}
