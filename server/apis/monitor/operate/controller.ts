import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/decorators'
import { FindMonitorOperatePageReqDto, FindMonitorOperatePageResDto } from './dto'
import { MonitorOperateService } from './service'

@ApiTags('操作日志接口')
@ApiBearerAuth()
@Controller()
export class MonitorOperateController {
  constructor(
    private monitorOperateService: MonitorOperateService,
  ) {}

  @ApiOperation({ summary: '分页查询在线用户' })
  @ApiOkResponse({ type: FindMonitorOperatePageResDto })
  @Permission('sys.menu.monitor.operate.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorOperatePageReqDto) {
    return this.monitorOperateService.findPage(dto)
  }
}
