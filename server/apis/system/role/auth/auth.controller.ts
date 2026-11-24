import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { PermissionEnum } from '~shared/enums'
import { AllocateUserForRoleReqDto, FindAllocatedUserPageForRoleReqDto, FindAllocatedUserPageForRoleResDto, FindUnallocatedUserPageForRoleReqDto, FindUnallocatedUserPageForRoleResDto, UnallocateUserForRoleReqDto } from './auth.dto'
import { SystemRoleAuthService } from './auth.service'

@ApiTags('系统角色权限接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleAuthController {
  constructor(
    private systemRoleAuthService: SystemRoleAuthService,
  ) {}

  @ApiOperation({ summary: '为角色分配用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_ALLOCATE_USER)
  @Post('allocateUser')
  async allocateUser(@Body() dto: AllocateUserForRoleReqDto) {
    await this.systemRoleAuthService.allocateUser(dto)
  }

  @ApiOperation({ summary: '查询角色已分配用户分页' })
  @ApiOkResponse({ description: '请求成功', type: FindAllocatedUserPageForRoleResDto })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_FIND_ALLOCATED_USER_PAGE)
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body() dto: FindAllocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findAllocatedUserPage(dto)
  }

  @ApiOperation({ summary: '查询角色未分配用户分页' })
  @ApiOkResponse({ description: '请求成功', type: FindUnallocatedUserPageForRoleResDto })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_FIND_UNALLOCATED_USER_PAGE)
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body() dto: FindUnallocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findUnallocatedUserPage(dto)
  }

  @ApiOperation({ summary: '为角色取消分配用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_UNALLOCATE_USER)
  @Post('unallocateUser')
  async unallocateUser(@Body() dto: UnallocateUserForRoleReqDto) {
    await this.systemRoleAuthService.unallocateUser(dto)
  }
}
