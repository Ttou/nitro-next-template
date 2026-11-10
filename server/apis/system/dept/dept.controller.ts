import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
import { SysDeptEntityExcludeRelationDto } from '~db/dtos'
import { RemoveReqDto } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { CreateSystemDeptReqDto, FindSystemDeptListReqDto, UpdateSystemDeptReqDto } from './dept.dto'
import { SystemDeptService } from './dept.service'

@ApiTags('系统部门接口')
@ApiBearerAuth()
@Controller()
export class SystemDeptController {
  constructor(
    private systemDeptService: SystemDeptService,
  ) {}

  @ApiDoc({ endpointSummary: '创建部门' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_CREATE)
  @Post('create')
  async create(@Body() dto: CreateSystemDeptReqDto) {
    return await this.systemDeptService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询部门列表', responseDto: SysDeptEntityExcludeRelationDto, isArray: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_FIND_LIST)
  @Post('findList')
  async findList(@Body() dto: FindSystemDeptListReqDto) {
    return await this.systemDeptService.findList(dto)
  }

  @ApiDoc({ endpointSummary: '删除部门' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDeptService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新部门' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemDeptReqDto) {
    return await this.systemDeptService.update(dto)
  }
}
