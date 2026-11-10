import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { CacheInterceptor, CacheKey, CacheTTL } from '~nestjs-modules/cache'
import { ExcelService } from '~nestjs-modules/excel'
import { ApiDoc } from '~server/decorators'
import { SysDictDataEntityDto, SysDictTypeEntityDto } from '~db/dtos'
import { RemoveReqDto } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { CreateSystemDictTypeReqDto, ExportSystemDictTypeSerDto, FindSystemDictDetailByKeyReqDto, FindSystemDictTypePageReqDto, UpdateSystemDictTypeReqDto } from './type.dto'
import { SystemDictTypeService } from './type.service'

@ApiTags('字典类型接口')
@ApiBearerAuth()
@Controller()
export class SystemDictTypeController {
  constructor(
    private systemDictTypeService: SystemDictTypeService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建字典类型' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_CREATE)
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
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除字典类型' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新字典类型' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemDictTypeReqDto) {
    return await this.systemDictTypeService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出字典类型', isExcel: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_EXPORT)
  @Post('export')
  async export(@Body() dto: FindSystemDictTypePageReqDto) {
    const { data } = await this.systemDictTypeService.findPage(dto)
    return this.excelService.exportFile(ExportSystemDictTypeSerDto, data)
  }
}
