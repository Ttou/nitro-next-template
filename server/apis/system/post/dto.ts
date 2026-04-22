import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysPostEntityExcludeRelationDto } from '~server/database'
import { ExcelColumn, ExcelFile } from '~server/extends'
import { PageReqDto, PageResDto } from '~server/openapi'
import { IsEnumValues } from '~server/validators'
import { YesOrNoEnum, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemPostPageReqDto extends PageReqDto {
  @ApiPropertyOptional({ description: '岗位标识' })
  @IsOptional()
  postKey?: string

  @ApiPropertyOptional({ description: '岗位名称' })
  @IsOptional()
  postName?: string

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

export class CreateSystemPostReqDto {
  @ApiProperty({ description: '岗位名称' })
  @IsNotEmpty({ message: '岗位名称不能为空' })
  postName: string

  @ApiProperty({ description: '岗位标识' })
  @IsNotEmpty({ message: '岗位标识不能为空' })
  postKey: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemPostReqDto extends CreateSystemPostReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemPostPageResDto extends PageResDto(SysPostEntityExcludeRelationDto) {}

@ExcelFile({
  fileName: '系统岗位.xlsx',
})
export class ExportSystemPostSerializeDto implements SysPostEntityExcludeRelationDto {
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
