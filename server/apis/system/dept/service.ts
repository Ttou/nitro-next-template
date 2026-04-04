import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ErrorEnum } from '~server/constants'
import { SysDeptEntity } from '~server/database'
import { RemoveReqDto } from '~server/openapi'
import { ContextService } from '~server/shared'
import { CreateSystemDeptReqDto, FindSystemDeptListReqDto, UpdateSystemDeptReqDto } from './dto'

@Injectable()
export class SystemDeptService {
  constructor(
    private em: EntityManager,
    private contextService: ContextService,
  ) {}

  async create(dto: CreateSystemDeptReqDto) {
    const { deptKey } = dto

    const oldRecord = await this.em.findOne(SysDeptEntity, {
      deptKey: { $eq: deptKey },
    })

    if (oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.DEPT_EXIST_ERROR))
    }

    const newRecord = this.em.create(SysDeptEntity, dto)
    this.contextService.bindCurrentUserToEntity(newRecord, 'create')

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
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.DEPT_NOT_FOUND_ERROR))
    }

    wrap(oldRecord).assign(rest)
    this.contextService.bindCurrentUserToEntity(oldRecord, 'update')

    await this.em.persist(oldRecord).flush()
  }
}
