import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { ApiDoc, RemoveReqDto, SysMenuEntityExcludeRelationDto } from '~server/openapi'
import { CreateSystemMenuReqDto, FindSystemMenuListReqDto, UpdateSystemMenuReqDto } from './dto'
import { SystemMenuService } from './service'

@ApiTags('系统菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemMenuController {
  constructor(
    private systemMenuService: SystemMenuService,
  ) {}

  @ApiDoc({ endpointSummary: '创建菜单' })
  @Permission('sys.menu.system.menu.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemMenuReqDto) {
    return await this.systemMenuService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询菜单列表', responseDto: SysMenuEntityExcludeRelationDto, isArray: true })
  @Permission('sys.menu.system.menu.findList')
  @Operate({ ignoreResponse: true })
  @Post('findList')
  async findList(@Body() dto: FindSystemMenuListReqDto) {
    return await this.systemMenuService.findList(dto)
  }

  @ApiDoc({ endpointSummary: '删除菜单' })
  @Permission('sys.menu.system.menu.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemMenuService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新菜单' })
  @Permission('sys.menu.system.menu.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemMenuReqDto) {
    return await this.systemMenuService.update(dto)
  }
}
