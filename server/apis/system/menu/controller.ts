import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { RemoveReqDto } from '~server/extends'
import { CreateSystemMenuReqDto, FindSystemMenuListReqDto, FindSystemMenuListResDto, UpdateSystemMenuReqDto } from './dto'
import { SystemMenuService } from './service'

@ApiTags('系统菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemMenuController {
  constructor(
    private systemMenuService: SystemMenuService,
  ) {}

  @ApiOperation({ summary: '创建菜单' })
  @Permission('sys.menu.system.menu.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemMenuReqDto) {
    return await this.systemMenuService.create(dto)
  }

  @ApiOperation({ summary: '查询菜单列表' })
  @ApiOkResponse({ type: [FindSystemMenuListResDto] })
  @Permission('sys.menu.system.menu.findList')
  @Operate({ ignoreResponse: true })
  @Post('findList')
  async findList(@Body() dto: FindSystemMenuListReqDto) {
    return await this.systemMenuService.findList(dto)
  }

  @ApiOperation({ summary: '删除菜单' })
  @Permission('sys.menu.system.menu.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemMenuService.remove(dto)
  }

  @ApiOperation({ summary: '更新菜单' })
  @Permission('sys.menu.system.menu.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemMenuReqDto) {
    return await this.systemMenuService.update(dto)
  }
}
