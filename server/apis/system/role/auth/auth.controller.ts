import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
import { PermissionEnum } from '~shared/enums'
import { AllocateUserForRoleReqDto, FindAllocatedUserPageForRoleReqDto, FindUnallocatedUserPageForRoleReqDto, SysUserEntityWithRolesDto, UnallocateUserForRoleReqDto } from './auth.dto'
import { SystemRoleAuthService } from './auth.service'

@ApiTags('系统角色权限接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleAuthController {
  constructor(
    private systemRoleAuthService: SystemRoleAuthService,
  ) {}

  @ApiDoc({ endpointSummary: '为角色分配用户' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_ALLOCATE_USER)
  @Post('allocateUser')
  async allocateUser(@Body() dto: AllocateUserForRoleReqDto) {
    await this.systemRoleAuthService.allocateUser(dto)
  }

  @ApiDoc({ endpointSummary: '查询角色已分配用户分页', responseDto: SysUserEntityWithRolesDto, isPage: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_FIND_ALLOCATED_USER_PAGE)
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body() dto: FindAllocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findAllocatedUserPage(dto)
  }

  @ApiDoc({ endpointSummary: '查询角色未分配用户分页', responseDto: SysUserEntityWithRolesDto, isPage: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_FIND_UNALLOCATED_USER_PAGE)
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body() dto: FindUnallocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findUnallocatedUserPage(dto)
  }

  @ApiDoc({ endpointSummary: '为角色取消分配用户' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_UNALLOCATE_USER)
  @Post('unallocateUser')
  async unallocateUser(@Body() dto: UnallocateUserForRoleReqDto) {
    await this.systemRoleAuthService.unallocateUser(dto)
  }
}
