import type { RemoveReqDto } from '~server/app/openapi'
import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysDictDataEntity } from '~server/app/entities'
import { CreateSystemDictDataReqDto, FindSystemDictDataListReqDto, UpdateSystemDictDataReqDto } from './dto'

@Injectable()
export class SystemDictDataService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateSystemDictDataReqDto) {
    const { dictType, dictValue } = dto

    const oldRecord = await this.em.findOne(SysDictDataEntity, {
      $and: [
        { dictType: { $eq: dictType } },
        { dictValue: { $eq: dictValue } },
      ],
    })

    if (oldRecord) {
      throw new BadRequestException(`字典值 ${dto.dictValue} 已存在`)
    }

    const config = this.em.create(SysDictDataEntity, dto)

    await this.em.persist(config).flush()
  }

  async findList(dto: FindSystemDictDataListReqDto) {
    const { dictType, dictLabel, isAvailable } = dto

    const result = await this.em.findAll(SysDictDataEntity, {
      where: {
        dictType: { $eq: dictType },
        dictLabel: dictLabel ? { $like: `%${dictLabel}%` } : {},
        isAvailable: isAvailable ? { $eq: isAvailable } : {},
      },
    })

    return result
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysDictDataEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemDictDataReqDto) {
    const { id, dictValue, ...rest } = dto

    const oldRecord = await this.em.findOne(SysDictDataEntity, {
      $and: [
        { id: { $eq: id } },
        { dictValue: { $eq: dictValue } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`字典值 ${dto.dictValue} 不存在`)
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
