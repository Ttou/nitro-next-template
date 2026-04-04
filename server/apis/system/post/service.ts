import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ErrorEnum } from '~server/constants'
import { SysPostEntity } from '~server/database'
import { RemoveReqDto } from '~server/openapi'
import { ContextService } from '~server/shared'
import { CreateSystemPostReqDto, FindSystemPostPageReqDto, UpdateSystemPostReqDto } from './dto'

@Injectable()
export class SystemPostService {
  constructor(
    private em: EntityManager,
    private contextService: ContextService,
  ) {}

  async create(dto: CreateSystemPostReqDto) {
    const { postKey } = dto

    const oldRecord = await this.em.findOne(SysPostEntity, {
      postKey: { $eq: postKey },
    })

    if (oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.POST_EXIST_ERROR))
    }

    const newRecord = this.em.create(SysPostEntity, dto)
    this.contextService.bindCurrentUserToEntity(newRecord, 'create')

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
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.POST_NOT_FOUND_ERROR))
    }

    wrap(oldRecord).assign(rest)
    this.contextService.bindCurrentUserToEntity(oldRecord, 'update')

    await this.em.persist(oldRecord).flush()
  }
}
