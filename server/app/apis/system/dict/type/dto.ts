import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysDictDataEntity, SysDictTypeEntity } from '~server/app/entities'
import { ExcelColumn, ExcelFile, PageReqDto, PageResDto } from '~server/app/extends'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnum, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemDictTypePageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '字典名称' })
  @IsOptional()
  dictName?: string

  @ApiPropertyOptional({ description: '字典类型' })
  @IsOptional()
  dictType?: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
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

export class CreateSystemDictTypeReqDto {
  @ApiPropertyOptional({ description: '字典名称' })
  @IsNotEmpty({ message: '字典名称不能为空' })
  dictName: string

  @ApiPropertyOptional({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemDictTypeReqDto extends CreateSystemDictTypeReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemDictDetailByKeyReqDto {
  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string
}

export class FindSystemDictDetailByKeyResDto extends SysDictDataEntity {}

export class FindSystemDictTypePageResDto extends PageResDto(SysDictTypeEntity) {}

@ExcelFile({
  fileName: '系统字典类型.xlsx',
})
export class ExportSystemDictTypeSerializeDto implements SysDictTypeEntity {
  @ExcelColumn({ header: 'ID' })
  id: string

  @ExcelColumn({ header: '字典名称' })
  dictName: string

  @ExcelColumn({ header: '字典类型' })
  dictType: string

  @ExcelColumn({ header: '可用状态' })
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
