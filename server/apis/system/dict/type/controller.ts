import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CustomCacheInterceptor } from '~server/customs'
import { Operate, Permission } from '~server/decorators'
import { ApiDoc, RemoveReqDto, SysDictDataEntityDto, SysDictTypeEntityDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { parseMs } from '~shared/utils'
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
  @Permission('sys.menu.system.dictType.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemDictTypeReqDto) {
    await this.systemDictTypeService.create(dto)
  }

  @ApiDoc({ endpointSummary: '根据字典类型查询字典数据', responseDto: SysDictDataEntityDto, isArray: true })
  @CacheKey(ctx => `sys_dict:${ctx.switchToHttp().getRequest().query.dictType}`)
  @CacheTTL(parseMs('milliseconds', '1d'))
  @UseInterceptors(CustomCacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemDictDetailByKeyReqDto) {
    return await this.systemDictTypeService.findByKey(dto)
  }

  @ApiDoc({ endpointSummary: '查询字典类型分页列表', responseDto: SysDictTypeEntityDto, isPage: true })
  @Permission('sys.menu.system.dictType.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除字典类型' })
  @Permission('sys.menu.system.dictType.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新字典类型' })
  @Permission('sys.menu.system.dictType.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemDictTypeReqDto) {
    return await this.systemDictTypeService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出字典类型', isExcel: true })
  @Permission('sys.menu.system.dictType.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemDictTypePageReqDto) {
    const { data } = await this.systemDictTypeService.findPage(dto)
    return this.excelService.exportFile(ExportSystemDictTypeSerDto, data)
  }
}
