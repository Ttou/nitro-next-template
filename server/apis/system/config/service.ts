import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysConfigEntity } from '~server/database'
import { RemoveReqDto } from '~server/openapi'
import { ContextService } from '~server/shared'
import { YesOrNoEnum } from '~shared/enums'
import { CreateSystemConfigReqDto, FindSystemConfigByKeyReqDto, FindSystemConfigPageReqDto, UpdateSystemConfigReqDto } from './dto'

@Injectable()
export class SystemConfigService {
  constructor(
    private em: EntityManager,
    private contextService: ContextService,
  ) {}

  async create(dto: CreateSystemConfigReqDto) {
    const { configKey } = dto

    const oldRecord = await this.em.findOne(SysConfigEntity, {
      configKey: { $eq: dto.configKey },
    })

    if (oldRecord) {
      throw new BadRequestException(`配置标识 ${configKey} 已存在`)
    }

    const config = this.em.create(SysConfigEntity, dto)
    this.contextService.bindCurrentUserToEntity(config, 'create')

    await this.em.persist(config).flush()
  }

  async findByKey(dto: FindSystemConfigByKeyReqDto) {
    const { configKey } = dto

    const oldRecord = await this.em.findOne(SysConfigEntity, {
      configKey: { $eq: configKey },
    })

    if (!oldRecord) {
      throw new BadRequestException(`配置标识 ${configKey} 不存在`)
    }

    return oldRecord
  }

  async findPage(dto: FindSystemConfigPageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysConfigEntity, {
      $and: [
        { configName: rest.configName ? { $like: `%${rest.configName}%` } : {} },
        { configKey: rest.configKey ? { $like: `%${rest.configKey}%` } : {} },
        { isBuiltin: rest.isBuiltin ? { $eq: rest.isBuiltin } : {} },
        { createdAt: rest.beginTime ? { $gte: rest.beginTime, $lte: rest.endTime } : {} },
      ],
    }, { limit: pageSize, offset: page - 1 })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysConfigEntity, {
      id: { $in: ids },
      isBuiltin: { $eq: YesOrNoEnum.NO },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemConfigReqDto) {
    const { id, configKey, ...rest } = dto

    const oldRecord = await this.em.findOne(SysConfigEntity, {
      $and: [
        { id: { $eq: id } },
        { configKey: { $eq: configKey } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`配置标识 ${configKey} 不存在`)
    }

    wrap(oldRecord).assign(rest)
    this.contextService.bindCurrentUserToEntity(oldRecord, 'update')

    await this.em.persist(oldRecord).flush()
  }
}
