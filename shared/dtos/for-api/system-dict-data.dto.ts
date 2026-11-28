import { z } from 'zod'
import { optionalEnumOf, optionalText, requiredText, uuid } from '~shared/dtos/zod'
import { YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, lazySchema } from '~shared/utils'

export const findSystemDictDataListReqSchema = lazySchema(() => defineSchema(z.object({
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  dictLabel: optionalText().describe('字典标签'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}), { id: 'FindSystemDictDataListReqDto' }))

export type FindSystemDictDataListReqDto = z.infer<ReturnType<typeof findSystemDictDataListReqSchema>>

export const createSystemDictDataReqSchema = lazySchema(() => defineSchema(z.object({
  dictLabel: requiredText('字典标签不能为空').describe('字典标签'),
  dictValue: requiredText('字典值不能为空').describe('字典值'),
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemDictDataReqDto' }))

export type CreateSystemDictDataReqDto = z.infer<ReturnType<typeof createSystemDictDataReqSchema>>

export const updateSystemDictDataReqSchema = lazySchema(() => defineSchema(createSystemDictDataReqSchema().extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemDictDataReqDto' }))

export type UpdateSystemDictDataReqDto = z.infer<ReturnType<typeof updateSystemDictDataReqSchema>>
