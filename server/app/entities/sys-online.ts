import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_online' })
export class SysOnlineEntity {
  @ApiProperty({ description: '主键' })
  @PrimaryKey({ type: 'bigint', autoincrement: true })
  id!: bigint

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

  @ApiProperty({ description: '浏览器' })
  @Property()
  browser: string

  @ApiProperty({ description: '操作系统' })
  @Property()
  os: string

  @ApiProperty({ description: '登录时间' })
  @Property()
  loginTime: Date

  @ApiProperty({ description: '用户', type: () => SysUserEntity })
  @ManyToOne(() => SysUserEntity, { joinColumn: 'user_id' })
  user: SysUserEntity
}
