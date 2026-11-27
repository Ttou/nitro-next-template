import { z } from 'zod'
import { sysPostEntityExcludeRelationSchema, sysUserEntityNoPasswordSchema } from '~shared/dtos/for-db'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { optionalText, uuid, uuidArray } from '~shared/dtos/zod'
import { defineSchema, lazySchema } from '~shared/utils'

export const findAllocatedUserPageForPostReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  id: uuid('ID格式不正确').describe('岗位ID'),
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
}), { id: 'FindAllocatedUserPageForPostReqDto' }))

export type FindAllocatedUserPageForPostReqDto = z.infer<ReturnType<typeof findAllocatedUserPageForPostReqSchema>>

export const findUnallocatedUserPageForPostReqSchema = lazySchema(() => defineSchema(findAllocatedUserPageForPostReqSchema(), { id: 'FindUnallocatedUserPageForPostReqDto' }))

export type FindUnallocatedUserPageForPostReqDto = z.infer<ReturnType<typeof findUnallocatedUserPageForPostReqSchema>>

export const allocateUserForPostReqSchema = lazySchema(() => defineSchema(z.object({
  id: uuid('ID格式不正确').describe('岗位ID'),
  ids: uuidArray('ID格式不正确', 'ID数组不能为空').describe('用户ID数组'),
}), { id: 'AllocateUserForPostReqDto' }))

export type AllocateUserForPostReqDto = z.infer<ReturnType<typeof allocateUserForPostReqSchema>>

export const unallocateUserForPostReqSchema = lazySchema(() => defineSchema(allocateUserForPostReqSchema(), { id: 'UnallocateUserForPostReqDto' }))

export type UnallocateUserForPostReqDto = z.infer<ReturnType<typeof unallocateUserForPostReqSchema>>

/**
 * 带岗位的用户分页项
 */
export const sysUserEntityWithPostsResSchema = lazySchema(() => defineSchema(sysUserEntityNoPasswordSchema().extend({
  posts: z.array(sysPostEntityExcludeRelationSchema()).describe('岗位列表'),
}), { id: 'SysUserEntityWithPostsDto' }))

export type SysUserEntityWithPostsDto = z.infer<ReturnType<typeof sysUserEntityWithPostsResSchema>>

export const findAllocatedUserPageForPostResSchema = lazySchema(() => pageResSchema('FindAllocatedUserPageForPostResDto', sysUserEntityWithPostsResSchema()))

export type FindAllocatedUserPageForPostResDto = z.infer<ReturnType<typeof findAllocatedUserPageForPostResSchema>>

export const findUnallocatedUserPageForPostResSchema = lazySchema(() => pageResSchema('FindUnallocatedUserPageForPostResDto', sysUserEntityWithPostsResSchema()))

export type FindUnallocatedUserPageForPostResDto = z.infer<ReturnType<typeof findUnallocatedUserPageForPostResSchema>>
