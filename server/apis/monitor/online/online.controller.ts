import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
import { RemoveReqDto } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { FindMonitorOnlinePageReqDto, FindMonitorOnlinePageResDto } from './online.dto'
import { MonitorOnlineService } from './online.service'

@ApiTags('在线用户接口')
@ApiBearerAuth()
@Controller()
export class MonitorOnlineController {
  constructor(private monitorOnlineService: MonitorOnlineService) {}

  @ApiDoc({ endpointSummary: '分页查询在线用户', responseDto: FindMonitorOnlinePageResDto, isPage: true })
  @XltCheckPermission(PermissionEnum.MONITOR_ONLINE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorOnlinePageReqDto) {
    return await this.monitorOnlineService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除在线用户' })
  @XltCheckPermission(PermissionEnum.MONITOR_ONLINE_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.monitorOnlineService.remove(dto)
  }
}
