import { Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { AllocateUserForRoleReqDto, FindAllocatedUserPageForRoleReqDto, FindAllocatedUserPageForRoleResDto, FindUnallocatedUserPageForRoleReqDto, FindUnallocatedUserPageForRoleResDto, UnallocateUserForRoleReqDto } from './dto'
import { SystemRoleAuthService } from './service'

@ApiTags('系统角色权限接口')
@ApiBearerAuth()
@Controller()
export class SystemRoleAuthController {
  constructor(
    private readonly systemRoleAuthService: SystemRoleAuthService,
  ) {}

  @ApiOperation({ summary: '为角色分配用户' })
  @Permission('sys.menu.system.roleAuth.allocateUser')
  @Post('allocateUser')
  async allocateUser(dto: AllocateUserForRoleReqDto) {
    await this.systemRoleAuthService.allocateUser(dto)
  }

  @ApiOperation({ summary: '查询角色已分配用户分页' })
  @ApiOkResponse({ type: FindAllocatedUserPageForRoleResDto })
  @Permission('sys.menu.system.roleAuth.findAllocatedUserPage')
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(dto: FindAllocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findAllocatedUserPage(dto)
  }

  @ApiOperation({ summary: '查询角色未分配用户分页' })
  @ApiOkResponse({ type: FindUnallocatedUserPageForRoleResDto })
  @Permission('sys.menu.system.roleAuth.findUnallocatedUserPage')
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(dto: FindUnallocatedUserPageForRoleReqDto) {
    return await this.systemRoleAuthService.findUnallocatedUserPage(dto)
  }

  @ApiOperation({ summary: '为角色取消分配用户' })
  @Permission('sys.menu.system.roleAuth.unallocateUser')
  @Post('unallocateUser')
  async unallocateUser(dto: UnallocateUserForRoleReqDto) {
    await this.systemRoleAuthService.unallocateUser(dto)
  }
}
