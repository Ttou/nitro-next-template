import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysDictDataEntity, SysDictTypeEntity } from '~server/app/entities'
import { RemoveReqDto } from '~server/app/openapi'
import { YesOrNoEnum } from '~shared/enums'
import { CreateSystemDictTypeDto, FindSystemDictDetailByKeyReqDto, FindSystemDictTypePageReqDto, UpdateSystemDictTypeReqDto } from './dto'

@Injectable()
export class SystemDictTypeService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateSystemDictTypeDto) {
    const { dictType } = dto

    const oldRecord = await this.em.findOne(SysDictTypeEntity, {
      dictType: { $eq: dictType },
    })

    if (oldRecord) {
      throw new BadRequestException(`字典类型 ${dictType} 已存在`)
    }

    const config = this.em.create(SysDictTypeEntity, dto)

    await this.em.persist(config).flush()
  }

  async findByKey(dto: FindSystemDictDetailByKeyReqDto) {
    const result = await this.em.findAll(SysDictDataEntity, {
      where: {
        dictType: { $eq: dto.dictType },
        isAvailable: { $eq: YesOrNoEnum.YES },
      },
    })

    return result
  }

  async findPage(dto: FindSystemDictTypePageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysDictTypeEntity, {
      $and: [
        { dictName: rest.dictName ? { $like: `%${rest.dictName}%` } : {} },
        { dictType: rest.dictType ? { $like: `%${rest.dictType}%` } : {} },
        { isAvailable: rest.isAvailable ? { $eq: rest.isAvailable } : {} },
        { createdAt: rest.beginTime ? { $gte: rest.beginTime, $lte: rest.endTime } : {} },
      ],
    }, { limit: pageSize, offset: page - 1 })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldDictTypeRecords = await this.em.find(SysDictTypeEntity, {
      id: { $in: ids },
    })

    const oldDictDataRecords = await this.em.find(SysDictDataEntity, {
      dictType: { $in: oldDictTypeRecords.map(item => item.dictType) },
    })

    await this.em.remove([].concat(oldDictTypeRecords, oldDictDataRecords)).flush()
  }

  async update(dto: UpdateSystemDictTypeReqDto) {
    const { id, dictType, ...rest } = dto

    const oldRecord = await this.em.findOne(SysDictTypeEntity, {
      $and: [
        { id: { $eq: id } },
        { dictType: { $eq: dictType } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`字典类型 ${dto.dictType} 不存在`)
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
