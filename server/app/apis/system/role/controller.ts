import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { AutoOperation, RemoveReqDto } from '~server/app/extends'
import { CreateSystemRoleReqDto, FindSystemRolePageReqDto, FindSystemRolePageResDto, UpdateSystemRoleReqDto } from './dto'
import { SystemRoleService } from './service'

@ApiTags('系统角色接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleController {
  constructor(
    private readonly systemRoleService: SystemRoleService,
  ) {}

  @AutoOperation({ summary: '创建系统角色' })
  @Permission('sys.menu.system.role.create')
  @Post('create')
  async create(@Body() dto: CreateSystemRoleReqDto) {
    return await this.systemRoleService.create(dto)
  }

  @AutoOperation({ summary: '查询系统角色分页列表' })
  @ApiOkResponse({ type: FindSystemRolePageResDto })
  @Permission('sys.menu.system.role.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemRolePageReqDto) {
    return await this.systemRoleService.findPage(dto)
  }

  @AutoOperation({ summary: '删除系统角色' })
  @Permission('sys.menu.system.role.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemRoleService.remove(dto)
  }

  @AutoOperation({ summary: '更新系统角色' })
  @Permission('sys.menu.system.role.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemRoleReqDto) {
    return await this.systemRoleService.update(dto)
  }
}
