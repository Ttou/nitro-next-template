import type { StoredUpload } from '@nestjs/storage'
import { extname } from 'node:path'
import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-node'
import { StorageDisk, uploadToDisk } from '@nestjs/storage'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { XltCheckPermission } from '@xlt-token/nestjs'
import { ExcelService } from '~nestjs-modules/excel'
import { localDisk } from '~server/configs'
import { RemoveReqDto } from '~server/dtos'
import { composeContentTypeDetectors, detectXlsxContentType, XLSX_CONTENT_TYPE } from '~server/validators'
import { PermissionEnum } from '~shared/enums'
import { generateId } from '~shared/utils'
import {
  CreateSystemUserReqDto,
  ExportSystemUserSerDto,
  FindSystemUserPageReqDto,
  FindSystemUserPageResDto,
  ImportSystemUserResDto,
  ImportSystemUserSerDto,
  UpdateSystemUserReqDto,
} from './user.dto'
import { SystemUserService } from './user.service'

@ApiTags('系统用户接口')
@ApiBearerAuth()
@Controller()
export class SystemUserController {
  constructor(
    private systemUserService: SystemUserService,
    private excelService: ExcelService,
    private disk: StorageDisk,
  ) {}

  @ApiOperation({ summary: '创建系统用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_USER_CREATE)
  @Post('create')
  async create(@Body() dto: CreateSystemUserReqDto) {
    return await this.systemUserService.create(dto)
  }

  @ApiOperation({ summary: '查询系统用户分页列表' })
  @ApiOkResponse({ description: '请求成功', type: FindSystemUserPageResDto })
  @XltCheckPermission(PermissionEnum.SYSTEM_USER_FIND_PAGE)
  @Post('findPage')
  async findPage(@Body() dto: FindSystemUserPageReqDto) {
    return await this.systemUserService.findPage(dto)
  }

  @ApiOperation({ summary: '删除系统用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_USER_REMOVE)
  @Delete('remove')
  async remove(@Body() dto: RemoveReqDto) {
    return await this.systemUserService.remove(dto)
  }

  @ApiOperation({ summary: '更新系统用户' })
  @ApiOkResponse({ description: '请求成功' })
  @XltCheckPermission(PermissionEnum.SYSTEM_USER_UPDATE)
  @Post('update')
  async update(@Body() dto: UpdateSystemUserReqDto) {
    return await this.systemUserService.update(dto)
  }

  @ApiOperation({ summary: '导出系统用户' })
  @ApiOkResponse({
    description: '请求成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @XltCheckPermission(PermissionEnum.SYSTEM_USER_EXPORT)
  @Post('export')
  async export(@Body() dto: FindSystemUserPageReqDto) {
    const { data } = await this.systemUserService.findPage(dto)
    return this.excelService.exportFile(ExportSystemUserSerDto, data)
  }

  @ApiOperation({ summary: '导出系统用户导入模板' })
  @ApiOkResponse({
    description: '请求成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('exportTemplate')
  async exportTemplate() {
    return this.excelService.exportFile(ImportSystemUserSerDto, [])
  }

  @ApiOperation({ summary: '导入系统用户' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: '请求成功', type: ImportSystemUserResDto })
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
