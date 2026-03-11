import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MonitorOperateService } from './service'

@ApiTags('操作日志接口')
@Controller()
export class MonitorOperateController {
  constructor(
    private monitorOperateService: MonitorOperateService,
  ) {}
}
