import type { RemoveReqDto } from '~server/app/extends'
import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysMenuEntity } from '~server/app/entities'
import { CreateSystemMenuReqDto, FindSystemMenuListReqDto, UpdateSystemMenuReqDto } from './dto'

@Injectable()
export class SystemMenuService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateSystemMenuReqDto) {
    const { menuKey } = dto

    const oldRecord = await this.em.findOne(SysMenuEntity, {
      menuKey: { $eq: menuKey },
    })

    if (oldRecord) {
      throw new BadRequestException(`菜单标识 ${menuKey} 已存在`)
    }

    const newRecord = this.em.create(SysMenuEntity, dto)

    await this.em.persist(newRecord).flush()
  }

  async findList(dto: FindSystemMenuListReqDto) {
    const { menuName, menuKey, isAvailable } = dto

    const result = await this.em.findAll(SysMenuEntity, {
      where: {
        menuName: menuName ? { $like: `%${menuName}%` } : {},
        menuKey: menuKey ? { $like: `%${menuKey}%` } : {},
        isAvailable: isAvailable ? { $eq: isAvailable } : {},
      },
    })

    return result
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysMenuEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemMenuReqDto) {
    const { id, menuKey, ...rest } = dto

    const oldRecord = await this.em.findOne(SysMenuEntity, {
      $and: [
        { id: { $eq: id } },
        { menuKey: { $eq: menuKey } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`菜单标识 ${menuKey} 不存在`)
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
