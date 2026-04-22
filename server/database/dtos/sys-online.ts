import type { SysOnlineEntity } from '../entities'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { UserAgentSerializeDto } from '~server/openapi'
import { SysUserEntityDto } from './sys-user'

export class SysOnlineEntityDto implements SysOnlineEntity {
  @ApiProperty({ description: '主键', type: String })
  id: string

  @ApiProperty({ description: '会话ID' })
  tokenId: string

  @ApiProperty({ description: 'Token' })
  token: string

  @ApiProperty({ description: 'IP地址' })
  ip: string

  @ApiProperty({ description: '位置' })
  location: string

  @ApiProperty({ description: '用户代理' })
  userAgent: string

  @ApiProperty({ description: '用户代理解析', type: () => UserAgentSerializeDto })
  userAgentParsed: UserAgentSerializeDto

  @ApiProperty({ description: '登录时间' })
  loginTime: Date

  @ApiProperty({ description: '用户', type: () => SysUserEntityDto })
  user: SysUserEntityDto
}

export class SysOnlineEntityExcludeRelationDto extends OmitType(SysOnlineEntityDto, ['user'] as const) {}
