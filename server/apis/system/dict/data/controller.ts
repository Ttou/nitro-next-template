import type { RemoveReqDto } from '~server/openapi'
import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { Operate } from '~server/decorators'
import { ApiDoc, SysDictDataEntityDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { CreateSystemDictDataReqDto, ExportSystemDictDataSerDto, FindSystemDictDataListReqDto, UpdateSystemDictDataReqDto } from './dto'
import { SystemDictDataService } from './service'

@ApiTags('字典数据接口')
@ApiBearerAuth()
@Controller()
export class SystemDictDataController {
  constructor(
    private systemDictDataService: SystemDictDataService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建字典数据' })
  @XltCheckPermission('sys.menu.system.dictData.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemDictDataReqDto) {
    await this.systemDictDataService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询字典数据列表', responseDto: SysDictDataEntityDto, isArray: true })
  @XltCheckPermission('sys.menu.system.dictData.findList')
  @Operate({ ignoreResponse: true })
  @Post('findList')
  async findList(@Body() dto: FindSystemDictDataListReqDto) {
    return await this.systemDictDataService.findList(dto)
  }

  @ApiDoc({ endpointSummary: '删除字典数据' })
  @XltCheckPermission('sys.menu.system.dictData.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemDictDataService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新字典数据' })
  @XltCheckPermission('sys.menu.system.dictData.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemDictDataReqDto) {
    return await this.systemDictDataService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出字典数据', isExcel: true })
  @XltCheckPermission('sys.menu.system.dictData.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemDictDataListReqDto) {
    const data = await this.systemDictDataService.findList(dto)
    return this.excelService.exportFile(ExportSystemDictDataSerDto, data)
  }
}
