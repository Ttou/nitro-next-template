import type { FindMonitorLoginLogPageReqDto } from './login-log.dto'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { PermissionEnum } from '~shared/enums'
import { findMonitorLoginLogPageReqSchema, findMonitorLoginLogPageResSchema } from './login-log.dto'
import { MonitorLoginLogService } from './login-log.service'

@ApiTags('操作日志接口')
@ApiBearerAuth()
@Controller()
export class MonitorLoginLogController {
  constructor(
    private monitorLoginLogService: MonitorLoginLogService,
  ) {}

  @ApiOperation({ summary: '分页查询登录日志' })
  @ApiOkResponse({ description: '请求成功', standardSchema: findMonitorLoginLogPageResSchema })
  @XltCheckPermission(PermissionEnum.MONITOR_LOGIN_LOG_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body({ schema: findMonitorLoginLogPageReqSchema }) dto: FindMonitorLoginLogPageReqDto) {
    return this.monitorLoginLogService.findPage(dto)
  }
}
