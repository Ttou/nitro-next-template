import { z } from 'zod'
import { optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnumValues } from '~shared/enums'

export const findSystemDeptListReqSchema = z.object({
  deptName: optionalText().describe('部门名称'),
  deptKey: optionalText().describe('部门标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
}).meta({ id: 'FindSystemDeptListReqDto' })

export type FindSystemDeptListReqDto = z.infer<typeof findSystemDeptListReqSchema>

export const createSystemDeptReqSchema = z.object({
  parentId: uuid('父部门ID格式不正确').nullish().transform(value => value ?? undefined).describe('父部门ID'),
  deptName: requiredText('部门名称不能为空').describe('部门名称'),
  deptKey: requiredText('部门标识不能为空').describe('部门标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
  remark: optionalText().describe('备注'),
}).meta({ id: 'CreateSystemDeptReqDto' })

export type CreateSystemDeptReqDto = z.infer<typeof createSystemDeptReqSchema>

export const updateSystemDeptReqSchema = createSystemDeptReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}).meta({ id: 'UpdateSystemDeptReqDto' })

export type UpdateSystemDeptReqDto = z.infer<typeof updateSystemDeptReqSchema>
