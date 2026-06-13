import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { ApiDoc } from '~server/openapi'
import { AllocateUserForRoleReqDto, FindAllocatedUserPageForRoleReqDto, FindUnallocatedUserPageForRoleReqDto, SysUserEntityWithRolesDto, UnallocateUserForRoleReqDto } from './dto'
import { SystemRoleAuthService } from './service'

@ApiTags('系统角色权限接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleAuthController {
  constructor(
    private systemRoleAuthService: SystemRoleAuthService,
  ) {}

  @ApiDoc({ endpointSummary: '为角色分配用户' })
  @Permission('sys.menu.system.roleAuth.allocateUser')
  @Operate()
  @Post('allocateUser')
  async allocateUser(@Body() dto: AllocateUserForRoleReqDto) {
    await this.systemRoleAuthService.allocateUser(dto)
  }

  @ApiDoc({ endpointSummary: '查询角色已分配用户分页', responseDto: SysUserEntityWithRolesDto, isPage: true })
  @Permission('sys.menu.system.roleAuth.findAllocatedUserPage')
  @Operate({ ignoreResponse: true })
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body() dto: FindAllocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findAllocatedUserPage(dto)
  }

  @ApiDoc({ endpointSummary: '查询角色未分配用户分页', responseDto: SysUserEntityWithRolesDto, isPage: true })
  @Permission('sys.menu.system.roleAuth.findUnallocatedUserPage')
  @Operate({ ignoreResponse: true })
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body() dto: FindUnallocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findUnallocatedUserPage(dto)
  }

  @ApiDoc({ endpointSummary: '为角色取消分配用户' })
  @Permission('sys.menu.system.roleAuth.unallocateUser')
  @Operate()
  @Post('unallocateUser')
  async unallocateUser(@Body() dto: UnallocateUserForRoleReqDto) {
    await this.systemRoleAuthService.unallocateUser(dto)
  }
}
