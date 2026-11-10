import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
import { PermissionEnum } from '~shared/enums'
import { AllocateUserForPostReqDto, FindAllocatedUserPageForPostReqDto, FindUnallocatedUserPageForPostReqDto, SysUserEntityWithPostsDto, UnallocateUserForPostReqDto } from './auth.dto'
import { SystemPostAuthService } from './auth.service'

@ApiTags('系统岗位权限接口')
@ApiBearerAuth()
@Controller()
export class SystemPostAuthController {
  constructor(
    private systemPostAuthService: SystemPostAuthService,
  ) {}

  @ApiDoc({ endpointSummary: '为岗位分配用户' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_ALLOCATE_USER)
  @Post('allocateUser')
  async allocateUser(@Body() dto: AllocateUserForPostReqDto) {
    return await this.systemPostAuthService.allocateUser(dto)
  }

  @ApiDoc({ endpointSummary: '查询岗位已分配用户分页', responseDto: SysUserEntityWithPostsDto, isPage: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_FIND_ALLOCATED_USER_PAGE)
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body() dto: FindAllocatedUserPageForPostReqDto) {
    return await this.systemPostAuthService.findAllocatedUserPage(dto)
  }

  @ApiDoc({ endpointSummary: '查询岗位未分配用户分页', responseDto: SysUserEntityWithPostsDto, isPage: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_FIND_UNALLOCATED_USER_PAGE)
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body() dto: FindUnallocatedUserPageForPostReqDto) {
    return await this.systemPostAuthService.findUnallocatedUserPage(dto)
  }

  @ApiDoc({ endpointSummary: '为岗位取消分配用户' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_UNALLOCATE_USER)
  @Post('unallocateUser')
  async unallocateUser(@Body() dto: UnallocateUserForPostReqDto) {
    return await this.systemPostAuthService.unallocateUser(dto)
  }
}
