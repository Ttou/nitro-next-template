import type { StoredUpload } from '@nestjs/storage'
import type { StorageFileUrlReqDto, StorageFileUrlResDto, StorageUploadQueryDto, StorageUploadResDto } from '~shared/dtos'
import { BadRequestException, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-node'
import { uploadToDisk } from '@nestjs/storage'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { s3Disk } from '~server/configs'
import { buildStorageKey } from '~server/constants'
import { storageFileUrlReqSchema, storageFileUrlResSchema, storageUploadQuerySchema, storageUploadResSchema } from '~shared/dtos'
import { StorageBizEnumValues, StorageVisibilityEnumValues } from '~shared/enums'
import { generateId } from '~shared/utils'
import { StorageService } from './storage.service'

/** 单文件大小上限 */
const MAX_FILE_SIZE = 20 * 1024 * 1024

/** 允许上传的类型，按文件头识别，不信任客户端声明的类型 */
const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/heic',
  'application/pdf',
  // zip 及 docx/xlsx 等基于 zip 容器的格式
  'application/zip',
]

/**
 * 在落盘前校验查询参数
 *
 * 上传拦截器先于管道执行，参数非法时文件已经写入，只能在此处提前拦截
 */
function parseUploadQuery(query: unknown): StorageUploadQueryDto {
  const result = storageUploadQuerySchema().safeParse(query)

  if (!result.success) {
    throw new BadRequestException(result.error.issues[0]?.message)
  }

  return result.data
}

@ApiTags('存储接口')
@ApiBearerAuth()
@Controller()
export class StorageController {
  constructor(
    private storageService: StorageService,
  ) {}

  @ApiOperation({ summary: '上传文件' })
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
  @ApiQuery({
    name: 'visibility',
    required: false,
    enum: StorageVisibilityEnumValues,
    description: '可见性，默认 private',
  })
  @ApiQuery({
    name: 'biz',
    required: false,
    enum: StorageBizEnumValues,
    description: '业务类型，默认 avatars',
  })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: storageUploadResSchema(),
  })
  @UseInterceptors(FileInterceptor('file', {
    defParamCharset: 'utf8',
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    storage: uploadToDisk({
      // nitro 托管请求无法命中按 server 实例建立的磁盘注册表，直接传入磁盘实例
      disk: s3Disk,
      contentTypes: ALLOWED_CONTENT_TYPES,
      // PK 头用于识别 zip 容器，其余类型由内置的文件头识别处理
      detectContentType: bytes => bytes[0] === 0x50 && bytes[1] === 0x4B
        ? 'application/zip'
        : undefined,
      // 扩展名取自文件头检测结果，不信任文件名；可见性决定是否匿名可读
      key: ({ extension }, req: { query: unknown }) => {
        const { visibility, biz } = parseUploadQuery(req.query)

        return buildStorageKey(visibility, biz, generateId(), extension)
      },
    }),
  }))
  @Post('upload')
  async upload(
    @Query({
      schema: storageUploadQuerySchema(),
    }) dto: StorageUploadQueryDto,
    @UploadedFile() file?: StoredUpload,
  ): Promise<StorageUploadResDto> {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件')
    }

    return await this.storageService.upload(file, dto)
  }

  @ApiOperation({ summary: '获取文件访问地址' })
  @ApiParam({ name: 'id', description: '文件记录 ID' })
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: storageFileUrlResSchema(),
  })
  @Get('files/:id/url')
  async getFileUrl(@Param({
    schema: storageFileUrlReqSchema(),
  }) dto: StorageFileUrlReqDto,
  ): Promise<StorageFileUrlResDto> {
    return await this.storageService.getFileUrl(dto.id)
  }
}
