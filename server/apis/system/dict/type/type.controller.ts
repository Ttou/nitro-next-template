import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { SysDictDataEntityDto } from '~db/dtos'
import { CacheInterceptor, CacheKey, CacheTTL } from '~nestjs-modules/cache'
import { ExcelService } from '~nestjs-modules/excel'
import { RemoveReqDto } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { CreateSystemDictTypeReqDto, ExportSystemDictTypeSerDto, FindSystemDictDetailByKeyReqDto, FindSystemDictTypePageReqDto, FindSystemDictTypePageResDto, UpdateSystemDictTypeReqDto } from './type.dto'
import { SystemDictTypeService } from './type.service'

@ApiTags('字典类型接口')
@ApiBearerAuth()
@Controller()
export class SystemDictTypeController {
  constructor(
    private systemDictTypeService: SystemDictTypeService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建字典类型' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_CREATE)
  @Post('create')
  async create(@Body() dto: CreateSystemDictTypeReqDto) {
    await this.systemDictTypeService.create(dto)
  }

  @ApiOperation({ summary: '根据字典类型查询字典数据' })
  @ApiOkResponse({
    description: '请求成功',
    type: [SysDictDataEntityDto],
  })
  @CacheKey(ctx => `sys_dict:${ctx.switchToHttp().getRequest().query.dictType}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemDictDetailByKeyReqDto) {
    return await this.systemDictTypeService.findByKey(dto)
  }

  @ApiOperation({ summary: '查询字典类型分页列表' })
  @ApiOkResponse({ description: '请求成功', type: FindSystemDictTypePageResDto })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @ApiOperation({ summary: '删除字典类型' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @ApiOperation({ summary: '更新字典类型' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemDictTypeReqDto) {
    return await this.systemDictTypeService.update(dto)
  }

  @ApiOperation({ summary: '导出字典类型' })
  @ApiOkResponse({
    description: '请求成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_EXPORT)
  @Post('export')
  async export(@Body() dto: FindSystemDictTypePageReqDto) {
    const { data } = await this.systemDictTypeService.findPage(dto)
    return this.excelService.exportFile(ExportSystemDictTypeSerDto, data)
  }
}
