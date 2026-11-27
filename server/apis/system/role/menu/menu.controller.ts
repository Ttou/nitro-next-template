import type { AssignMenuForRoleReqDto, FindAssignedMenuForRoleReqDto } from '~shared/dtos'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { assignMenuForRoleReqSchema, findAssignedMenuForRoleReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
import { SystemRoleMenuService } from './menu.service'

@ApiTags('系统角色菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleMenuController {
  constructor(
    private systemRoleMenuService: SystemRoleMenuService,
  ) {}

  @ApiOperation({ summary: '为角色分配菜单' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_MENU_ASSIGN)
  @Post('assign')
  async assign(@Body({ schema: assignMenuForRoleReqSchema }) dto: AssignMenuForRoleReqDto) {
    await this.systemRoleMenuService.assign(dto)
  }

  @ApiOperation({ summary: '查询角色已分配菜单' })
  @ApiOkResponse({
    description: '请求成功',
    type: [String],
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_MENU_ASSIGNED)
  @Post('assigned')
  async assigned(@Body({ schema: findAssignedMenuForRoleReqSchema }) dto: FindAssignedMenuForRoleReqDto) {
    return await this.systemRoleMenuService.assigned(dto)
  }
}
