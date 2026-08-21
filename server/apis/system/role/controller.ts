import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc, RemoveReqDto, SysRoleEntityExcludeRelationDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { CreateSystemRoleReqDto, ExportSystemRoleSerDto, FindSystemRolePageReqDto, UpdateSystemRoleReqDto } from './dto'
import { SystemRoleService } from './service'

@ApiTags('系统角色接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleController {
  constructor(
    private systemRoleService: SystemRoleService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建系统角色' })
  @XltCheckPermission('sys.menu.system.role.create')
  @Post('create')
  async create(@Body() dto: CreateSystemRoleReqDto) {
    return await this.systemRoleService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统角色分页列表', responseDto: SysRoleEntityExcludeRelationDto, isPage: true })
  @XltCheckPermission('sys.menu.system.role.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemRolePageReqDto) {
    return await this.systemRoleService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除系统角色' })
  @XltCheckPermission('sys.menu.system.role.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemRoleService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新系统角色' })
  @XltCheckPermission('sys.menu.system.role.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemRoleReqDto) {
    return await this.systemRoleService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出系统角色', isExcel: true })
  @XltCheckPermission('sys.menu.system.role.export')
  @Post('export')
  async export(@Body() dto: FindSystemRolePageReqDto) {
    const { data } = await this.systemRoleService.findPage(dto)
    return this.excelService.exportFile(ExportSystemRoleSerDto, data)
  }
}
