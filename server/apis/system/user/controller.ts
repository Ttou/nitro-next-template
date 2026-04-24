import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FormDataRequest } from 'nestjs-form-data'
import { Operate, Permission } from '~server/decorators'
import { ExcelService } from '~server/extends'
import { ApiExcelResponse, ApiFile, RemoveReqDto } from '~server/openapi'
import { CustomStoredFile } from '~server/storages'
import { CreateSystemUserReqDto, ExportSystemUserSerializeDto, FindSystemUserPageReqDto, FindSystemUserPageResDto, ImportSystemUserReqDto, ImportSystemUserResDto, ImportSystemUserSerializeDto, UpdateSystemUserReqDto } from './dto'
import { SystemUserService } from './service'

@ApiTags('系统用户接口')
@ApiBearerAuth()
@Controller()
export class SystemUserController {
  constructor(
    private systemUserService: SystemUserService,
    private excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: '创建系统用户' })
  @Permission('sys.menu.system.user.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemUserReqDto) {
    return await this.systemUserService.create(dto)
  }

  @ApiOperation({ summary: '查询系统用户分页列表' })
  @ApiOkResponse({ type: FindSystemUserPageResDto })
  @Permission('sys.menu.system.user.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemUserPageReqDto) {
    return await this.systemUserService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统用户' })
  @Permission('sys.menu.system.user.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemUserService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统用户' })
  @Permission('sys.menu.system.user.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemUserReqDto) {
    return await this.systemUserService.update(dto)
  }

  @ApiOperation({ summary: '导出系统用户' })
  @ApiExcelResponse()
  @Permission('sys.menu.system.user.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemUserPageReqDto) {
    const { data } = await this.systemUserService.findPage(dto)
    return this.excelService.exportFile(ExportSystemUserSerializeDto, data)
  }

  @ApiOperation({ summary: '导出系统用户导入模板' })
  @ApiExcelResponse()
  @Operate({ ignoreResponse: true })
  @Post('exportTemplate')
  async exportTemplate() {
    return this.excelService.exportFile(ImportSystemUserSerializeDto, [])
  }

  @ApiOperation({ summary: '导入系统用户' })
  @ApiOkResponse({ type: ImportSystemUserResDto })
  @ApiFile()
  @Operate({ ignoreRequest: true })
  @FormDataRequest({ storage: CustomStoredFile })
  @Post('importTemplate')
  async importTemplate(@Body() dto: ImportSystemUserReqDto) {
    const data = await this.excelService.importFile(ImportSystemUserSerializeDto, dto.file)
    return await this.systemUserService.importTemplate(data)
  }
}
