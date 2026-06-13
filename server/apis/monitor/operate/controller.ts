import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/decorators'
import { ApiDoc } from '~server/openapi'
import { FindMonitorOperatePageReqDto, SysOperateLogEntityWithUserDto } from './dto'
import { MonitorOperateService } from './service'

@ApiTags('操作日志接口')
@ApiBearerAuth()
@Controller()
export class MonitorOperateController {
  constructor(
    private monitorOperateService: MonitorOperateService,
  ) {}

  @ApiDoc({ endpointSummary: '分页查询操作日志', responseDto: SysOperateLogEntityWithUserDto, isPage: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @Permission('sys.menu.monitor.operate.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorOperatePageReqDto) {
    return this.monitorOperateService.findPage(dto)
  }
}
