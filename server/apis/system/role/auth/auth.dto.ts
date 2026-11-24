import { z } from 'zod'
import { sysRoleEntityExcludeRelationSchema, sysUserEntityNoPasswordSchema } from '~db/dtos'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { optionalText, uuid, uuidArray } from '~server/dtos/zod'

export const findAllocatedUserPageForRoleReqSchema = pageReqSchema.extend({
  id: uuid('ID格式不正确').describe('角色ID'),
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
}).meta({ id: 'FindAllocatedUserPageForRoleReqDto' })

export type FindAllocatedUserPageForRoleReqDto = z.infer<typeof findAllocatedUserPageForRoleReqSchema>

export const findUnallocatedUserPageForRoleReqSchema = findAllocatedUserPageForRoleReqSchema.meta({ id: 'FindUnallocatedUserPageForRoleReqDto' })

export type FindUnallocatedUserPageForRoleReqDto = z.infer<typeof findUnallocatedUserPageForRoleReqSchema>

export const allocateUserForRoleReqSchema = z.object({
  id: uuid('ID格式不正确').describe('角色ID'),
  ids: uuidArray('ID格式不正确', 'ID数组不能为空').describe('用户ID数组'),
}).meta({ id: 'AllocateUserForRoleReqDto' })

export type AllocateUserForRoleReqDto = z.infer<typeof allocateUserForRoleReqSchema>

export const unallocateUserForRoleReqSchema = allocateUserForRoleReqSchema.meta({ id: 'UnallocateUserForRoleReqDto' })

export type UnallocateUserForRoleReqDto = z.infer<typeof unallocateUserForRoleReqSchema>

/**
 * 带角色的用户分页项
 */
export const sysUserEntityWithRolesResSchema = sysUserEntityNoPasswordSchema.extend({
  roles: z.array(sysRoleEntityExcludeRelationSchema).describe('角色列表'),
}).meta({ id: 'SysUserEntityWithRolesDto' })

export type SysUserEntityWithRolesDto = z.infer<typeof sysUserEntityWithRolesResSchema>

export const findAllocatedUserPageForRoleResSchema = pageResSchema('FindAllocatedUserPageForRoleResDto', sysUserEntityWithRolesResSchema)

export type FindAllocatedUserPageForRoleResDto = z.infer<typeof findAllocatedUserPageForRoleResSchema>

export const findUnallocatedUserPageForRoleResSchema = pageResSchema('FindUnallocatedUserPageForRoleResDto', sysUserEntityWithRolesResSchema)

export type FindUnallocatedUserPageForRoleResDto = z.infer<typeof findUnallocatedUserPageForRoleResSchema>
