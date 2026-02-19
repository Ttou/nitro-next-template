import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { SysRoleEntity, SysUserEntity } from '~server/app/entities'
import { AllocateUserForRoleReqDto, FindAllocatedUserPageForRoleReqDto, FindUnallocatedUserPageForRoleReqDto, UnallocateUserForRoleReqDto } from './dto'

@Injectable()
export class SystemRoleAuthService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async allocateUser(dto: AllocateUserForRoleReqDto) {
    const { id, ids } = dto

    const role = await this.em.findOne(SysRoleEntity, {
      id: { $eq: id },
    })
    const users = await this.em.find(SysUserEntity, {
      id: { $in: ids },
    }, { populate: ['roles'] })

    for (const user of users) {
      user.roles.add(role)
    }

    await this.em.persist(users).flush()
  }

  async findAllocatedUserPage(dto: FindAllocatedUserPageForRoleReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysUserEntity, {
      $and: [
        { userName: rest.userName ? { $like: `%${rest.userName}%` } : {} },
        { nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {} },
        { roles: { id: { $eq: rest.id } } },
      ],
    }, { limit: pageSize, offset: page - 1, populate: ['roles'] })

    return { page, pageSize, data, total }
  }

  async findUnallocatedUserPage(dto: FindUnallocatedUserPageForRoleReqDto) {
    const { page, pageSize, ...rest } = dto

    const allocatedUsers = await this.em.find(SysUserEntity, {
      roles: { id: { $eq: rest.id } },
    })

    const [data, total] = await this.em.findAndCount(SysUserEntity, {
      $and: [
        { id: { $nin: allocatedUsers.map(item => item.id) } },
        { userName: rest.userName ? { $like: `%${rest.userName}%` } : {} },
        { nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {} },
      ],
    }, { limit: pageSize, offset: page - 1, populate: ['roles'] })

    return { page, pageSize, data, total }
  }

  async unallocateUser(dto: UnallocateUserForRoleReqDto) {
    const { id, ids } = dto

    const users = await this.em.find(SysUserEntity, {
      id: { $in: ids },
    }, { populate: ['roles'] })

    for (const user of users) {
      user.roles.remove(item => item.id === id)
    }

    await this.em.persist(users).flush()
  }
}
