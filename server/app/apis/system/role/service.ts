import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysRoleEntity } from '~server/app/entities'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemRoleReqDto, FindSystemRolePageReqDto, UpdateSystemRoleReqDto } from './dto'

@Injectable()
export class SystemRoleService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateSystemRoleReqDto) {
    const { roleKey } = dto

    const oldRecord = await this.em.findOne(SysRoleEntity, {
      roleKey: { $eq: roleKey },
    })

    if (oldRecord) {
      throw new BadRequestException(`角色标识 ${roleKey} 已存在`)
    }

    const config = this.em.create(SysRoleEntity, dto)

    await this.em.persist(config).flush()
  }

  async findPage(dto: FindSystemRolePageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysRoleEntity, {
      $and: [
        { roleName: rest.roleName ? { $like: `%${rest.roleName}%` } : {} },
        { roleKey: rest.roleKey ? { $like: `%${rest.roleKey}%` } : {} },
        { isAvailable: rest.isAvailable ? { $eq: rest.isAvailable } : {} },
        { createdAt: rest.beginTime ? { $gte: rest.beginTime, $lte: rest.endTime } : {} },
      ],
    }, { limit: pageSize, offset: page - 1 })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysRoleEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemRoleReqDto) {
    const { id, roleKey, ...rest } = dto

    const oldRecord = await this.em.findOne(SysRoleEntity, {
      $and: [
        { id: { $eq: id } },
        { roleKey: { $eq: roleKey } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`角色标识 ${roleKey} 不存在`)
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
