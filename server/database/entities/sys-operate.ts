import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { UserAgentSerializeDto } from '~server/extends'
import { generateId } from '~shared/utils'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_operate' })
export class SysOperateEntity {
  @ApiProperty({ description: '主键', type: String })
  @PrimaryKey()
  id = generateId()

  @ApiProperty({ description: '操作摘要' })
  @Property()
  summary: string

  @ApiProperty({ description: '控制器名称' })
  @Property()
  controllerName: string

  @ApiProperty({ description: '处理器名称' })
  @Property()
  handlerName: string

  @ApiProperty({ description: '请求方法' })
  @Property()
  requestMethod: string

  @ApiProperty({ description: '请求链接' })
  @Property()
  requestUrl: string

  @ApiProperty({ description: '请求参数' })
  @Property({ nullable: true })
  requestParams?: string

  @ApiProperty({ description: '请求结果' })
  @Property({ nullable: true })
  requestResult?: string

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

  @ApiProperty({ description: '请求状态' })
  @Property()
  status: number

  @ApiProperty({ description: '错误信息' })
  @Property({ nullable: true })
  errorMsg?: string

  @ApiProperty({ description: '操作时间', type: Date })
  @Property()
  operateTime: Date

  @ApiProperty({ description: '耗时' })
  @Property()
  costTime: number

  @ApiProperty({ description: '用户', type: () => SysUserEntity })
  @ManyToOne(() => SysUserEntity, { joinColumn: 'user_id' })
  user: SysUserEntity
}

export class SysOperateEntityNoRelations extends OmitType(SysOperateEntity, ['user'] as const) {}
