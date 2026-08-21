import type { ISysLoginLogEntity } from '~db/entities'
import type { IPropertyNullable } from '~server/interfaces'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { UserAgentSerDto } from '~server/openapi'
import { SysUserEntityDto } from './sys-user'

export class SysLoginLogEntityDto implements ISysLoginLogEntity {
  @ApiProperty({ description: '主键', type: String })
  id: string

  @ApiProperty({ description: 'IP地址' })
  ip: string

  @ApiProperty({ description: '位置' })
  location: string

  @ApiProperty({ description: '用户代理' })
  userAgent: string

  @ApiProperty({ description: '用户代理解析', type: () => UserAgentSerDto })
  @Transform(({ obj }) => Reflect.construct(UserAgentSerDto, [obj.userAgent]))
  userAgentParsed: UserAgentSerDto

  @ApiProperty({ description: '密钥' })
  token: string

  @ApiProperty({ description: '请求状态' })
  status: number

  @ApiProperty({ description: '错误信息' })
  errorMsg: IPropertyNullable<string>

  @ApiProperty({ description: '操作时间', type: Date })
  operateTime: Date

  @ApiProperty({ description: '耗时' })
  costTime: number

  @ApiProperty({ description: '用户', type: () => SysUserEntityDto })
  user: SysUserEntityDto
}

export class SysLoginLogEntityExcludeRelationDto extends OmitType(SysLoginLogEntityDto, ['user'] as const) {}
