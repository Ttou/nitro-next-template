import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { Operate } from '~server/decorators'
import { ApiDoc, RemoveReqDto, SysDeptEntityExcludeRelationDto } from '~server/openapi'
import { CreateSystemDeptReqDto, FindSystemDeptListReqDto, UpdateSystemDeptReqDto } from './dto'
import { SystemDeptService } from './service'

@ApiTags('系统部门接口')
@ApiBearerAuth()
@Controller()
export class SystemDeptController {
  constructor(
    private systemDeptService: SystemDeptService,
  ) {}

  @ApiDoc({ endpointSummary: '创建部门' })
  @XltCheckPermission('sys.menu.system.dept.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemDeptReqDto) {
    return await this.systemDeptService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询部门列表', responseDto: SysDeptEntityExcludeRelationDto, isArray: true })
  @XltCheckPermission('sys.menu.system.dept.findList')
  @Operate({ ignoreResponse: true })
  @Post('findList')
  async findList(@Body() dto: FindSystemDeptListReqDto) {
    return await this.systemDeptService.findList(dto)
  }

  @ApiDoc({ endpointSummary: '删除部门' })
  @XltCheckPermission('sys.menu.system.dept.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDeptService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新部门' })
  @XltCheckPermission('sys.menu.system.dept.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemDeptReqDto) {
    return await this.systemDeptService.update(dto)
  }
}
