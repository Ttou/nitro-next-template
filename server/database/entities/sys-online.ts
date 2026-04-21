import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'
import { ApiProperty } from '@nestjs/swagger'
import { UserAgentSerializeDto } from '~server/openapi'
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
  @Property({ type: 'text' })
  userAgent: string

  @ApiProperty({ description: '用户代理解析', type: () => UserAgentSerializeDto })
  @Property({ persist: false })
  get userAgentParsed() {
    return Reflect.construct(UserAgentSerializeDto, [this.userAgent])
  }

  @ApiProperty({ description: '登录时间' })
  @Property()
  loginTime: Date

  @ApiProperty({ description: '用户', type: () => SysUserEntity })
  @ManyToOne(() => SysUserEntity, { joinColumn: 'user_id' })
  user: SysUserEntity
}
