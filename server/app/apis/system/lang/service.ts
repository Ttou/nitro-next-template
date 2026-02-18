import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysLangEntity } from '~server/app/entities'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemLangReqDto, FindSystemLangAllReqDto, FindSystemLangOneReqDto, FindSystemLangPageReqDto, UpdateSystemLangReqDto } from './dto'

@Injectable()
export class SystemLangService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateSystemLangReqDto) {
    const oldRecord = await this.em.findOne(SysLangEntity, {
      langKey: { $eq: dto.langKey },
    })

    if (oldRecord) {
      throw new BadRequestException(`语言键 ${dto.langKey} 已存在`)
    }

    const lang = this.em.create(SysLangEntity, dto)

    await this.em.persist(lang).flush()
  }

  async findAll(dto: FindSystemLangAllReqDto) {
    const result = await this.em.findAll(SysLangEntity)

    return result.reduce((acc, cur) => {
      const langValue = JSON.parse(cur.langValue)[dto.langCode]

      if (langValue) {
        acc[cur.langKey] = langValue
      }
      return acc
    }, {})
  }

  async findByKey(dto: FindSystemLangOneReqDto) {
    const result = await this.em.find(SysLangEntity, {
      langKey: dto.langKey,
    })

    return result
  }

  async findPage(dto: FindSystemLangPageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysLangEntity, {
      $and: [
        { langKey: rest.langKey ? { $like: `%${rest.langKey}%` } : {} },
        { remark: rest.remark ? { $like: `%${rest.remark}%` } : {} },
        { isBuiltin: rest.isBuiltin ? { $eq: rest.isBuiltin } : {} },
        { isAvailable: rest.isAvailable ? { $eq: rest.isAvailable } : {} },
        { createdAt: rest.beginTime ? { $gte: rest.beginTime, $lte: rest.endTime } : {} },
      ],
    }, { limit: pageSize, offset: page - 1 })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysLangEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemLangReqDto) {
    const { id, langKey, ...rest } = dto

    const oldRecord = await this.em.findOne(SysLangEntity, {
      $and: [
        { id: { $eq: id } },
        { langKey: { $eq: langKey } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`语言键 ${langKey} 不存在`)
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
