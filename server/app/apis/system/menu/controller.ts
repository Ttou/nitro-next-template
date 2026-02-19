import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/openapi'
import { CreateSystemMenuReqDto, FindSystemMenuListReqDto, FindSystemMenuListResDto, UpdateSystemMenuReqDto } from './dto'
import { SystemMenuService } from './service'

@ApiTags('系统菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemMenuController {
  constructor(
    private readonly systemMenuService: SystemMenuService,
  ) {}

  @ApiOperation({ summary: '创建菜单' })
  @Permission('sys.menu.system.menu.create')
  @Post('create')
  async create(@Body() dto: CreateSystemMenuReqDto) {
    return await this.systemMenuService.create(dto)
  }

  @ApiOperation({ summary: '查询菜单列表' })
  @ApiOkResponse({ type: FindSystemMenuListResDto })
  @Permission('sys.menu.system.menu.findList')
  @Post('findList')
  async findList(@Body() dto: FindSystemMenuListReqDto) {
    return await this.systemMenuService.findList(dto)
  }

  @ApiOperation({ summary: '删除菜单' })
  @Permission('sys.menu.system.menu.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemMenuService.remove(dto)
  }

  @ApiOperation({ summary: '更新菜单' })
  @Permission('sys.menu.system.menu.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemMenuReqDto) {
    return await this.systemMenuService.update(dto)
  }
}
