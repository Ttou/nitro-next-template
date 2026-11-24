import { z } from 'zod'
import { uuid, uuidArray } from '~server/dtos/zod'

export const assignMenuForRoleReqSchema = z.object({
  id: uuid('ID格式不正确').describe('角色ID'),
  menuIds: uuidArray('ID格式不正确', 'ID数组不能为空').describe('菜单ID数组'),
}).meta({ id: 'AssignMenuForRoleReqDto' })

export type AssignMenuForRoleReqDto = z.infer<typeof assignMenuForRoleReqSchema>

export const findAssignedMenuForRoleReqSchema = z.object({
  id: uuid('ID格式不正确').describe('角色ID'),
}).meta({ id: 'FindAssignedMenuForRoleReqDto' })

export type FindAssignedMenuForRoleReqDto = z.infer<typeof findAssignedMenuForRoleReqSchema>
