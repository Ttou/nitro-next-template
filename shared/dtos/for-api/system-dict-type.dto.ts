import { z } from 'zod'
import { sysDictDataEntitySchema, sysDictTypeEntitySchema } from '~shared/dtos/for-db'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~shared/dtos/zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, lazySchema } from '~shared/utils'

export const findSystemDictTypePageReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  dictName: optionalText().describe('字典名称'),
  dictType: optionalText().describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}), { id: 'FindSystemDictTypePageReqDto' }))

export type FindSystemDictTypePageReqDto = z.infer<ReturnType<typeof findSystemDictTypePageReqSchema>>

export const findSystemDictTypePageResSchema = lazySchema(() => pageResSchema('FindSystemDictTypePageResDto', sysDictTypeEntitySchema()))

export type FindSystemDictTypePageResDto = z.infer<ReturnType<typeof findSystemDictTypePageResSchema>>

export const createSystemDictTypeReqSchema = lazySchema(() => defineSchema(z.object({
  dictName: requiredText('字典名称不能为空').describe('字典名称'),
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemDictTypeReqDto' }))

export type CreateSystemDictTypeReqDto = z.infer<ReturnType<typeof createSystemDictTypeReqSchema>>

export const updateSystemDictTypeReqSchema = lazySchema(() => defineSchema(createSystemDictTypeReqSchema().extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemDictTypeReqDto' }))

export type UpdateSystemDictTypeReqDto = z.infer<ReturnType<typeof updateSystemDictTypeReqSchema>>

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findSystemDictDetailByKeyReqSchema = lazySchema(() => z.object({
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
}))

export type FindSystemDictDetailByKeyReqDto = z.infer<ReturnType<typeof findSystemDictDetailByKeyReqSchema>>

export const findSystemDictDetailByKeyResSchema = lazySchema(() => defineSchema(sysDictDataEntitySchema(), { id: 'FindSystemDictDetailByKeyResDto' }))

export type FindSystemDictDetailByKeyResDto = z.infer<ReturnType<typeof findSystemDictDetailByKeyResSchema>>
