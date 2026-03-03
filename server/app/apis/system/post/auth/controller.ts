import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { AutoOperation, AutoResponse } from '~server/app/extends'
import { AllocateUserForPostReqDto, FindAllocatedUserPageForPostReqDto, FindAllocatedUserPageForPostResDto, FindUnallocatedUserPageForPostReqDto, FindUnallocatedUserPageForPostResDto, UnallocateUserForPostReqDto } from './dto'
import { SystemPostAuthService } from './service'

@ApiTags('系统岗位权限接口')
@ApiBearerAuth()
@Controller()
export class SystemPostAuthController {
  constructor(
    private systemPostAuthService: SystemPostAuthService,
  ) {}

  @AutoOperation({ summary: '为岗位分配用户' })
  @Permission('sys.menu.system.postAuth.allocateUser')
  @Post('allocateUser')
  async allocateUser(@Body() dto: AllocateUserForPostReqDto) {
    return await this.systemPostAuthService.allocateUser(dto)
  }

  @AutoOperation({ summary: '查询岗位已分配用户分页' })
  @AutoResponse({ type: FindAllocatedUserPageForPostResDto })
  @Permission('sys.menu.system.postAuth.findAllocatedUserPage')
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body() dto: FindAllocatedUserPageForPostReqDto) {
    return await this.systemPostAuthService.findAllocatedUserPage(dto)
  }

  @AutoOperation({ summary: '查询岗位未分配用户分页' })
  @AutoResponse({ type: FindUnallocatedUserPageForPostResDto })
  @Permission('sys.menu.system.postAuth.findUnallocatedUserPage')
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body() dto: FindUnallocatedUserPageForPostReqDto) {
    return await this.systemPostAuthService.findUnallocatedUserPage(dto)
  }

  @AutoOperation({ summary: '为岗位取消分配用户' })
  @Permission('sys.menu.system.postAuth.unallocateUser')
  @Post('unallocateUser')
  async unallocateUser(@Body() dto: UnallocateUserForPostReqDto) {
    return await this.systemPostAuthService.unallocateUser(dto)
  }
}
