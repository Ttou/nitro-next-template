import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysDeptEntity } from '~server/app/entities'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemDeptReqDto, FindSystemDeptListReqDto, UpdateSystemDeptReqDto } from './dto'

@Injectable()
export class SystemDeptService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateSystemDeptReqDto) {
    const { deptKey } = dto

    const oldRecord = await this.em.findOne(SysDeptEntity, {
      deptKey: { $eq: deptKey },
    })

    if (oldRecord) {
      throw new BadRequestException(`部门标识 ${deptKey} 已存在`)
    }

    const newRecord = this.em.create(SysDeptEntity, dto)

    await this.em.persist(newRecord).flush()
  }

  async findList(dto: FindSystemDeptListReqDto) {
    const { deptName, deptKey, isAvailable } = dto

    const result = await this.em.findAll(SysDeptEntity, {
      where: {
        deptName: deptName ? { $like: `%${deptName}%` } : {},
        deptKey: deptKey ? { $like: `%${deptKey}%` } : {},
        isAvailable: isAvailable ? { $eq: isAvailable } : {},
      },
    })

    return result
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysDeptEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemDeptReqDto) {
    const { id, deptKey, ...rest } = dto

    const oldRecord = await this.em.findOne(SysDeptEntity, {
      $and: [
        { id: { $eq: id } },
        { deptKey: { $eq: deptKey } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(`部门标识 ${deptKey} 不存在`)
    }

    wrap(oldRecord).assign(rest)

    await this.em.persist(oldRecord).flush()
  }
}
