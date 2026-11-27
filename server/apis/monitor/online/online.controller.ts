import type { FindMonitorOnlinePageReqDto, RemoveReqDto } from '~shared/dtos'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { findMonitorOnlinePageReqSchema, findMonitorOnlinePageResSchema, removeReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
import { MonitorOnlineService } from './online.service'

@ApiTags('在线用户接口')
@ApiBearerAuth()
@Controller()
export class MonitorOnlineController {
  constructor(private monitorOnlineService: MonitorOnlineService) {}

  @ApiOperation({ summary: '分页查询在线用户' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: findMonitorOnlinePageResSchema(),
  })
  @XltCheckPermission(PermissionEnum.MONITOR_ONLINE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body({
    schema: findMonitorOnlinePageReqSchema(),
  }) dto: FindMonitorOnlinePageReqDto,
  ) {
    return await this.monitorOnlineService.findPage(dto)
  }

  @ApiOperation({ summary: '删除在线用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.MONITOR_ONLINE_REMOVE)
  @Delete('remove')
  async remove(@Body({
    schema: removeReqSchema(),
  }) dto: RemoveReqDto,
  ) {
    return await this.monitorOnlineService.remove(dto)
  }
}
