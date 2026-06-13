import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { ApiDoc } from '~server/openapi'
import { AssignMenuForRoleReqDto, FindAssignedMenuForRoleReqDto } from './dto'
import { SystemRoleMenuService } from './service'

@ApiTags('系统角色菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleMenuController {
  constructor(
    private systemRoleMenuService: SystemRoleMenuService,
  ) {}

  @ApiDoc({ endpointSummary: '为角色分配菜单' })
  @Permission('sys.menu.system.roleMenu.assign')
  @Operate()
  @Post('assign')
  async assign(@Body() dto: AssignMenuForRoleReqDto) {
    await this.systemRoleMenuService.assign(dto)
  }

  @ApiDoc({ endpointSummary: '查询角色已分配菜单', responseDto: String, isArray: true })
  @Permission('sys.menu.system.roleMenu.assigned')
  @Operate({ ignoreResponse: true })
  @Post('assigned')
  async assigned(@Body() dto: FindAssignedMenuForRoleReqDto) {
    return await this.systemRoleMenuService.assigned(dto)
  }
}
