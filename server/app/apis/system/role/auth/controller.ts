import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AutoOperation, Permission } from '~server/app/decorators'
import { AllocateUserForRoleReqDto, FindAllocatedUserPageForRoleReqDto, FindAllocatedUserPageForRoleResDto, FindUnallocatedUserPageForRoleReqDto, FindUnallocatedUserPageForRoleResDto, UnallocateUserForRoleReqDto } from './dto'
import { SystemRoleAuthService } from './service'

@ApiTags('系统角色权限接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleAuthController {
  constructor(
    private readonly systemRoleAuthService: SystemRoleAuthService,
  ) {}

  @AutoOperation({ summary: '为角色分配用户' })
  @Permission('sys.menu.system.roleAuth.allocateUser')
  @Post('allocateUser')
  async allocateUser(@Body() dto: AllocateUserForRoleReqDto) {
    await this.systemRoleAuthService.allocateUser(dto)
  }

  @AutoOperation({ summary: '查询角色已分配用户分页' })
  @ApiOkResponse({ type: FindAllocatedUserPageForRoleResDto })
  @Permission('sys.menu.system.roleAuth.findAllocatedUserPage')
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body() dto: FindAllocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findAllocatedUserPage(dto)
  }

  @AutoOperation({ summary: '查询角色未分配用户分页' })
  @ApiOkResponse({ type: FindUnallocatedUserPageForRoleResDto })
  @Permission('sys.menu.system.roleAuth.findUnallocatedUserPage')
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body() dto: FindUnallocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findUnallocatedUserPage(dto)
  }

  @AutoOperation({ summary: '为角色取消分配用户' })
  @Permission('sys.menu.system.roleAuth.unallocateUser')
  @Post('unallocateUser')
  async unallocateUser(@Body() dto: UnallocateUserForRoleReqDto) {
    await this.systemRoleAuthService.unallocateUser(dto)
  }
}
