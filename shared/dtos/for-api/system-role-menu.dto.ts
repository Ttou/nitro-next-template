import { z } from 'zod'
import { uuid, uuidArray } from '~shared/dtos/zod'
import { defineSchema, lazySchema } from '~shared/utils'

export const assignMenuForRoleReqSchema = lazySchema(() => defineSchema(z.object({
  id: uuid('ID格式不正确').describe('角色ID'),
  menuIds: uuidArray('ID格式不正确', 'ID数组不能为空').describe('菜单ID数组'),
}), { id: 'AssignMenuForRoleReqDto' }))

export type AssignMenuForRoleReqDto = z.infer<ReturnType<typeof assignMenuForRoleReqSchema>>

export const findAssignedMenuForRoleReqSchema = lazySchema(() => defineSchema(z.object({
  id: uuid('ID格式不正确').describe('角色ID'),
}), { id: 'FindAssignedMenuForRoleReqDto' }))

export type FindAssignedMenuForRoleReqDto = z.infer<ReturnType<typeof findAssignedMenuForRoleReqSchema>>
