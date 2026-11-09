import type { StoredUpload } from '@nestjs/storage'
import { extname } from 'node:path'
import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-node'
import { StorageDisk, uploadToDisk } from '@nestjs/storage'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { XltIgnore } from '@xlt-token/nestjs'
import { SysLangEntityDto } from '~db/dtos'
import { ExcelService } from '~nestjs-modules/excel'
import { localDisk } from '~server/configs'
import { ApiDoc } from '~server/decorators'
import { RemoveReqDto } from '~server/dtos'
import { composeContentTypeDetectors, detectXlsxContentType, XLSX_CONTENT_TYPE } from '~server/validators'
import { generateId } from '~shared/utils'
import { CreateSystemLangReqDto, FindSystemLangAllReqDto, FindSystemLangOneReqDto, FindSystemLangPageReqDto, ImportSystemLangResDto, ImportSystemLangSerDto, TranslateSystemLangReqDto, UpdateSystemLangReqDto } from './lang.dto'
import { SystemLangService } from './lang.service'

@ApiTags('系统语言接口')
@ApiBearerAuth()
@Controller()
export class SystemLangController {
  constructor(
    private systemLangService: SystemLangService,
    private excelService: ExcelService,
    private disk: StorageDisk,
  ) {}

  @ApiDoc({ endpointSummary: '创建系统语言' })
  @Post('create')
  async create(@Body() dto: CreateSystemLangReqDto) {
    await this.systemLangService.create(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统语言', responseDto: Object })
  @XltIgnore()
  @Get('findAll')
  async findAll(@Query() dto: FindSystemLangAllReqDto) {
    return await this.systemLangService.findAll(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统语言词条', responseDto: SysLangEntityDto })
  @Get('findByKey')
  async findByKey(@Query() dto: FindSystemLangOneReqDto) {
    return await this.systemLangService.findByKey(dto)
  }

  @ApiDoc({ endpointSummary: '查询系统语言词条分页', responseDto: SysLangEntityDto, isPage: true })
  @Post('findPage')
  async findPage(@Body() dto: FindSystemLangPageReqDto) {
    return await this.systemLangService.findPage(dto)
  }

  @ApiDoc({ endpointSummary: '删除系统语言词条' })
  @Post('remove')
  async remove(@Body() dto: RemoveReqDto) {
    await this.systemLangService.remove(dto)
  }

  @ApiDoc({ endpointSummary: '更新系统语言词条' })
  @Post('update')
  async update(@Body() dto: UpdateSystemLangReqDto) {
    await this.systemLangService.update(dto)
  }

  @ApiDoc({ endpointSummary: '翻译系统语言词条', responseDto: Object })
  @Post('translate')
  async translate(@Body() dto: TranslateSystemLangReqDto) {
    return await this.systemLangService.translate(dto)
  }

  @ApiDoc({ endpointSummary: '导出系统语言导入模板', isExcel: true })
  @Post('exportTemplate')
  async exportTemplate() {
    return this.excelService.exportFile(ImportSystemLangSerDto, [])
  }

  @ApiDoc({ endpointSummary: '导入系统语言', responseDto: ImportSystemLangResDto, isUpload: true })
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
      const data = await this.excelService.importFile(ImportSystemLangSerDto, body)
      return await this.systemLangService.importTemplate(data)
    }
    finally {
      body.destroy()
      // 处理完成后删除临时文件
      await this.disk.delete(file.key)
    }
  }
}
