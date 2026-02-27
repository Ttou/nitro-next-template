import type { IMenuTypeEnum, IYesOrNoEnum } from '~shared/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { SysMenuEntity } from '~server/app/entities'
import { ResultResDto } from '~server/app/openapi'
import { IsEnumValues } from '~server/app/validators'
import { MenuTypeEnumMap, MenuTypeEnumValues, YesOrNoEnumMap, YesOrNoEnumValues } from '~shared/enums'

export class FindSystemMenuListReqDto {
  @ApiPropertyOptional({ description: '菜单名称' })
  @IsOptional()
  menuName?: string

  @ApiPropertyOptional({ description: '菜单标识' })
  @IsOptional()
  menuKey?: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '可用状态枚举值不正确' })
  isAvailable?: IYesOrNoEnum
}

export class CreateSystemMenuReqDto {
  @ApiPropertyOptional({ description: '父菜单ID' })
  @IsOptional()
  @IsUUID('7', { message: '父菜单ID格式不正确' })
  parentId?: string

  @ApiProperty({ description: '菜单标识' })
  @IsNotEmpty({ message: '菜单标识不能为空' })
  menuKey: string

  @ApiProperty({ description: '菜单名称' })
  @IsNotEmpty({ message: '菜单名称不能为空' })
  menuName: string

  @ApiProperty({ description: '菜单类型', enum: MenuTypeEnumMap })
  @IsNotEmpty({ message: '菜单类型不能为空' })
  @IsEnumValues(MenuTypeEnumValues, { message: '菜单类型枚举值不正确' })
  menuType: IMenuTypeEnum

  @ApiProperty({ description: '菜单排序' })
  @IsNotEmpty({ message: '菜单排序不能为空' })
  @Transform(({ value }) => Number(value))
  orderNum: number

  @ApiPropertyOptional({ description: '路由地址' })
  @IsOptional()
  path?: string

  @ApiPropertyOptional({ description: '组件' })
  @IsOptional()
  component?: string

  @ApiPropertyOptional({ description: '重定向' })
  @IsOptional()
  redirect?: string

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  icon?: string

  @ApiPropertyOptional({ description: '是否可用', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '是否可用枚举值不正确' })
  isAvailable?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否外链', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '是否外链枚举值不正确' })
  isFrame?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否缓存', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '是否缓存枚举值不正确' })
  isCache?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '是否显示', enum: YesOrNoEnumMap })
  @IsOptional()
  @IsEnumValues(YesOrNoEnumValues, { message: '是否显示枚举值不正确' })
  isVisible?: IYesOrNoEnum

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  remark?: string
}

export class UpdateSystemMenuReqDto extends CreateSystemMenuReqDto {
  @ApiProperty({ description: 'ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsUUID('7', { message: 'ID格式不正确' })
  id: string
}

export class FindSystemMenuListResDto extends ResultResDto([SysMenuEntity]) {}
