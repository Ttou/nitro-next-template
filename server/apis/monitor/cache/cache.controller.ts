import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
import { PermissionEnum } from '~shared/enums'
import { FindMonitorCacheByKeyReqDto, FindMonitorCachePageItemResDto, FindMonitorCachePageReqDto, RemoveMonitorCacheReqDto } from './cache.dto'
import { MonitorCacheService } from './cache.service'

@ApiTags('缓存监控接口')
@ApiBearerAuth()
@Controller()
export class MonitorCacheController {
  constructor(
    private monitorCacheService: MonitorCacheService,
  ) {}

  @ApiDoc({ endpointSummary: '查询缓存列表', responseDto: FindMonitorCachePageItemResDto, isPage: true })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorCachePageReqDto) {
    return await this.monitorCacheService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '根据键名查询缓存详情', responseDto: Object })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_FIND_BY_KEY)
  @Get('findByKey')
  async findByKey(@Query() dto: FindMonitorCacheByKeyReqDto) {
    return await this.monitorCacheService.findByKey(dto)
  }

  @ApiDoc({ endpointSummary: '删除缓存' })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveMonitorCacheReqDto) {
    return await this.monitorCacheService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '清空缓存' })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_CLEAR)
  @Delete('clear')
  async clear() {
    return await this.monitorCacheService.clear()
  }
}
