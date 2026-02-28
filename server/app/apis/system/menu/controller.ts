import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AutoOperation, Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/extends'
import { CreateSystemMenuReqDto, FindSystemMenuListReqDto, FindSystemMenuListResDto, UpdateSystemMenuReqDto } from './dto'
import { SystemMenuService } from './service'

@ApiTags('系统菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemMenuController {
  constructor(
    private readonly systemMenuService: SystemMenuService,
  ) {}

  @AutoOperation({ summary: '创建菜单' })
  @Permission('sys.menu.system.menu.create')
  @Post('create')
  async create(@Body() dto: CreateSystemMenuReqDto) {
    return await this.systemMenuService.create(dto)
  }

  @AutoOperation({ summary: '查询菜单列表' })
  @ApiOkResponse({ schema: FindSystemMenuListResDto })
  @Permission('sys.menu.system.menu.findList')
  @Post('findList')
  async findList(@Body() dto: FindSystemMenuListReqDto) {
    return await this.systemMenuService.findList(dto)
  }

  @AutoOperation({ summary: '删除菜单' })
  @Permission('sys.menu.system.menu.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemMenuService.remove(dto)
  }

  @AutoOperation({ summary: '更新菜单' })
  @Permission('sys.menu.system.menu.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemMenuReqDto) {
    return await this.systemMenuService.update(dto)
  }
}
