import { Body, ClassSerializerInterceptor, Controller, Delete, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ApiDoc, RemoveReqDto } from '~server/openapi'
import { FindMonitorOnlinePageReqDto, SysOnlineEntityExcludeTokenDto } from './dto'
import { MonitorOnlineService } from './service'

@ApiTags('在线用户接口')
@ApiBearerAuth()
@Controller()
export class MonitorOnlineController {
  constructor(private monitorOnlineService: MonitorOnlineService) {}

  @ApiDoc({ endpointSummary: '分页查询在线用户', responseDto: SysOnlineEntityExcludeTokenDto, isPage: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @XltCheckPermission('sys.menu.monitor.online.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindMonitorOnlinePageReqDto) {
    return await this.monitorOnlineService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除在线用户' })
  @XltCheckPermission('sys.menu.monitor.online.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.monitorOnlineService.remove(dto)
  }
}
