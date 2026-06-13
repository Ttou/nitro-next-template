import { Body, Controller, Delete, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { FormDataRequest } from 'nestjs-form-data'
import { CustomStoredFile } from '~server/customs'
import { Operate } from '~server/decorators'
import { ApiDoc, RemoveReqDto } from '~server/openapi'
import { ExcelService } from '~server/shared'
import { CreateSystemUserReqDto, ExportSystemUserSerDto, FindSystemUserPageReqDto, ImportSystemUserReqDto, ImportSystemUserResDto, ImportSystemUserSerDto, SysUserEntityNoRelationsNoPasswordDto, UpdateSystemUserReqDto } from './dto'
import { SystemUserService } from './service'

@ApiTags('系统用户接口')
@ApiBearerAuth()
@Controller()
export class SystemUserController {
  constructor(
    private systemUserService: SystemUserService,
    private excelService: ExcelService,
  ) {}

  @ApiDoc({ endpointSummary: '创建系统用户' })
  @XltCheckPermission('sys.menu.system.user.create')
  @Operate()
  @Post('create')
  async create(@Body() dto: CreateSystemUserReqDto) {
    return await this.systemUserService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统用户分页列表', responseDto: SysUserEntityNoRelationsNoPasswordDto, isPage: true })
  @XltCheckPermission('sys.menu.system.user.findPage')
  @Operate({ ignoreResponse: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemUserPageReqDto) {
    return await this.systemUserService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除系统用户' })
  @XltCheckPermission('sys.menu.system.user.remove')
  @Operate()
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemUserService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新系统用户' })
  @XltCheckPermission('sys.menu.system.user.update')
  @Operate()
  @Post('update')
  async update(@Body() dto: UpdateSystemUserReqDto) {
    return await this.systemUserService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出系统用户', isExcel: true })
  @XltCheckPermission('sys.menu.system.user.export')
  @Operate({ ignoreResponse: true })
  @Post('export')
  async export(@Body() dto: FindSystemUserPageReqDto) {
    const { data } = await this.systemUserService.findPage(dto)
    return this.excelService.exportFile(ExportSystemUserSerDto, data)
  }

  @ApiDoc({ endpointSummary: '导出系统用户导入模板', isExcel: true })
  @Operate({ ignoreResponse: true })
  @Post('exportTemplate')
  async exportTemplate() {
    return this.excelService.exportFile(ImportSystemUserSerDto, [])
  }

  @ApiDoc({ endpointSummary: '导入系统用户', responseDto: ImportSystemUserResDto, isUpload: true })
  @Operate({ ignoreRequest: true })
  @FormDataRequest({ storage: CustomStoredFile })
  @Post('importTemplate')
  async importTemplate(@Body() dto: ImportSystemUserReqDto) {
    const data = await this.excelService.importFile(ImportSystemUserSerDto, dto.file)
    return await this.systemUserService.importTemplate(data)
  }
}
