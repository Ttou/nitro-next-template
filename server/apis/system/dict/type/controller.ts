import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Operate, Permission } from '~server/decorators'
import { CacheInterceptor, CacheKey, CacheTTL, ExcelService } from '~server/extends'
import { ApiExcelResponse, RemoveReqDto } from '~server/openapi'
import { CreateSystemDictTypeReqDto, ExportSystemDictTypeSerializeDto, FindSystemDictDetailByKeyReqDto, FindSystemDictDetailByKeyResDto, FindSystemDictTypePageReqDto, FindSystemDictTypePageResDto, UpdateSystemDictTypeReqDto } from './dto'
import { SystemDictTypeService } from './service'

@ApiTags('字典类型接口')
@ApiBearerAuth()
@Controller()
export class SystemDictTypeController {
  constructor(
    private systemDictTypeService: SystemDictTypeService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建字典类型' })
  @Permission('sys.menu.system.dictType.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemDictTypeReqDto) {
    await this.systemDictTypeService.create(dto)
  }

  @ApiOperation({ summary: '根据字典类型查询字典数据' })
  @ApiOkResponse({ type: [FindSystemDictDetailByKeyResDto] })
  @CacheKey(req => `sys_dict:${req.query.dictType}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemDictDetailByKeyReqDto) {
    return await this.systemDictTypeService.findByKey(dto)
  }

  @ApiOperation({ summary: '查询字典类型分页列表' })
  @ApiOkResponse({ type: FindSystemDictTypePageResDto })
  @Permission('sys.menu.system.dictType.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @ApiOperation({ summary: '删除字典类型' })
  @Permission('sys.menu.system.dictType.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @ApiOperation({ summary: '更新字典类型' })
  @Permission('sys.menu.system.dictType.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemDictTypeReqDto) {
    return await this.systemDictTypeService.update(dto)
  }

  @ApiOperation({ summary: '导出字典类型' })
  @ApiExcelResponse()
  @Permission('sys.menu.system.dictType.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemDictTypePageReqDto) {
    const { data } = await this.systemDictTypeService.findPage(dto)
    return this.excelService.exportFile(ExportSystemDictTypeSerializeDto, data)
  }
}
