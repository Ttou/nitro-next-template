import { z } from 'zod'
import { pageReqSchema, pageResSchema, sysPostEntityExcludeRelationSchema, sysUserEntityNoPasswordSchema } from '~server/dtos'
import { optionalText, uuid, uuidArray } from '~server/dtos/zod'
import { defineSchema } from '~shared/utils'

export const findAllocatedUserPageForPostReqSchema = defineSchema(pageReqSchema.extend({
  id: uuid('ID格式不正确').describe('岗位ID'),
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
}), { id: 'FindAllocatedUserPageForPostReqDto' })

export type FindAllocatedUserPageForPostReqDto = z.infer<typeof findAllocatedUserPageForPostReqSchema>

export const findUnallocatedUserPageForPostReqSchema = defineSchema(findAllocatedUserPageForPostReqSchema, { id: 'FindUnallocatedUserPageForPostReqDto' })

export type FindUnallocatedUserPageForPostReqDto = z.infer<typeof findUnallocatedUserPageForPostReqSchema>

export const allocateUserForPostReqSchema = defineSchema(z.object({
  id: uuid('ID格式不正确').describe('岗位ID'),
  ids: uuidArray('ID格式不正确', 'ID数组不能为空').describe('用户ID数组'),
}), { id: 'AllocateUserForPostReqDto' })

export type AllocateUserForPostReqDto = z.infer<typeof allocateUserForPostReqSchema>

export const unallocateUserForPostReqSchema = defineSchema(allocateUserForPostReqSchema, { id: 'UnallocateUserForPostReqDto' })

export type UnallocateUserForPostReqDto = z.infer<typeof unallocateUserForPostReqSchema>

/**
 * 带岗位的用户分页项
 */
export const sysUserEntityWithPostsResSchema = defineSchema(sysUserEntityNoPasswordSchema.extend({
  posts: z.array(sysPostEntityExcludeRelationSchema).describe('岗位列表'),
}), { id: 'SysUserEntityWithPostsDto' })

export type SysUserEntityWithPostsDto = z.infer<typeof sysUserEntityWithPostsResSchema>

export const findAllocatedUserPageForPostResSchema = pageResSchema('FindAllocatedUserPageForPostResDto', sysUserEntityWithPostsResSchema)

export type FindAllocatedUserPageForPostResDto = z.infer<typeof findAllocatedUserPageForPostResSchema>

export const findUnallocatedUserPageForPostResSchema = pageResSchema('FindUnallocatedUserPageForPostResDto', sysUserEntityWithPostsResSchema)

export type FindUnallocatedUserPageForPostResDto = z.infer<typeof findUnallocatedUserPageForPostResSchema>
