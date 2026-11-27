import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel/excel.schema'
import { sysRoleEntityExcludeRelationSchema } from '~shared/dtos/for-db'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~shared/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumLabelField, lazySchema } from '~shared/utils'

export const findSystemRolePageReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  roleName: optionalText().describe('角色名称'),
  roleKey: optionalText().describe('角色标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}), { id: 'FindSystemRolePageReqDto' }))

export type FindSystemRolePageReqDto = z.infer<ReturnType<typeof findSystemRolePageReqSchema>>

export const findSystemRolePageResSchema = lazySchema(() => pageResSchema('FindSystemRolePageResDto', sysRoleEntityExcludeRelationSchema()))

export type FindSystemRolePageResDto = z.infer<ReturnType<typeof findSystemRolePageResSchema>>

export const createSystemRoleReqSchema = lazySchema(() => defineSchema(z.object({
  roleName: requiredText('角色名称不能为空').describe('角色名称'),
  roleKey: requiredText('角色标识不能为空').describe('角色标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemRoleReqDto' }))

export type CreateSystemRoleReqDto = z.infer<ReturnType<typeof createSystemRoleReqSchema>>

export const updateSystemRoleReqSchema = lazySchema(() => defineSchema(createSystemRoleReqSchema().extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemRoleReqDto' }))

export type UpdateSystemRoleReqDto = z.infer<ReturnType<typeof updateSystemRoleReqSchema>>

export const exportSystemRoleExcel = lazySchema(() => defineExcel({
  fileName: '系统角色.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    roleKey: z.string().describe('角色键值'),
    roleName: z.string().describe('角色名称'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
}))
