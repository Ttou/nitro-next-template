import type { AllocateUserForPostReqDto, FindAllocatedUserPageForPostReqDto, FindUnallocatedUserPageForPostReqDto, UnallocateUserForPostReqDto } from '~shared/dtos'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { allocateUserForPostReqSchema, findAllocatedUserPageForPostReqSchema, findAllocatedUserPageForPostResSchema, findUnallocatedUserPageForPostReqSchema, findUnallocatedUserPageForPostResSchema, unallocateUserForPostReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
import { SystemPostAuthService } from './auth.service'

@ApiTags('系统岗位权限接口')
@ApiBearerAuth()
@Controller()
export class SystemPostAuthController {
  constructor(
    private systemPostAuthService: SystemPostAuthService,
  ) {}

  @ApiOperation({ summary: '为岗位分配用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_ALLOCATE_USER)
  @Post('allocateUser')
  async allocateUser(@Body({
    schema: allocateUserForPostReqSchema(),
  }) dto: AllocateUserForPostReqDto,
  ) {
    return await this.systemPostAuthService.allocateUser(dto)
  }

  @ApiOperation({ summary: '查询岗位已分配用户分页' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: findAllocatedUserPageForPostResSchema(),
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_FIND_ALLOCATED_USER_PAGE)
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body({
    schema: findAllocatedUserPageForPostReqSchema(),
  }) dto: FindAllocatedUserPageForPostReqDto,
  ) {
    return await this.systemPostAuthService.findAllocatedUserPage(dto)
  }

  @ApiOperation({ summary: '查询岗位未分配用户分页' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: findUnallocatedUserPageForPostResSchema(),
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_FIND_UNALLOCATED_USER_PAGE)
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body({
    schema: findUnallocatedUserPageForPostReqSchema(),
  }) dto: FindUnallocatedUserPageForPostReqDto,
  ) {
    return await this.systemPostAuthService.findUnallocatedUserPage(dto)
  }

  @ApiOperation({ summary: '为岗位取消分配用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_POST_AUTH_UNALLOCATE_USER)
  @Post('unallocateUser')
  async unallocateUser(@Body({
    schema: unallocateUserForPostReqSchema(),
  }) dto: UnallocateUserForPostReqDto,
  ) {
    return await this.systemPostAuthService.unallocateUser(dto)
  }
}
