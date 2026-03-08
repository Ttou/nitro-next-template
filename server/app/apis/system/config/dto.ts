import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysConfigEntity } from '~server/app/entities'
import { ExcelColumn, ExcelFile, PageReqDto, PageResDto } from '~server/app/extends'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnum, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemConfigByKeyReqDto {
  @ApiProperty({ description: '参数键名' })
  @IsNotEmpty({ message: '参数键名不能为空' })
  configKey: string
}

export class FindSystemConfigPageReqDto extends PageReqDto {
  @ApiProperty({ description: '参数名称' })
  @IsOptional()
  configName?: string

  @ApiProperty({ description: '参数标识' })
  @IsOptional()
  configKey?: string

  @ApiPropertyOptional({ description: '是否内置参数', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '内置参数枚举值不正确' })
  isBuiltin?: IYesOrNoEnum

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

export class CreateSystemConfigReqDto {
  @ApiProperty({ description: '参数名称' })
  @IsNotEmpty({ message: '参数名称不能为空' })
  configName: string

  @ApiProperty({ description: '参数标识' })
  @IsNotEmpty({ message: '参数标识不能为空' })
  configKey: string

  @ApiProperty({ description: '参数键值' })
  @IsNotEmpty({ message: '参数键值不能为空' })
  configValue: string

  @ApiPropertyOptional({ description: '是否内置参数', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '内置参数枚举值不正确' })
  isBuiltin?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemConfigReqDto extends CreateSystemConfigReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemConfigByKeyResDto extends SysConfigEntity {}

export class FindSystemConfigPageResDto extends PageResDto(SysConfigEntity) {}

@ExcelFile({
  fileName: '系统配置.xlsx',
})
export class ExportSystemConfigResDto implements SysConfigEntity {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '参数名称' })
  configName: string

  @ExcelColumn({ header: '参数标识' })
  configKey: string

  @ExcelColumn({ header: '参数键值' })
  configValue: string

  @ExcelColumn({ header: '是否内置参数' })
  @Transform(({ value }) => YesOrNoEnum.label(value))
  isBuiltin: IYesOrNoEnum

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

  constructor(entity: SysConfigEntity) {
    Object.assign(this, entity)
  }
}
