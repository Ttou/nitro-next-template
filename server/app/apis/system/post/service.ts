import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysPostEntity } from '~server/app/entities'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemPostReqDto, FindSystemPostPageReqDto, UpdateSystemPostReqDto } from './dto'

@Injectable()
export class SystemPostService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateSystemPostReqDto) {
    const { postKey } = dto

    const oldRecord = await this.em.findOne(SysPostEntity, {
      postKey: { $eq: postKey },
    })

    if (oldRecord) {
      throw new BadRequestException(`岗位标识 ${postKey} 已存在`)
    }

    const newRecord = this.em.create(SysPostEntity, dto)

    await this.em.persist(newRecord).flush()
  }

  async findPage(dto: FindSystemPostPageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysPostEntity, {
      $and: [
        { postName: rest.postName ? { $like: `%${rest.postName}%` } : {} },
        { postKey: rest.postKey ? { $like: `%${rest.postKey}%` } : {} },
        { isAvailable: rest.isAvailable ? { $eq: rest.isAvailable } : {} },
        { createdAt: rest.beginTime ? { $gte: rest.beginTime, $lte: rest.endTime } : {} },
      ],
    }, { limit: pageSize, offset: page - 1 })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysPostEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemPostReqDto) {
    const { id, postKey, ...rest } = dto

    const oldRecord = await this.em.findOne(SysPostEntity, {
      $and: [
        { id: { $eq: id } },
        { postKey: { $eq: postKey } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`岗位标识 ${postKey} 不存在`)
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
