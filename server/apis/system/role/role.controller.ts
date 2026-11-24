import type { RemoveReqDto } from '~server/dtos'
import type { CreateSystemRoleReqDto, FindSystemRolePageReqDto, UpdateSystemRoleReqDto } from './role.dto'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { removeReqSchema } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { createSystemRoleReqSchema, ExportSystemRoleSerDto, findSystemRolePageReqSchema, findSystemRolePageResSchema, updateSystemRoleReqSchema } from './role.dto'
import { SystemRoleService } from './role.service'

@ApiTags('系统角色接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleController {
  constructor(
    private systemRoleService: SystemRoleService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建系统角色' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_CREATE)
  @Post('create')
  async create(@Body({ schema: createSystemRoleReqSchema }) dto: CreateSystemRoleReqDto) {
    return await this.systemRoleService.create(dto)
  }

  @ApiOperation({ summary: '查询系统角色分页列表' })
  @ApiOkResponse({ description: '请求成功', standardSchema: findSystemRolePageResSchema })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body({ schema: findSystemRolePageReqSchema }) dto: FindSystemRolePageReqDto) {
    return await this.systemRoleService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统角色' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_REMOVE)
  @Delete('remove')
  async remove(@Body({ schema: removeReqSchema }) dto: RemoveReqDto) {
    return await this.systemRoleService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统角色' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_UPDATE)
  @Post('update')
  async update(@Body({ schema: updateSystemRoleReqSchema }) dto: UpdateSystemRoleReqDto) {
    return await this.systemRoleService.update(dto)
  }

  @ApiOperation({ summary: '导出系统角色' })
  @ApiOkResponse({
    description: '请求成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_EXPORT)
  @Post('export')
  async export(@Body({ schema: findSystemRolePageReqSchema }) dto: FindSystemRolePageReqDto) {
    const { data } = await this.systemRoleService.findPage(dto)
    return this.excelService.exportFile(ExportSystemRoleSerDto, data)
  }
}
