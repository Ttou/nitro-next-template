import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
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

  @ApiDoc({ endpointSummary: '创建菜单' })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_CREATE)
  @Post('create')
  async create(@Body() dto: CreateSystemMenuReqDto) {
    return await this.systemMenuService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询菜单列表', responseDto: SysMenuEntityExcludeRelationDto, isArray: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_FIND_LIST)
  @Post('findList')
  async findList(@Body() dto: FindSystemMenuListReqDto) {
    return await this.systemMenuService.findList(dto)
  }

  @ApiDoc({ endpointSummary: '删除菜单' })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemMenuService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新菜单' })
  @XltCheckPermission(PermissionEnum.SYSTEM_MENU_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemMenuReqDto) {
    return await this.systemMenuService.update(dto)
  }
}
