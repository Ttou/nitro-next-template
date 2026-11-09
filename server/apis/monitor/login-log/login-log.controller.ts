import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc } from '~server/decorators'
import { SysLoginLogEntityDto } from '~db/dtos'
import { FindMonitorLoginLogPageReqDto } from './login-log.dto'
import { MonitorLoginLogService } from './login-log.service'

@ApiTags('操作日志接口')
@ApiBearerAuth()
@Controller()
export class MonitorLoginLogController {
  constructor(
    private monitorLoginLogService: MonitorLoginLogService,
  ) {}

  @ApiDoc({ endpointSummary: '分页查询登录日志', responseDto: SysLoginLogEntityDto, isPage: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @XltCheckPermission('sys.menu.monitor.loginLog.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorLoginLogPageReqDto) {
    return this.monitorLoginLogService.findPage(dto)
  }
}
