import { z } from 'zod'
import { sysConfigEntitySchema } from '~db/dtos'
import { defineExcel } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumLabelField } from '~shared/utils'

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findSystemConfigByKeyReqSchema = z.object({
  configKey: requiredText('参数键名不能为空').describe('参数键名'),
})

export type FindSystemConfigByKeyReqDto = z.infer<typeof findSystemConfigByKeyReqSchema>

export const findSystemConfigPageReqSchema = defineSchema(pageReqSchema.extend({
  configName: optionalText().describe('参数名称'),
  configKey: optionalText().describe('参数标识'),
  isBuiltin: optionalEnumOf(YesOrNoEnumValues, '内置参数枚举值不正确').describe('是否内置参数'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}), { id: 'FindSystemConfigPageReqDto' })

export type FindSystemConfigPageReqDto = z.infer<typeof findSystemConfigPageReqSchema>

export const findSystemConfigPageResSchema = pageResSchema('FindSystemConfigPageResDto', sysConfigEntitySchema)

export type FindSystemConfigPageResDto = z.infer<typeof findSystemConfigPageResSchema>

export const createSystemConfigReqSchema = defineSchema(z.object({
  configName: requiredText('参数名称不能为空').describe('参数名称'),
  configKey: requiredText('参数标识不能为空').describe('参数标识'),
  configValue: requiredText('参数键值不能为空').describe('参数键值'),
  isBuiltin: optionalEnumOf(YesOrNoEnumValues, '内置参数枚举值不正确').describe('是否内置参数'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemConfigReqDto' })

export type CreateSystemConfigReqDto = z.infer<typeof createSystemConfigReqSchema>

export const updateSystemConfigReqSchema = defineSchema(createSystemConfigReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemConfigReqDto' })

export type UpdateSystemConfigReqDto = z.infer<typeof updateSystemConfigReqSchema>

export const exportSystemConfigExcel = defineExcel({
  fileName: '系统配置.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    configName: z.string().describe('参数名称'),
    configKey: z.string().describe('参数标识'),
    configValue: z.string().describe('参数键值'),
    isBuiltin: enumLabelField(YesOrNoEnum).describe('是否内置参数'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
})
