import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysDictDataEntity } from '~server/app/entities'
import { ExcelColumn, ExcelFile } from '~server/app/extends'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnum, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemDictDataListReqDto {
  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string

  @ApiPropertyOptional({ description: '字典标签' })
  @IsOptional()
  dictLabel?: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum
}

export class CreateSystemDictDataReqDto {
  @ApiProperty({ description: '字典标签' })
  @IsNotEmpty({ message: '字典标签不能为空' })
  dictLabel: string

  @ApiProperty({ description: '字典值' })
  @IsNotEmpty({ message: '字典值不能为空' })
  dictValue: string

  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemDictDataReqDto extends CreateSystemDictDataReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemDictDataListResDto extends SysDictDataEntity {}

@ExcelFile({
  fileName: '系统字典数据.xlsx',
})
export class ExportSystemDictDataResDto implements SysDictDataEntity {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '字典标签' })
  dictLabel: string

  @ExcelColumn({ header: '字典值' })
  dictValue: string

  @ExcelColumn({ header: '字典类型' })
  dictType: string

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
