import type { RemoveReqDto } from '~server/dtos'
import type { CreateSystemDictTypeReqDto, FindSystemDictDetailByKeyReqDto, FindSystemDictTypePageReqDto, UpdateSystemDictTypeReqDto } from './type.dto'
import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { CacheInterceptor, CacheKey, CacheTTL } from '~nestjs-modules/cache'
import { ExcelService } from '~nestjs-modules/excel'
import { removeReqSchema, sysDictDataEntitySchema } from '~server/dtos'
import { PermissionEnum } from '~shared/enums'
import { createSystemDictTypeReqSchema, exportSystemDictTypeExcel, findSystemDictDetailByKeyReqSchema, findSystemDictTypePageReqSchema, findSystemDictTypePageResSchema, updateSystemDictTypeReqSchema } from './type.dto'
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
  async create(@Body({ schema: createSystemDictTypeReqSchema }) dto: CreateSystemDictTypeReqDto) {
    await this.systemDictTypeService.create(dto)
  }

  @ApiOperation({ summary: '根据字典类型查询字典数据' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: sysDictDataEntitySchema,
    isArray: true,
  })
  @CacheKey(ctx => `sys_dict:${ctx.switchToHttp().getRequest().query.dictType}`)
  @CacheTTL('1d')
  @UseInterceptors(CacheInterceptor)
  @Get('findByKey')
  async findByKey(@Query({ schema: findSystemDictDetailByKeyReqSchema }) dto: FindSystemDictDetailByKeyReqDto) {
    return await this.systemDictTypeService.findByKey(dto)
  }

  @ApiOperation({ summary: '查询字典类型分页列表' })
  @ApiOkResponse({ description: '请求成功', standardSchema: findSystemDictTypePageResSchema })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body({ schema: findSystemDictTypePageReqSchema }) dto: FindSystemDictTypePageReqDto) {
    return await this.systemDictTypeService.findPage(dto)
  }

  @ApiOperation({ summary: '删除字典类型' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_REMOVE)
  @Delete('remove')
  async remove(@Body({ schema: removeReqSchema }) dto: RemoveReqDto) {
    return await this.systemDictTypeService.remove(dto)
  }

  @ApiOperation({ summary: '更新字典类型' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_TYPE_UPDATE)
  @Post('update')
  async update(@Body({ schema: updateSystemDictTypeReqSchema }) dto: UpdateSystemDictTypeReqDto) {
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
  async export(@Body({ schema: findSystemDictTypePageReqSchema }) dto: FindSystemDictTypePageReqDto) {
    const { data } = await this.systemDictTypeService.findPage(dto)
    return this.excelService.exportFile(exportSystemDictTypeExcel, data)
  }
}
