import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { Operate } from '~server/decorators'
import { ApiDoc, RemoveReqDto, SysPostEntityExcludeRelationDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { CreateSystemPostReqDto, ExportSystemPostSerDto, FindSystemPostPageReqDto, UpdateSystemPostReqDto } from './dto'
import { SystemPostService } from './service'

@ApiTags('系统岗位接口')
@ApiBearerAuth()
@Controller()
export class SystemPostController {
  constructor(
    private systemPostService: SystemPostService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建岗位' })
  @XltCheckPermission('sys.menu.system.post.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemPostReqDto) {
    return await this.systemPostService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询岗位分页列表', responseDto: SysPostEntityExcludeRelationDto, isPage: true })
  @XltCheckPermission('sys.menu.system.post.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemPostPageReqDto) {
    return await this.systemPostService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除岗位' })
  @XltCheckPermission('sys.menu.system.post.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemPostService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新岗位' })
  @XltCheckPermission('sys.menu.system.post.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemPostReqDto) {
    return await this.systemPostService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出岗位', isExcel: true })
  @XltCheckPermission('sys.menu.system.post.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemPostPageReqDto) {
    const { data } = await this.systemPostService.findPage(dto)
    return this.excelService.exportFile(ExportSystemPostSerDto, data)
  }
}
