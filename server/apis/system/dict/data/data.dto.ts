import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel'
import { optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'
import { defineSchema, enumLabelField } from '~shared/utils'

export const findSystemDictDataListReqSchema = defineSchema(z.object({
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  dictLabel: optionalText().describe('字典标签'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
}), { id: 'FindSystemDictDataListReqDto' })

export type FindSystemDictDataListReqDto = z.infer<typeof findSystemDictDataListReqSchema>

export const createSystemDictDataReqSchema = defineSchema(z.object({
  dictLabel: requiredText('字典标签不能为空').describe('字典标签'),
  dictValue: requiredText('字典值不能为空').describe('字典值'),
  dictType: requiredText('字典类型不能为空').describe('字典类型'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}), { id: 'CreateSystemDictDataReqDto' })

export type CreateSystemDictDataReqDto = z.infer<typeof createSystemDictDataReqSchema>

export const updateSystemDictDataReqSchema = defineSchema(createSystemDictDataReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}), { id: 'UpdateSystemDictDataReqDto' })

export type UpdateSystemDictDataReqDto = z.infer<typeof updateSystemDictDataReqSchema>

export const exportSystemDictDataExcel = defineExcel({
  fileName: '系统字典数据.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    dictLabel: z.string().describe('字典标签'),
    dictValue: z.string().describe('字典值'),
    dictType: z.string().describe('字典类型'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
})
