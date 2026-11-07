import type { StoredUpload } from '@nestjs/storage'
import { extname } from 'node:path'
import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-node'
import { StorageDisk, uploadToDisk } from '@nestjs/storage'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { localDisk } from '~server/configs'
import { ApiDoc, RemoveReqDto } from '~server/openapi'
import { composeContentTypeDetectors, detectXlsxContentType, XLSX_CONTENT_TYPE } from '~server/validators'
import { generateId } from '~shared/utils'
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
    private disk: StorageDisk,
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
  @UseInterceptors(FileInterceptor('file', {
    // busboy 默认按 latin1 解析文件名，会导致中文乱码
    defParamCharset: 'utf8',
    // 限制上传文件大小为 10MB，最多上传 1 个文件
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    storage: uploadToDisk({
      // nitro 托管请求无法命中按 server 实例建立的磁盘注册表，直接传入磁盘实例
      disk: localDisk,
      // 仅允许上传 xlsx，检测逻辑见 validators/upload-content-type
      contentTypes: [XLSX_CONTENT_TYPE],
      contentTypeSampleBytes: 64 * 1024,
      detectContentType: composeContentTypeDetectors(detectXlsxContentType),
      // 保留原文件后缀
      key: file => `${generateId()}${extname(file.originalname)}`,
    }),
  }))
  @Post('importTemplate')
  async importTemplate(@UploadedFile() file: StoredUpload) {
    const { body } = await this.disk.get(file.key)

    try {
      const data = await this.excelService.importFile(ImportSystemUserSerDto, body)
      return await this.systemUserService.importTemplate(data)
    }
    finally {
      body.destroy()
      // 处理完成后删除临时文件
      await this.disk.delete(file.key)
    }
  }
}
