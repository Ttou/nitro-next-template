import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { CacheKey, CacheTTL } from '~server/decorators'
import { CacheInterceptor } from '~server/interceptors'
import { ApiDoc, RemoveReqDto, SysDictDataEntityDto, SysDictTypeEntityDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { CreateSystemDictTypeReqDto, ExportSystemDictTypeSerDto, FindSystemDictDetailByKeyReqDto, FindSystemDictTypePageReqDto, UpdateSystemDictTypeReqDto } from './dto'
import { SystemDictTypeService } from './service'

@ApiTags('字典类型接口')
@ApiBearerAuth()
@Controller()
export class SystemDictTypeController {
  constructor(
    private systemDictTypeService: SystemDictTypeService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建字典类型' })
  @XltCheckPermission('sys.menu.system.dictType.create')
  @Post('create')
  async create(@Body() dto: CreateSystemDictTypeReqDto) {
    await this.systemDictTypeService.create(dto)
  }

  @ApiDoc({ endpointSummary: '根据字典类型查询字典数据', responseDto: SysDictDataEntityDto, isArray: true })
  @CacheKey(ctx => `sys_dict:${ctx.switchToHttp().getRequest().query.dictType}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemDictDetailByKeyReqDto) {
    return await this.systemDictTypeService.findByKey(dto)
  }

  @ApiDoc({ endpointSummary: '查询字典类型分页列表', responseDto: SysDictTypeEntityDto, isPage: true })
  @XltCheckPermission('sys.menu.system.dictType.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除字典类型' })
  @XltCheckPermission('sys.menu.system.dictType.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新字典类型' })
  @XltCheckPermission('sys.menu.system.dictType.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemDictTypeReqDto) {
    return await this.systemDictTypeService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出字典类型', isExcel: true })
  @XltCheckPermission('sys.menu.system.dictType.export')
  @Post('export')
  async export(@Body() dto: FindSystemDictTypePageReqDto) {
    const { data } = await this.systemDictTypeService.findPage(dto)
    return this.excelService.exportFile(ExportSystemDictTypeSerDto, data)
  }
}
