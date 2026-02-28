import type { ISchema } from '~server/app/extends'
import type { IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysDeptEntity } from '~server/app/entities'
import { IsEnumValues } from '~server/app/validators'
import { YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemDeptListReqDto {
  @ApiPropertyOptional({ description: '部门名称' })
  @IsOptional()
  deptName?: string

  @ApiPropertyOptional({ description: '部门标识' })
  @IsOptional()
  deptKey?: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum
}

export class CreateSystemDeptReqDto {
  @ApiPropertyOptional({ description: '父部门ID' })
  @IsOptional()
  @IsUUID('7', { message: '父部门ID格式不正确' })
  parentId?: string

  @ApiPropertyOptional({ description: '部门名称' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  deptName: string

  @ApiPropertyOptional({ description: '部门标识' })
  @IsNotEmpty({ message: '部门标识不能为空' })
  deptKey: string

  @ApiPropertyOptional({ description: '可用状态', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemDeptReqDto extends CreateSystemDeptReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export const FindSystemDeptListResDto: ISchema = {
  type: 'array',
  items: {
    $ref: getSchemaPath(SysDeptEntity),
  },
}
