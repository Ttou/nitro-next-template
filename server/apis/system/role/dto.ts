import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysRoleEntityNoRelations } from '~server/database'
import { ExcelColumn, ExcelFile, PageReqDto, PageResDto } from '~server/extends'
import { IsEnumValues } from '~server/validators'
import { YesOrNoEnum, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemRolePageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  roleName?: string

  @ApiPropertyOptional({ description: '角色标识' })
  @IsOptional()
  roleKey?: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString({}, { message: '开始时间格式不正确' })
  beginTime?: string

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString({}, { message: '结束时间格式不正确' })
  endTime?: string
}

export class CreateSystemRoleReqDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  roleName: string

  @ApiProperty({ description: '角色标识' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  roleKey: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemRoleReqDto extends CreateSystemRoleReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemRolePageResDto extends PageResDto(SysRoleEntityNoRelations) {}

@ExcelFile({
  fileName: '系统角色.xlsx',
})
export class ExportSystemRoleSerializeDto implements SysRoleEntityNoRelations {
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
  remark?: string

  @ExcelColumn({ header: '创建人' })
  createBy?: string

  @ExcelColumn({ header: '创建时间' })
  createdAt?: Date

  @ExcelColumn({ header: '更新人' })
  updateBy?: string

  @ExcelColumn({ header: '更新时间' })
  updatedAt?: Date

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}
