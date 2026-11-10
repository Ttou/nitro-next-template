import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
import { PermissionEnum } from '~shared/enums'
import { AssignMenuForRoleReqDto, FindAssignedMenuForRoleReqDto } from './menu.dto'
import { SystemRoleMenuService } from './menu.service'

@ApiTags('系统角色菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleMenuController {
  constructor(
    private systemRoleMenuService: SystemRoleMenuService,
  ) {}

  @ApiDoc({ endpointSummary: '为角色分配菜单' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_MENU_ASSIGN)
  @Post('assign')
  async assign(@Body() dto: AssignMenuForRoleReqDto) {
    await this.systemRoleMenuService.assign(dto)
  }

  @ApiDoc({ endpointSummary: '查询角色已分配菜单', responseDto: String, isArray: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_MENU_ASSIGNED)
  @Post('assigned')
  async assigned(@Body() dto: FindAssignedMenuForRoleReqDto) {
    return await this.systemRoleMenuService.assigned(dto)
  }
}
