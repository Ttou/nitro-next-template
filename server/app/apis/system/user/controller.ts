import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AutoOperation, Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/extends'
import { CreateSystemUserReqDto, FindSystemUserPageReqDto, FindSystemUserPageResDto, UpdateSystemUserReqDto } from './dto'
import { SystemUserService } from './service'

@ApiTags('系统用户接口')
@ApiBearerAuth()
@Controller()
export class SystemUserController {
  constructor(
    private readonly systemUserService: SystemUserService,
  ) {}

  @AutoOperation({ summary: '创建系统用户' })
  @Permission('sys.menu.system.user.create')
  @Post('create')
  async create(@Body() dto: CreateSystemUserReqDto) {
    return await this.systemUserService.create(dto)
  }

  @AutoOperation({ summary: '查询系统用户分页列表' })
  @ApiOkResponse({ type: FindSystemUserPageResDto })
  @Permission('sys.menu.system.user.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemUserPageReqDto) {
    return await this.systemUserService.findPage(dto)
  }

  @AutoOperation({ summary: '删除系统用户' })
  @Permission('sys.menu.system.user.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemUserService.remove(dto)
  }

  @AutoOperation({ summary: '更新系统用户' })
  @Permission('sys.menu.system.user.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemUserReqDto) {
    return await this.systemUserService.update(dto)
  }
}
