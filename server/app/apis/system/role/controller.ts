import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { ApiExcelResponse, ExcelService, RemoveReqDto } from '~server/app/extends'
import { CreateSystemRoleReqDto, ExportSystemRoleSerializeDto, FindSystemRolePageReqDto, FindSystemRolePageResDto, UpdateSystemRoleReqDto } from './dto'
import { SystemRoleService } from './service'

@ApiTags('系统角色接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleController {
  constructor(
    private systemRoleService: SystemRoleService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建系统角色' })
  @Permission('sys.menu.system.role.create')
  @Post('create')
  async create(@Body() dto: CreateSystemRoleReqDto) {
    return await this.systemRoleService.create(dto)
  }

  @ApiOperation({ summary: '查询系统角色分页列表' })
  @ApiOkResponse({ type: FindSystemRolePageResDto })
  @Permission('sys.menu.system.role.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemRolePageReqDto) {
    return await this.systemRoleService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统角色' })
  @Permission('sys.menu.system.role.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemRoleService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统角色' })
  @Permission('sys.menu.system.role.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemRoleReqDto) {
    return await this.systemRoleService.update(dto)
  }

  @ApiOperation({ summary: '导出系统角色' })
  @ApiExcelResponse()
  @Permission('sys.menu.system.role.export')
  @Post('export')
  async export(@Body() dto: FindSystemRolePageReqDto) {
    const { data } = await this.systemRoleService.findPage(dto)
    return this.excelService.exportFile(ExportSystemRoleSerializeDto, data)
  }
}
