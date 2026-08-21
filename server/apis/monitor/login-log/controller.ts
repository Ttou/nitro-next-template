import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/openapi'
import { FindMonitorLoginLogPageReqDto, SysLoginLogEntityWithUserDto } from './dto'
import { MonitorLoginLogService } from './service'

@ApiTags('操作日志接口')
@ApiBearerAuth()
@Controller()
export class MonitorLoginLogController {
  constructor(
    private monitorLoginLogService: MonitorLoginLogService,
  ) {}

  @ApiDoc({ endpointSummary: '分页查询登录日志', responseDto: SysLoginLogEntityWithUserDto, isPage: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @XltCheckPermission('sys.menu.monitor.loginLog.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorLoginLogPageReqDto) {
    return this.monitorLoginLogService.findPage(dto)
  }
}
