import { z } from 'zod'
import { sysPostEntityExcludeRelationSchema } from '~db/dtos'
import { defineExcel } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'
import { enumLabelField } from '~shared/utils'

export const findSystemPostPageReqSchema = pageReqSchema.extend({
  postKey: optionalText().describe('岗位标识'),
  postName: optionalText().describe('岗位名称'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}).meta({ id: 'FindSystemPostPageReqDto' })

export type FindSystemPostPageReqDto = z.infer<typeof findSystemPostPageReqSchema>

export const findSystemPostPageResSchema = pageResSchema('FindSystemPostPageResDto', sysPostEntityExcludeRelationSchema)

export type FindSystemPostPageResDto = z.infer<typeof findSystemPostPageResSchema>

export const createSystemPostReqSchema = z.object({
  postName: requiredText('岗位名称不能为空').describe('岗位名称'),
  postKey: requiredText('岗位标识不能为空').describe('岗位标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}).meta({ id: 'CreateSystemPostReqDto' })

export type CreateSystemPostReqDto = z.infer<typeof createSystemPostReqSchema>

export const updateSystemPostReqSchema = createSystemPostReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}).meta({ id: 'UpdateSystemPostReqDto' })

export type UpdateSystemPostReqDto = z.infer<typeof updateSystemPostReqSchema>

export const exportSystemPostExcel = defineExcel({
  fileName: '系统岗位.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    postKey: z.string().describe('岗位标识'),
    postName: z.string().describe('岗位名称'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
})
