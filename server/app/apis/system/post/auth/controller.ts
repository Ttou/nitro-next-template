import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { AllocateUserForPostReqDto, FindAllocatedUserPageForPostReqDto, FindAllocatedUserPageForPostResDto, FindUnallocatedUserPageForPostReqDto, FindUnallocatedUserPageForPostResDto, UnallocateUserForPostReqDto } from './dto'
import { SystemPostAuthService } from './service'

@ApiTags('系统岗位权限接口')
@ApiBearerAuth()
@Controller()
export class SystemPostAuthController {
  constructor(
    private readonly systemPostAuthService: SystemPostAuthService,
  ) {}

  @ApiOperation({ summary: '为岗位分配用户' })
  @Permission('sys.menu.system.postAuth.allocateUser')
  @Post('allocateUser')
  async allocateUser(@Body() dto: AllocateUserForPostReqDto) {
    return await this.systemPostAuthService.allocateUser(dto)
  }

  @ApiOperation({ summary: '查询岗位已分配用户分页' })
  @ApiOkResponse({ type: FindAllocatedUserPageForPostResDto })
  @Permission('sys.menu.system.postAuth.findAllocatedUserPage')
  @Post('findAllocatedUserPage')
  async findAllocatedUserPage(@Body() dto: FindAllocatedUserPageForPostReqDto) {
    return await this.systemPostAuthService.findAllocatedUserPage(dto)
  }

  @ApiOperation({ summary: '查询岗位未分配用户分页' })
  @ApiOkResponse({ type: FindUnallocatedUserPageForPostResDto })
  @Permission('sys.menu.system.postAuth.findUnallocatedUserPage')
  @Post('findUnallocatedUserPage')
  async findUnallocatedUserPage(@Body() dto: FindUnallocatedUserPageForPostReqDto) {
    return await this.systemPostAuthService.findUnallocatedUserPage(dto)
  }

  @ApiOperation({ summary: '为岗位取消分配用户' })
  @Permission('sys.menu.system.postAuth.unallocateUser')
  @Post('unallocateUser')
  async unallocateUser(@Body() dto: UnallocateUserForPostReqDto) {
    return await this.systemPostAuthService.unallocateUser(dto)
  }
}
