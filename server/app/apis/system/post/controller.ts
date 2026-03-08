import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '~server/app/decorators'
import { ExcelService, RemoveReqDto } from '~server/app/extends'
import { CreateSystemPostReqDto, ExportSystemPostResDto, FindSystemPostPageReqDto, FindSystemPostPageResDto, UpdateSystemPostReqDto } from './dto'
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
  @Post('create')
  async create(@Body() dto: CreateSystemPostReqDto) {
    return await this.systemPostService.create(dto)
  }

  @ApiOperation({ summary: '查询岗位分页列表' })
  @ApiOkResponse({ type: FindSystemPostPageResDto })
  @Permission('sys.menu.system.post.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemPostPageReqDto) {
    return await this.systemPostService.findPage(dto)
  }

  @ApiOperation({ summary: '删除岗位' })
  @Permission('sys.menu.system.post.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemPostService.remove(dto)
  }

  @ApiOperation({ summary: '更新岗位' })
  @Permission('sys.menu.system.post.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemPostReqDto) {
    return await this.systemPostService.update(dto)
  }

  @ApiOperation({ summary: '导出岗位' })
  @ApiOkResponse({
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Permission('sys.menu.system.post.export')
  @Post('export')
  async export(@Body() dto: FindSystemPostPageReqDto) {
    const { data } = await this.systemPostService.findPage(dto)
    return this.excelService.exportStream(ExportSystemPostResDto, data)
  }
}
