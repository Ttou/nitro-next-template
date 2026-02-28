import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AutoOperation, Permission } from '~server/app/decorators'
import { RemoveReqDto } from '~server/app/extends'
import { FindMonitorOnlinePageReqDto, FindMonitorOnlinePageResDto } from './dto'
import { MonitorOnlineService } from './service'

@ApiTags('在线用户接口')
@ApiBearerAuth()
@Controller()
export class MonitorOnlineController {
  constructor(private readonly monitorOnlineService: MonitorOnlineService) {}

  @AutoOperation({ summary: '分页查询在线用户' })
  @ApiOkResponse({ type: FindMonitorOnlinePageResDto })
  @Permission('sys.menu.monitor.online.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorOnlinePageReqDto) {
    return this.monitorOnlineService.findPage(dto)
  }

  @AutoOperation({ summary: '删除在线用户' })
  @Permission('sys.menu.monitor.online.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return this.monitorOnlineService.remove(dto)
  }
}
