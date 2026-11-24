import type { RemoveReqDto } from '~server/dtos'
import type { FindMonitorOnlinePageReqDto } from './online.dto'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { removeReqSchema } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { findMonitorOnlinePageReqSchema, findMonitorOnlinePageResSchema } from './online.dto'
import { MonitorOnlineService } from './online.service'

@ApiTags('在线用户接口')
@ApiBearerAuth()
@Controller()
export class MonitorOnlineController {
  constructor(private monitorOnlineService: MonitorOnlineService) {}

  @ApiOperation({ summary: '分页查询在线用户' })
  @ApiOkResponse({ description: '请求成功', standardSchema: findMonitorOnlinePageResSchema })
  @XltCheckPermission(PermissionEnum.MONITOR_ONLINE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body({ schema: findMonitorOnlinePageReqSchema }) dto: FindMonitorOnlinePageReqDto) {
    return await this.monitorOnlineService.findPage(dto)
  }

  @ApiOperation({ summary: '删除在线用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.MONITOR_ONLINE_REMOVE)
  @Delete('remove')
  async remove(@Body({ schema: removeReqSchema }) dto: RemoveReqDto) {
    return await this.monitorOnlineService.remove(dto)
  }
}
