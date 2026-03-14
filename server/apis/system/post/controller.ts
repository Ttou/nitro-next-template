import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { ApiExcelResponse, ExcelService, RemoveReqDto } from '~server/extends'
import { CreateSystemPostReqDto, ExportSystemPostSerializeDto, FindSystemPostPageReqDto, FindSystemPostPageResDto, UpdateSystemPostReqDto } from './dto'
import { SystemPostService } from './service'

@ApiTags('系统岗位接口')
@ApiBearerAuth()
@Controller()
export class SystemPostController {
  constructor(
    private systemPostService: SystemPostService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建岗位' })
  @Permission('sys.menu.system.post.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemPostReqDto) {
    return await this.systemPostService.create(dto)
  }

  @ApiOperation({ summary: '查询岗位分页列表' })
  @ApiOkResponse({ type: FindSystemPostPageResDto })
  @Permission('sys.menu.system.post.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemPostPageReqDto) {
    return await this.systemPostService.findPage(dto)
  }

  @ApiOperation({ summary: '删除岗位' })
  @Permission('sys.menu.system.post.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemPostService.remove(dto)
  }

  @ApiOperation({ summary: '更新岗位' })
  @Permission('sys.menu.system.post.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemPostReqDto) {
    return await this.systemPostService.update(dto)
  }

  @ApiOperation({ summary: '导出岗位' })
  @ApiExcelResponse()
  @Permission('sys.menu.system.post.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemPostPageReqDto) {
    const { data } = await this.systemPostService.findPage(dto)
    return this.excelService.exportFile(ExportSystemPostSerializeDto, data)
  }
}
