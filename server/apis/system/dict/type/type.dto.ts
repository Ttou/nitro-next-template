import { z } from 'zod'
import { sysDictDataEntitySchema, sysDictTypeEntitySchema } from '~db/dtos'
import { defineExcel } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumLabelField } from '~shared/utils'

export const findSystemDictTypePageReqSchema = defineSchema(pageReqSchema.extend({
  dictName: optionalText().describe('字典名称'),
  dictType: optionalText().describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}), { id: 'FindSystemDictTypePageReqDto' })

export type FindSystemDictTypePageReqDto = z.infer<typeof findSystemDictTypePageReqSchema>

export const findSystemDictTypePageResSchema = pageResSchema('FindSystemDictTypePageResDto', sysDictTypeEntitySchema)

export type FindSystemDictTypePageResDto = z.infer<typeof findSystemDictTypePageResSchema>

export const createSystemDictTypeReqSchema = defineSchema(z.object({
  dictName: requiredText('字典名称不能为空').describe('字典名称'),
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('可用状态'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemDictTypeReqDto' })

export type CreateSystemDictTypeReqDto = z.infer<typeof createSystemDictTypeReqSchema>

export const updateSystemDictTypeReqSchema = defineSchema(createSystemDictTypeReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemDictTypeReqDto' })

export type UpdateSystemDictTypeReqDto = z.infer<typeof updateSystemDictTypeReqSchema>

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findSystemDictDetailByKeyReqSchema = z.object({
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
})

export type FindSystemDictDetailByKeyReqDto = z.infer<typeof findSystemDictDetailByKeyReqSchema>

export const findSystemDictDetailByKeyResSchema = defineSchema(sysDictDataEntitySchema, { id: 'FindSystemDictDetailByKeyResDto' })

export type FindSystemDictDetailByKeyResDto = z.infer<typeof findSystemDictDetailByKeyResSchema>

export const exportSystemDictTypeExcel = defineExcel({
  fileName: '系统字典类型.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    dictName: z.string().describe('字典名称'),
    dictType: z.string().describe('字典类型'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('可用状态'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
})
