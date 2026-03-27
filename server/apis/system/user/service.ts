import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysDictDataEntity, SysUserEntity } from '~server/database'
import { HashService } from '~server/extends'
import { RemoveReqDto } from '~server/openapi'
import { ContextService } from '~server/shared'
import { YesOrNoEnum } from '~shared/enums'
import { CreateSystemUserReqDto, FindSystemUserPageReqDto, ImportSystemUserSerializeDto, UpdateSystemUserReqDto } from './dto'

@Injectable()
export class SystemUserService {
  constructor(
    private em: EntityManager,
    private hashService: HashService,
    private contextService: ContextService,
  ) {}

  async create(dto: CreateSystemUserReqDto) {
    const { userName, email } = dto

    const oldRecord = await this.em.findOne(
      SysUserEntity,
      {
        $or: [
          { userName: { $eq: userName } },
          { email: { $eq: email } },
        ],
      },
    )

    if (oldRecord) {
      throw new BadRequestException(`用户名或邮箱已存在`)
    }

    const password = await this.hashService.hash(dto.password)
    const newRecord = this.em.create(
      SysUserEntity,
      {
        ...dto,
        isAvailable: YesOrNoEnum.YES,
        isDelete: YesOrNoEnum.NO,
        password,
      },
    )
    this.contextService.bindCurrentUserToEntity(newRecord, 'create')
    await this.em.persist(newRecord).flush()
  }

  async findPage(dto: FindSystemUserPageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(
      SysUserEntity,
      {
        $and: [
          { userName: rest.userName ? { $like: `%${rest.userName}%` } : {} },
          { nickName: rest.nickName ? { $like: `%${rest.nickName}%` } : {} },
          { phone: rest.phone ? { $like: `%${rest.phone}%` } : {} },
          { email: rest.email ? { $like: `%${rest.email}%` } : {} },
          { sex: rest.sex ? { $eq: rest.sex } : {} },
          { isAvailable: rest.isAvailable ? { $eq: rest.isAvailable } : {} },
          { isDelete: YesOrNoEnum.NO },
        ],
      },
      { limit: pageSize, offset: page - 1, exclude: ['password'] },
    )

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(
      SysUserEntity,
      {
        id: { $in: ids },
      },
    )

    oldRecords.forEach((item) => {
      item.isDelete = YesOrNoEnum.YES
      this.contextService.bindCurrentUserToEntity(item, 'update')
    })

    await this.em.persist(oldRecords).flush()
  }

  async update(dto: UpdateSystemUserReqDto) {
    const { id, userName, ...rest } = dto

    const oldRecord = await this.em.findOne(
      SysUserEntity,
      {
        $and: [
          { id: { $eq: id } },
          { userName: { $eq: userName } },
        ],
      },
    )

    if (!oldRecord) {
      throw new BadRequestException('用户不存在')
    }

    wrap(oldRecord).assign(rest)
    this.contextService.bindCurrentUserToEntity(oldRecord, 'update')

    await this.em.persist(oldRecord).flush()
  }

  async importTemplate(data: ImportSystemUserSerializeDto[]) {
    let fail = 0
    const items: string[] = []
    const initPassword = await this.contextService.getInitPassword()
    const password = await this.hashService.hash(initPassword)

    for (const item of data) {
      const oldRecord = await this.em.findOne(
        SysUserEntity,
        {
          userName: { $eq: item.userName },
        },
      )

      if (oldRecord) {
        items.push(item.userName)
        fail++
      }
      else {
        const sexDict = await this.em.findOne(
          SysDictDataEntity,
          {
            dictType: { $eq: 'sys.user.sex' },
            dictLabel: { $eq: item.sex },
          },
          { cache: true },
        )
        const newRecord = this.em.create(
          SysUserEntity,
          {
            ...item,
            password,
            sex: sexDict?.dictValue,
            isDelete: YesOrNoEnum.NO,
            isAvailable: YesOrNoEnum.YES,
          },
        )
        this.em.persist(newRecord)
      }
    }

    await this.em.flush()

    return {
      success: data.length - fail,
      fail,
      items,
    }
  }
}
