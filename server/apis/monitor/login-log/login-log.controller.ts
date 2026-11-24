import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { PermissionEnum } from '~shared/enums'
import { FindMonitorLoginLogPageReqDto, FindMonitorLoginLogPageResDto } from './login-log.dto'
import { MonitorLoginLogService } from './login-log.service'

@ApiTags('操作日志接口')
@ApiBearerAuth()
@Controller()
export class MonitorLoginLogController {
  constructor(
    private monitorLoginLogService: MonitorLoginLogService,
  ) {}

  @ApiOperation({ summary: '分页查询登录日志' })
  @ApiOkResponse({ description: '请求成功', type: FindMonitorLoginLogPageResDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @XltCheckPermission(PermissionEnum.MONITOR_LOGIN_LOG_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorLoginLogPageReqDto) {
    return this.monitorLoginLogService.findPage(dto)
  }
}
