import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { AutoOperation } from '~server/app/extends'
import { AssignMenuForRoleReqDto, FindAssignedMenuForRoleReqDto, FindAssignedMenuForRoleResDto } from './dto'
import { SystemRoleMenuService } from './service'

@ApiTags('系统角色菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleMenuController {
  constructor(
    private readonly systemRoleMenuService: SystemRoleMenuService,
  ) {}

  @AutoOperation({ summary: '为角色分配菜单' })
  @Permission('sys.menu.system.roleMenu.assign')
  @Post('assign')
  async assign(@Body() dto: AssignMenuForRoleReqDto) {
    await this.systemRoleMenuService.assign(dto)
  }

  @AutoOperation({ summary: '查询角色已分配菜单' })
  @ApiOkResponse({ schema: FindAssignedMenuForRoleResDto })
  @Permission('sys.menu.system.roleMenu.assigned')
  @Post('assigned')
  async assigned(@Body() dto: FindAssignedMenuForRoleReqDto) {
    return await this.systemRoleMenuService.assigned(dto)
  }
}
