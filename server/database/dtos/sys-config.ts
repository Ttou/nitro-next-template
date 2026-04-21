import type { IYesOrNoEnum } from '~shared/enums'
import type { SysConfigEntity } from '../entities'
import { ApiProperty } from '@nestjs/swagger'
import { YesOrNoEnumMap } from '~shared/enums'
import { BaseEntityDto } from './base'

export class SysConfigEntityDto extends BaseEntityDto implements SysConfigEntity {
  @ApiProperty({ description: '配置键值' })
  configKey: string

  @ApiProperty({ description: '配置名称' })
  configName: string

  @ApiProperty({ description: '配置值' })
  configValue: string

  @ApiProperty({ description: '是否内置', enum: YesOrNoEnumMap })
  isBuiltin: IYesOrNoEnum

  @ApiProperty({ description: '是否可用', enum: YesOrNoEnumMap })
  isAvailable: IYesOrNoEnum

  @ApiProperty({ description: '备注' })
  remark?: string
}
