import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { SysMenuEntityExcludeRelationDto } from '~db/dtos'
import { RemoveReqDto } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { CreateSystemMenuReqDto, FindSystemMenuListReqDto, UpdateSystemMenuReqDto } from './menu.dto'
import { SystemMenuService } from './menu.service'

@ApiTags('系统菜单接口')
@ApiBearerAuth()
@Controller()
export class SystemMenuController {
  constructor(
    private systemMenuService: SystemMenuService,
  ) {}

  @ApiOperation({ summary: '创建菜单' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_CREATE)
  @Post('create')
  async create(@Body() dto: CreateSystemMenuReqDto) {
    return await this.systemMenuService.create(dto)
  }

  @ApiOperation({ summary: '查询菜单列表' })
  @ApiOkResponse({
    description: '请求成功',
    type: [SysMenuEntityExcludeRelationDto],
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_FIND_LIST)
  @Post('findList')
  async findList(@Body() dto: FindSystemMenuListReqDto) {
    return await this.systemMenuService.findList(dto)
  }

  @ApiOperation({ summary: '删除菜单' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemMenuService.remove(dto)
  }

  @ApiOperation({ summary: '更新菜单' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemMenuReqDto) {
    return await this.systemMenuService.update(dto)
  }
}
