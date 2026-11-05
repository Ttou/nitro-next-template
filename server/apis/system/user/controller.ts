import type { IUploadedFile } from '~server/interfaces'
import { BadRequestException, Body, Controller, Delete, FileTypeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-node'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { ApiDoc, RemoveReqDto } from '~server/openapi'
import {
  CreateSystemUserReqDto,
  ExportSystemUserSerDto,
  FindSystemUserPageReqDto,
  ImportSystemUserResDto,
  ImportSystemUserSerDto,
  SysUserEntityNoRelationsNoPasswordDto,
  UpdateSystemUserReqDto,
} from './dto'
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
  @Post('create')
  async create(@Body() dto: CreateSystemUserReqDto) {
    return await this.systemUserService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统用户分页列表', responseDto: SysUserEntityNoRelationsNoPasswordDto, isPage: true })
  @XltCheckPermission('sys.menu.system.user.findPage')
  @Post('findPage')
  async findPage(@Body() dto: FindSystemUserPageReqDto) {
    return await this.systemUserService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除系统用户' })
  @XltCheckPermission('sys.menu.system.user.remove')
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemUserService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新系统用户' })
  @XltCheckPermission('sys.menu.system.user.update')
  @Post('update')
  async update(@Body() dto: UpdateSystemUserReqDto) {
    return await this.systemUserService.update(dto)
  }

  @ApiDoc({ endpointSummary: '导出系统用户', isExcel: true })
  @XltCheckPermission('sys.menu.system.user.export')
  @Post('export')
  async export(@Body() dto: FindSystemUserPageReqDto) {
    const { data } = await this.systemUserService.findPage(dto)
    return this.excelService.exportFile(ExportSystemUserSerDto, data)
  }

  @ApiDoc({ endpointSummary: '导出系统用户导入模板', isExcel: true })
  @Post('exportTemplate')
  async exportTemplate() {
    return this.excelService.exportFile(ImportSystemUserSerDto, [])
  }

  @ApiDoc({ endpointSummary: '导入系统用户', responseDto: ImportSystemUserResDto, isUpload: true })
  @UseInterceptors(FileInterceptor('file'))
  @Post('importTemplate')
  async importTemplate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            skipMagicNumbersValidation: true,
            errorMessage: '文件类型错误',
          }),
        ],
        exceptionFactory: error => new BadRequestException(error === 'File is required'
          ? '文件不能为空'
          : error),
      }),
    )
    file: IUploadedFile,
  ) {
    const data = await this.excelService.importFile(ImportSystemUserSerDto, file.path)
    return await this.systemUserService.importTemplate(data)
  }
}
