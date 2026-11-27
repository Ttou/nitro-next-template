import { z } from 'zod'
import { sysRoleEntityExcludeRelationSchema, sysUserEntityNoPasswordSchema } from '~shared/dtos/for-db'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { optionalText, uuid, uuidArray } from '~shared/dtos/zod'
import { defineSchema, lazySchema } from '~shared/utils'

export const findAllocatedUserPageForRoleReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  id: uuid('ID格式不正确').describe('角色ID'),
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
}), { id: 'FindAllocatedUserPageForRoleReqDto' }))

export type FindAllocatedUserPageForRoleReqDto = z.infer<ReturnType<typeof findAllocatedUserPageForRoleReqSchema>>

export const findUnallocatedUserPageForRoleReqSchema = lazySchema(() => defineSchema(findAllocatedUserPageForRoleReqSchema(), { id: 'FindUnallocatedUserPageForRoleReqDto' }))

export type FindUnallocatedUserPageForRoleReqDto = z.infer<ReturnType<typeof findUnallocatedUserPageForRoleReqSchema>>

export const allocateUserForRoleReqSchema = lazySchema(() => defineSchema(z.object({
  id: uuid('ID格式不正确').describe('角色ID'),
  ids: uuidArray('ID格式不正确', 'ID数组不能为空').describe('用户ID数组'),
}), { id: 'AllocateUserForRoleReqDto' }))

export type AllocateUserForRoleReqDto = z.infer<ReturnType<typeof allocateUserForRoleReqSchema>>

export const unallocateUserForRoleReqSchema = lazySchema(() => defineSchema(allocateUserForRoleReqSchema(), { id: 'UnallocateUserForRoleReqDto' }))

export type UnallocateUserForRoleReqDto = z.infer<ReturnType<typeof unallocateUserForRoleReqSchema>>

/**
 * 带角色的用户分页项
 */
export const sysUserEntityWithRolesResSchema = lazySchema(() => defineSchema(sysUserEntityNoPasswordSchema().extend({
  roles: z.array(sysRoleEntityExcludeRelationSchema()).describe('角色列表'),
}), { id: 'SysUserEntityWithRolesDto' }))

export type SysUserEntityWithRolesDto = z.infer<ReturnType<typeof sysUserEntityWithRolesResSchema>>

export const findAllocatedUserPageForRoleResSchema = lazySchema(() => pageResSchema('FindAllocatedUserPageForRoleResDto', sysUserEntityWithRolesResSchema()))

export type FindAllocatedUserPageForRoleResDto = z.infer<ReturnType<typeof findAllocatedUserPageForRoleResSchema>>

export const findUnallocatedUserPageForRoleResSchema = lazySchema(() => pageResSchema('FindUnallocatedUserPageForRoleResDto', sysUserEntityWithRolesResSchema()))

export type FindUnallocatedUserPageForRoleResDto = z.infer<ReturnType<typeof findUnallocatedUserPageForRoleResSchema>>
