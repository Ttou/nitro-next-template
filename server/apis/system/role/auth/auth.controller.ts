import type { AllocateUserForRoleReqDto, FindAllocatedUserPageForRoleReqDto, FindUnallocatedUserPageForRoleReqDto, UnallocateUserForRoleReqDto } from '~shared/dtos'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { allocateUserForRoleReqSchema, findAllocatedUserPageForRoleReqSchema, findAllocatedUserPageForRoleResSchema, findUnallocatedUserPageForRoleReqSchema, findUnallocatedUserPageForRoleResSchema, unallocateUserForRoleReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
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
  async allocateUser(@Body({
    schema: allocateUserForRoleReqSchema(),
  }) dto: AllocateUserForRoleReqDto,
  ) {
    await this.systemRoleAuthService.allocateUser(dto)
  }

  @ApiOperation({ summary: '查询角色已分配用户分页' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: findAllocatedUserPageForRoleResSchema(),
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_FIND_ALLOCATED_USER_PAGE)
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body({
    schema: findAllocatedUserPageForRoleReqSchema(),
  }) dto: FindAllocatedUserPageForRoleReqDto,
  ) {
    return await this.systemRoleAuthService.findAllocatedUserPage(dto)
  }

  @ApiOperation({ summary: '查询角色未分配用户分页' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: findUnallocatedUserPageForRoleResSchema(),
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_FIND_UNALLOCATED_USER_PAGE)
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body({
    schema: findUnallocatedUserPageForRoleReqSchema(),
  }) dto: FindUnallocatedUserPageForRoleReqDto,
  ) {
    return await this.systemRoleAuthService.findUnallocatedUserPage(dto)
  }

  @ApiOperation({ summary: '为角色取消分配用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_ROLE_AUTH_UNALLOCATE_USER)
  @Post('unallocateUser')
  async unallocateUser(@Body({
    schema: unallocateUserForRoleReqSchema(),
  }) dto: UnallocateUserForRoleReqDto,
  ) {
    await this.systemRoleAuthService.unallocateUser(dto)
  }
}
