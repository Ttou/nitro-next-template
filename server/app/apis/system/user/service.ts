import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysUserEntity } from '~server/app/entities'
import { RemoveReqDto } from '~server/app/openapi'
import { HashService } from '~server/app/services'
import { YesOrNoEnum } from '~shared/enums'
import { CreateSystemUserReqDto, FindSystemUserPageReqDto, UpdateSystemUserReqDto } from './dto'

@Injectable()
export class SystemUserService {
  constructor(
    private readonly em: EntityManager,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateSystemUserReqDto) {
    const { userName, email } = dto

    const oldRecord = await this.em.findOne(SysUserEntity, {
      $or: [
        { userName: { $eq: userName } },
        { email: { $eq: email } },
      ],
    })

    if (oldRecord) {
      throw new BadRequestException(`用户名或邮箱已存在`)
    }

    const password = await this.hashService.hash(dto.password)
    const newRecord = this.em.create(SysUserEntity, { ...dto, isDelete: YesOrNoEnum.NO, password })
    await this.em.persist(newRecord).flush()
  }

  async findPage(dto: FindSystemUserPageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysUserEntity, {
      $and: [
        { userName: rest.userName ? { $like: `%${rest.userName}%` } : {} },
        { nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {} },
        { phone: rest.phone ? { $like: `%${rest.phone}%` } : {} },
        { email: rest.email ? { $like: `%${rest.email}%` } : {} },
        { sex: rest.sex ? { $eq: rest.sex } : {} },
        { isAvailable: rest.isAvailable ? { $eq: rest.isAvailable } : {} },
      ],
    }, { limit: pageSize, offset: page - 1 })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysUserEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemUserReqDto) {
    const { id, userName, ...rest } = dto

    const oldRecord = await this.em.findOne(SysUserEntity, {
      $and: [
        { id: { $eq: id } },
        { userName: { $eq: userName } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException('用户不存在')
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
