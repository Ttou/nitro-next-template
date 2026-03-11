import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/decorators'
import { AssignMenuForRoleReqDto, FindAssignedMenuForRoleReqDto } from './dto'
import { SystemRoleMenuService } from './service'

@ApiTags('系统角色菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleMenuController {
  constructor(
    private systemRoleMenuService: SystemRoleMenuService,
  ) {}

  @ApiOperation({ summary: '为角色分配菜单' })
  @Permission('sys.menu.system.roleMenu.assign')
  @Post('assign')
  async assign(@Body() dto: AssignMenuForRoleReqDto) {
    await this.systemRoleMenuService.assign(dto)
  }

  @ApiOperation({ summary: '查询角色已分配菜单' })
  @ApiOkResponse({ type: [String] })
  @Permission('sys.menu.system.roleMenu.assigned')
  @Post('assigned')
  async assigned(@Body() dto: FindAssignedMenuForRoleReqDto) {
    return await this.systemRoleMenuService.assigned(dto)
  }
}
