import { z } from 'zod'
import { sysConfigEntitySchema } from '~shared/dtos/for-db'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~shared/dtos/zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, lazySchema } from '~shared/utils'

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findSystemConfigByKeyReqSchema = lazySchema(() => z.object({
  configKey: requiredText('参数键名不能为空').describe('参数键名'),
}))

export type FindSystemConfigByKeyReqDto = z.infer<ReturnType<typeof findSystemConfigByKeyReqSchema>>

export const findSystemConfigPageReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  configName: optionalText().describe('参数名称'),
  configKey: optionalText().describe('参数标识'),
  isBuiltin: optionalEnumOf(YesOrNoEnumValues, '内置参数枚举值不正确').describe('是否内置参数'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}), { id: 'FindSystemConfigPageReqDto' }))

export type FindSystemConfigPageReqDto = z.infer<ReturnType<typeof findSystemConfigPageReqSchema>>

export const findSystemConfigPageResSchema = lazySchema(() => pageResSchema('FindSystemConfigPageResDto', sysConfigEntitySchema()))

export type FindSystemConfigPageResDto = z.infer<ReturnType<typeof findSystemConfigPageResSchema>>

export const createSystemConfigReqSchema = lazySchema(() => defineSchema(z.object({
  configName: requiredText('参数名称不能为空').describe('参数名称'),
  configKey: requiredText('参数标识不能为空').describe('参数标识'),
  configValue: requiredText('参数键值不能为空').describe('参数键值'),
  isBuiltin: optionalEnumOf(YesOrNoEnumValues, '内置参数枚举值不正确').describe('是否内置参数'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemConfigReqDto' }))

export type CreateSystemConfigReqDto = z.infer<ReturnType<typeof createSystemConfigReqSchema>>

export const updateSystemConfigReqSchema = lazySchema(() => defineSchema(createSystemConfigReqSchema().extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemConfigReqDto' }))

export type UpdateSystemConfigReqDto = z.infer<ReturnType<typeof updateSystemConfigReqSchema>>
