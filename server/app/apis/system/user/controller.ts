import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemUserReqDto, FindSystemUserPageReqDto, FindSystemUserPageResDto, UpdateSystemUserReqDto } from './dto'
import { SystemUserService } from './service'

@ApiTags('系统用户接口')
@ApiBearerAuth()
@Controller()
export class SystemUserController {
  constructor(
    private readonly systemUserService: SystemUserService,
  ) {}

  @ApiOperation({ summary: '创建系统用户' })
  @Permission('sys.menu.system.user.create')
  @Post('create')
  async create(@Body() dto: CreateSystemUserReqDto) {
    return await this.systemUserService.create(dto)
  }

  @ApiOperation({ summary: '查询系统用户分页列表' })
  @ApiOkResponse({ type: FindSystemUserPageResDto })
  @Permission('sys.menu.system.user.page')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemUserPageReqDto) {
    return await this.systemUserService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统用户' })
  @Permission('sys.menu.system.user.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemUserService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统用户' })
  @Permission('sys.menu.system.user.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemUserReqDto) {
    return await this.systemUserService.update(dto)
  }
}
