import type { CreateSystemDeptReqDto, FindSystemDeptListReqDto, RemoveReqDto, UpdateSystemDeptReqDto } from '~shared/dtos'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { createSystemDeptReqSchema, findSystemDeptListReqSchema, removeReqSchema, sysDeptEntityExcludeRelationSchema, updateSystemDeptReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
import { SystemDeptService } from './dept.service'

@ApiTags('系统部门接口')
@ApiBearerAuth()
@Controller()
export class SystemDeptController {
  constructor(
    private systemDeptService: SystemDeptService,
  ) {}

  @ApiOperation({ summary: '创建部门' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_CREATE)
  @Post('create')
  async create(@Body({
    schema: createSystemDeptReqSchema(),
  }) dto: CreateSystemDeptReqDto,
  ) {
    return await this.systemDeptService.create(dto)
  }

  @ApiOperation({ summary: '查询部门列表' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: sysDeptEntityExcludeRelationSchema(),
    isArray: true,
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_FIND_LIST)
  @Post('findList')
  async findList(@Body({
    schema: findSystemDeptListReqSchema(),
  }) dto: FindSystemDeptListReqDto,
  ) {
    return await this.systemDeptService.findList(dto)
  }

  @ApiOperation({ summary: '删除部门' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_REMOVE)
  @Delete('remove')
  async remove(@Body({
    schema: removeReqSchema(),
  }) dto: RemoveReqDto,
  ) {
    return await this.systemDeptService.remove(dto)
  }

  @ApiOperation({ summary: '更新部门' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DEPT_UPDATE)
  @Post('update')
  async update(@Body({
    schema: updateSystemDeptReqSchema(),
  }) dto: UpdateSystemDeptReqDto,
  ) {
    return await this.systemDeptService.update(dto)
  }
}
