import { z } from 'zod'
import { enumOf, uuid } from '~shared/dtos/zod'
import { StorageBizEnum, StorageBizEnumValues, StorageVisibilityEnumValues } from '~shared/enums'
import { defineSchema, lazySchema } from '~shared/utils'

/**
 * 上传文件查询参数
 *
 * 不加 `defineSchema`：查询参数需要内联的 object schema 才能展开成逐个 query 参数
 */
export const storageUploadQuerySchema = lazySchema(() => z.object({
  visibility: enumOf(StorageVisibilityEnumValues, '可见性参数不正确')
    .default('private')
    .describe('可见性，公开文件直连访问，私密文件需换取签名地址'),
  biz: enumOf(StorageBizEnumValues, '业务类型不正确')
    .default(StorageBizEnum.AVATAR)
    .describe('业务类型，作为对象键的二级前缀'),
}))

export type StorageUploadQueryDto = z.infer<ReturnType<typeof storageUploadQuerySchema>>

/**
 * 上传文件响应传输对象
 */
export const storageUploadResSchema = lazySchema(() => defineSchema(z.object({
  id: z.string().describe('文件记录 ID'),
  key: z.string().describe('文件在存储中的路径'),
  visibility: enumOf(StorageVisibilityEnumValues, '可见性参数不正确').describe('可见性'),
  url: z.string().nullable().describe('公开文件的直连地址，私密文件为 null'),
}), { id: 'StorageUploadResDto' }))

export type StorageUploadResDto = z.infer<ReturnType<typeof storageUploadResSchema>>

/**
 * 获取文件访问地址请求参数
 */
export const storageFileUrlReqSchema = lazySchema(() => z.object({
  id: uuid('文件 ID 格式不正确').describe('文件记录 ID'),
}))

export type StorageFileUrlReqDto = z.infer<ReturnType<typeof storageFileUrlReqSchema>>

/**
 * 文件访问地址响应传输对象
 */
export const storageFileUrlResSchema = lazySchema(() => defineSchema(z.object({
  url: z.string().describe('文件访问地址'),
  expiresIn: z.number().int().nullable().describe('地址有效期（秒），公开文件为 null'),
}), { id: 'StorageFileUrlResDto' }))

export type StorageFileUrlResDto = z.infer<ReturnType<typeof storageFileUrlResSchema>>
