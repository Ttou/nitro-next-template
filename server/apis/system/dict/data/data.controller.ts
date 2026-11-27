import type { CreateSystemDictDataReqDto, FindSystemDictDataListReqDto, RemoveReqDto, UpdateSystemDictDataReqDto } from '~shared/dtos'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { createSystemDictDataReqSchema, exportSystemDictDataExcel, findSystemDictDataListReqSchema, removeReqSchema, sysDictDataEntitySchema, updateSystemDictDataReqSchema } from '~shared/dtos'
import { PermissionEnum } from '~shared/enums'
import { SystemDictDataService } from './data.service'

@ApiTags('字典数据接口')
@ApiBearerAuth()
@Controller()
export class SystemDictDataController {
  constructor(
    private systemDictDataService: SystemDictDataService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建字典数据' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_CREATE)
  @Post('create')
  async create(@Body({
    schema: createSystemDictDataReqSchema(),
  }) dto: CreateSystemDictDataReqDto,
  ) {
    await this.systemDictDataService.create(dto)
  }

  @ApiOperation({ summary: '查询字典数据列表' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: sysDictDataEntitySchema(),
    isArray: true,
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_FIND_LIST)
  @Post('findList')
  async findList(@Body({
    schema: findSystemDictDataListReqSchema(),
  }) dto: FindSystemDictDataListReqDto,
  ) {
    return await this.systemDictDataService.findList(dto)
  }

  @ApiOperation({ summary: '删除字典数据' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_REMOVE)
  @Delete('remove')
  async remove(@Body({
    schema: removeReqSchema(),
  }) dto: RemoveReqDto,
  ) {
    return await this.systemDictDataService.remove(dto)
  }

  @ApiOperation({ summary: '更新字典数据' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_UPDATE)
  @Post('update')
  async update(@Body({
    schema: updateSystemDictDataReqSchema(),
  }) dto: UpdateSystemDictDataReqDto,
  ) {
    return await this.systemDictDataService.update(dto)
  }

  @ApiOperation({ summary: '导出字典数据' })
  @ApiOkResponse({
    description: '请求成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_EXPORT)
  @Post('export')
  async export(@Body({
    schema: findSystemDictDataListReqSchema(),
  }) dto: FindSystemDictDataListReqDto,
  ) {
    const data = await this.systemDictDataService.findList(dto)
    return this.excelService.exportFile(exportSystemDictDataExcel(), data)
  }
}
