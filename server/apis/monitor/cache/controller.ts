import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { ApiDoc } from '~server/openapi'
import { FindMonitorCachePageItemResDto, FindMonitorCachePageReqDto, RemoveMonitorCacheReqDto } from './dto'
import { MonitorCacheService } from './service'

@ApiTags('缓存监控接口')
@ApiBearerAuth()
@Controller()
export class MonitorCacheController {
  constructor(
    private monitorCacheService: MonitorCacheService,
  ) {}

  @ApiDoc({ endpointSummary: '查询缓存列表', responseDto: FindMonitorCachePageItemResDto, isPage: true })
  @Operate({ ignoreResponse: true })
  @Permission('sys.menu.monitor.cache.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorCachePageReqDto) {
    return await this.monitorCacheService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除缓存' })
  @Operate()
  @Permission('sys.menu.monitor.cache.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveMonitorCacheReqDto) {
    return await this.monitorCacheService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '清空缓存' })
  @Operate()
  @Permission('sys.menu.monitor.cache.clear')
  @Delete('clear')
  async clear() {
    return await this.monitorCacheService.clear()
  }
}
