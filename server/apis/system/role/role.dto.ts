import type { SysRoleEntityExcludeRelationDto } from '~db/dtos'
import type { IYesOrNoEnum } from '~shared/enums'
import { Transform } from 'class-transformer'
import { z } from 'zod'
import { sysRoleEntityExcludeRelationSchema } from '~db/dtos'
import { ExcelColumn, ExcelFile } from '~nestjs-modules/excel'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { dateText, optionalEnumOf, optionalText, requiredText, uuid } from '~server/dtos/zod'
import { YesOrNoEnum, YesOrNoEnumValues } from '~shared/enums'

export const findSystemRolePageReqSchema = pageReqSchema.extend({
  roleName: optionalText().describe('角色名称'),
  roleKey: optionalText().describe('角色标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}).meta({ id: 'FindSystemRolePageReqDto' })

export type FindSystemRolePageReqDto = z.infer<typeof findSystemRolePageReqSchema>

export const findSystemRolePageResSchema = pageResSchema('FindSystemRolePageResDto', sysRoleEntityExcludeRelationSchema)

export type FindSystemRolePageResDto = z.infer<typeof findSystemRolePageResSchema>

export const createSystemRoleReqSchema = z.object({
  roleName: requiredText('角色名称不能为空').describe('角色名称'),
  roleKey: requiredText('角色标识不能为空').describe('角色标识'),
  isAvailable: optionalEnumOf(YesOrNoEnumValues, '可用状态枚举值不正确').describe('是否可用'),
  remark: optionalText().describe('备注'),
}).meta({ id: 'CreateSystemRoleReqDto' })

export type CreateSystemRoleReqDto = z.infer<typeof createSystemRoleReqSchema>

export const updateSystemRoleReqSchema = createSystemRoleReqSchema.extend({
  id: uuid('ID格式不正确').describe('ID'),
}).meta({ id: 'UpdateSystemRoleReqDto' })

export type UpdateSystemRoleReqDto = z.infer<typeof updateSystemRoleReqSchema>

@ExcelFile({
  fileName: '系统角色.xlsx',
})
export class ExportSystemRoleSerDto implements SysRoleEntityExcludeRelationDto {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '角色键值' })
  roleKey: string

  @ExcelColumn({ header: '角色名称' })
  roleName: string

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
