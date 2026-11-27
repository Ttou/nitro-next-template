import type { StoredUpload } from '@nestjs/storage'
import type { StorageUploadResDto } from '~shared/dtos'
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-node'
import { uploadToDisk } from '@nestjs/storage'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { s3Disk } from '~server/configs'
import { storageUploadResSchema } from '~shared/dtos'
import { generateId } from '~shared/utils'

/** 允许上传的图片类型，按文件头识别，不信任客户端声明的类型 */
const IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
]

@ApiTags('存储接口')
@ApiBearerAuth()
@Controller()
export class StorageController {
  @ApiOperation({ summary: '上传图片' })
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
  @ApiOkResponse({
    description: '请求成功',
    standardSchema: storageUploadResSchema(),
  })
  @UseInterceptors(FileInterceptor('file', {
    defParamCharset: 'utf8',
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    storage: uploadToDisk({
      // nitro 托管请求无法命中按 server 实例建立的磁盘注册表，直接传入磁盘实例
      disk: s3Disk,
      contentTypes: IMAGE_CONTENT_TYPES,
      // 扩展名取自文件头检测结果，不信任文件名
      key: ({ extension }) => `public/avatars/${generateId()}${extension}`,
    }),
  }))
  @Post('upload')
  async upload(@UploadedFile() file?: StoredUpload): Promise<StorageUploadResDto> {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件')
    }

    return {
      key: file.key,
      url: s3Disk.url(file.key),
    }
  }
}
