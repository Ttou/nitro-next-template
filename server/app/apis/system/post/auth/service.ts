import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { SysPostEntity, SysUserEntity } from '~server/app/entities'
import { AllocateUserForPostReqDto, FindAllocatedUserPageForPostReqDto, FindUnallocatedUserPageForPostReqDto, UnallocateUserForPostReqDto } from './dto'

@Injectable()
export class SystemPostAuthService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async allocateUser(dto: AllocateUserForPostReqDto) {
    const { id, ids } = dto

    const post = await this.em.findOne(SysPostEntity, {
      id: { $eq: id },
    })
    const users = await this.em.find(SysUserEntity, {
      id: { $in: ids },
    }, { populate: ['posts'] })

    for (const user of users) {
      user.posts.add(post)
    }

    await this.em.persist(users).flush()
  }

  async findAllocatedUserPage(dto: FindAllocatedUserPageForPostReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysUserEntity, {
      $and: [
        { userName: rest.userName ? { $like: `%${rest.userName}%` } : {} },
        { nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {} },
        { posts: { id: { $eq: rest.id } } },
      ],
    }, { limit: pageSize, offset: page - 1, populate: ['posts'] })

    return { page, pageSize, data, total }
  }

  async findUnallocatedUserPage(dto: FindUnallocatedUserPageForPostReqDto) {
    const { page, pageSize, ...rest } = dto

    const allocatedUsers = await this.em.find(SysUserEntity, {
      posts: { id: { $eq: rest.id } },
    })

    const [data, total] = await this.em.findAndCount(SysUserEntity, {
      $and: [
        { id: { $nin: allocatedUsers.map(item => item.id) } },
        { userName: rest.userName ? { $like: `%${rest.userName}%` } : {} },
        { nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {} },
      ],
    }, { limit: pageSize, offset: page - 1, populate: ['posts'] })

    return { page, pageSize, data, total }
  }

  async unallocateUser(dto: UnallocateUserForPostReqDto) {
    const { id, ids } = dto

    const users = await this.em.find(SysUserEntity, {
      id: { $in: ids },
    }, { populate: ['posts'] })

    for (const user of users) {
      user.posts.remove(item => item.id === id)
    }

    await this.em.persist(users).flush()
  }
}
