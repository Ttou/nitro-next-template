import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { PermissionEnum } from '~shared/enums'
import { FindMonitorCacheByKeyReqDto, FindMonitorCachePageReqDto, FindMonitorCachePageResDto, RemoveMonitorCacheReqDto } from './cache.dto'
import { MonitorCacheService } from './cache.service'

@ApiTags('缓存监控接口')
@ApiBearerAuth()
@Controller()
export class MonitorCacheController {
  constructor(
    private monitorCacheService: MonitorCacheService,
  ) {}

  @ApiOperation({ summary: '查询缓存列表' })
  @ApiOkResponse({ description: '请求成功', type: FindMonitorCachePageResDto })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorCachePageReqDto) {
    return await this.monitorCacheService.findPage(dto)
  }

  @ApiOperation({ summary: '根据键名查询缓存详情' })
  @ApiOkResponse({ description: '请求成功', type: Object })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_FIND_BY_KEY)
  @Get('findByKey')
  async findByKey(@Query() dto: FindMonitorCacheByKeyReqDto) {
    return await this.monitorCacheService.findByKey(dto)
  }

  @ApiOperation({ summary: '删除缓存' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveMonitorCacheReqDto) {
    return await this.monitorCacheService.remove(dto)
  }

  @ApiOperation({ summary: '清空缓存' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.MONITOR_CACHE_CLEAR)
  @Delete('clear')
  async clear() {
    return await this.monitorCacheService.clear()
  }
}
