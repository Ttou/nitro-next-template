import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { UserAgentSerializeDto } from '~server/extends'
import { generateId } from '~shared/utils'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_online' })
export class SysOnlineEntity {
  @ApiProperty({ description: '主键', type: String })
  @PrimaryKey()
  id = generateId()

  @ApiProperty({ description: '会话ID' })
  @Property()
  tokenId: string

  @ApiProperty({ description: 'Token' })
  @Property()
  token: string

  @ApiProperty({ description: 'IP地址' })
  @Property()
  ip: string

  @ApiProperty({ description: '位置' })
  @Property()
  location: string

  @ApiProperty({ description: '用户代理' })
  @Property({ type: 'text', serializer: value => Reflect.construct(UserAgentSerializeDto, [value]) })
  userAgent: string

  @ApiProperty({ description: '登录时间' })
  @Property()
  loginTime: Date

  @ApiProperty({ description: '用户', type: () => SysUserEntity })
  @ManyToOne(() => SysUserEntity, { joinColumn: 'user_id' })
  user: SysUserEntity
}

export class SysOnlineEntityNoRelations extends OmitType(SysOnlineEntity, ['user'] as const) {}
