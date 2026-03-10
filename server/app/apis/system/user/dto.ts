import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID, MinLength } from 'class-validator'
import { SysUserEntityNoRelations } from '~server/app/entities'
import { ExcelColumn, ExcelFile, PageReqDto, PageResDto } from '~server/app/extends'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnum, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemUserPageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  userName?: string

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  nickName?: string

  @ApiPropertyOptional({ description: '手机号码' })
  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号码格式不正确' })
  phone?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  sex?: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum
}

export class CreateSystemUserReqDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  userName: string

  @ApiProperty({ description: '昵称' })
  @IsNotEmpty({ message: '昵称不能为空' })
  nickName: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码不能少于6位' })
  password: string

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  sex?: string

  @ApiPropertyOptional({ description: '手机号码' })
  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号码格式不正确' })
  phone?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string

  @ApiPropertyOptional({ description: '是否删除', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '删除状态枚举值值不正确' })
  isDelete?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum
}

export class UpdateSystemUserReqDto extends CreateSystemUserReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

class SysUserEntityNoRelationsNoPassword extends OmitType(SysUserEntityNoRelations, ['password'] as const) {}

export class FindSystemUserPageResDto extends PageResDto(SysUserEntityNoRelationsNoPassword) {}

@ExcelFile({
  fileName: '系统用户.xlsx',
})
export class ExportSystemUserSerializeDto implements SysUserEntityNoRelationsNoPassword {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '账号' })
  userName: string

  @ExcelColumn({ header: '昵称' })
  nickName: string

  @ExcelColumn({ header: '手机号码' })
  phone?: string

  @ExcelColumn({ header: '邮箱' })
  email?: string

  @ExcelColumn({ header: '性别' })
  sex?: string

  @ExcelColumn({ header: '是否可用' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isAvailable: IYesOrNoEnum

  @ExcelColumn({ header: '备注' })
  remark?: string

  @ExcelColumn({ header: '是否删除' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isDelete: IYesOrNoEnum

  @ExcelColumn({ header: '头像' })
  avatar?: string

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

@ExcelFile({
  fileName: '系统用户导入模板.xlsx',
  sheetName: '系统用户',
})
export class ImportSystemUserSerializeDto implements SysUserEntityNoRelationsNoPassword {
  id: string

  @ExcelColumn({ header: '账号' })
  userName: string

  @ExcelColumn({ header: '昵称' })
  nickName: string

  @ExcelColumn({ header: '手机号码' })
  phone?: string

  @ExcelColumn({ header: '邮箱' })
  email?: string

  @ExcelColumn({ header: '性别' })
  sex?: string

  isAvailable: IYesOrNoEnum

  @ExcelColumn({ header: '备注' })
  remark?: string

  isDelete: IYesOrNoEnum

  avatar?: string

  createBy?: string

  createdAt?: Date

  updateBy?: string

  updatedAt?: Date

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

export class ImportSystemUserResDto {
  @ApiProperty({ description: '成功数' })
  success: number

  @ApiProperty({ description: '失败数' })
  fail: number

  @ApiProperty({ description: '导入失败的用户名列表' })
  items: string[]
}
