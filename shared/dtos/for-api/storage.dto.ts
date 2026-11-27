import { z } from 'zod'
import { defineSchema, lazySchema } from '~shared/utils'

/**
 * 上传文件响应传输对象
 */
export const storageUploadResSchema = lazySchema(() => defineSchema(z.object({
  key: z.string().describe('文件在存储中的路径'),
  url: z.string().describe('文件访问地址'),
}), { id: 'StorageUploadResDto' }))

export type StorageUploadResDto = z.infer<ReturnType<typeof storageUploadResSchema>>
