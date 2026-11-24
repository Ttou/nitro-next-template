import type { SysPostEntityExcludeRelationDto } from '~db/dtos'
import type { IYesOrNoEnum } from '~shared/enums'
import { Transform } from 'class-transformer'
import { z } from 'zod'
import { sysPostEntityExcludeRelationSchema } from '~db/dtos'
import { ExcelColumn, ExcelFile } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'

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

@ExcelFile({
  fileName: '系统岗位.xlsx',
})
export class ExportSystemPostSerDto implements SysPostEntityExcludeRelationDto {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '岗位标识' })
  postKey: string

  @ExcelColumn({ header: '岗位名称' })
  postName: string

  @ExcelColumn({ header: '是否可用' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isAvailable: IYesOrNoEnum

  @ExcelColumn({ header: '备注' })
  remark: string

  @ExcelColumn({ header: '创建人' })
  createBy: string

  @ExcelColumn({ header: '创建时间' })
  createdAt: Date

  @ExcelColumn({ header: '更新人' })
  updateBy: string

  @ExcelColumn({ header: '更新时间' })
  updatedAt: Date

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}
