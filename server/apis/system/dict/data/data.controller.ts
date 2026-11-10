import type { RemoveReqDto } from '~server/dtos'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { ApiDoc } from '~server/decorators'
import { SysDictDataEntityDto } from '~db/dtos'
import { PermissionEnum } from '~shared/enums'
import { CreateSystemDictDataReqDto, ExportSystemDictDataSerDto, FindSystemDictDataListReqDto, UpdateSystemDictDataReqDto } from './data.dto'
import { SystemDictDataService } from './data.service'

@ApiTags('字典数据接口')
@ApiBearerAuth()
@Controller()
export class SystemDictDataController {
  constructor(
    private systemDictDataService: SystemDictDataService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建字典数据' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_CREATE)
  @Post('create')
  async create(@Body() dto: CreateSystemDictDataReqDto) {
    await this.systemDictDataService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询字典数据列表', responseDto: SysDictDataEntityDto, isArray: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_FIND_LIST)
  @Post('findList')
  async findList(@Body() dto: FindSystemDictDataListReqDto) {
    return await this.systemDictDataService.findList(dto)
  }

  @ApiDoc({ endpointSummary: '删除字典数据' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictDataService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新字典数据' })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemDictDataReqDto) {
    return await this.systemDictDataService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出字典数据', isExcel: true })
  @XltCheckPermission(PermissionEnum.SYSTEM_DICT_DATA_EXPORT)
  @Post('export')
  async export(@Body() dto: FindSystemDictDataListReqDto) {
    const data = await this.systemDictDataService.findList(dto)
    return this.excelService.exportFile(ExportSystemDictDataSerDto, data)
  }
}
