import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { DelReqDto, ResultResDto } from '~server/app/openapi'
import { FindMonitorOnlinePageReqDto, FindMonitorOnlinePageResDto } from './dto'
import { MonitorOnlineService } from './service'

@ApiTags('在线用户接口')
@ApiBearerAuth()
@Controller()
export class MonitorOnlineController {
  constructor(private readonly monitorOnlineService: MonitorOnlineService) {}

  @ApiOperation({ summary: '分页查询在线用户' })
  @ApiOkResponse({ type: FindMonitorOnlinePageResDto })
  @Permission('sys.menu.monitor.online.findPage')
  @Post('page')
  async getPage(@Body() dto: FindMonitorOnlinePageReqDto) {
    return this.monitorOnlineService.getPage(dto)
  }

  @ApiOperation({ summary: '删除在线用户' })
  @Permission('sys.menu.monitor.online.remove')
  @Post('remove')
  async remove(@Body() dto: DelReqDto) {
    return this.monitorOnlineService.remove(dto)
  }
}
