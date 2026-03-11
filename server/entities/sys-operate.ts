import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { generateId } from '~shared/utils'
import { SysUserEntity } from './sys-user'

@Entity({ tableName: 'sys_operate_log' })
export class SysOperateLogEntity {
  @ApiProperty({ description: '主键', type: String })
  @PrimaryKey()
  id = generateId()

  @ApiProperty({ description: '操作摘要' })
  @Property()
  summary: string

  @ApiProperty({ description: '控制器名称' })
  @Property()
  controllerName: string

  @ApiProperty({ description: '处理方法名称' })
  @Property()
  handlerName: string

  @ApiProperty({ description: '请求方法' })
  @Property()
  requestMethod: string

  @ApiProperty({ description: '请求URL' })
  @Property()
  requestUrl: string

  @ApiProperty({ description: '请求IP' })
  @Property()
  requestIp: string

  @ApiProperty({ description: '请求参数' })
  @Property({ nullable: true })
  requestParams?: string

  @ApiProperty({ description: '请求结果' })
  @Property({ nullable: true })
  requestResult?: string

  @ApiProperty({ description: '状态' })
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

export class SysOperateLogEntityNoRelations extends OmitType(SysOperateLogEntity, ['user'] as const) {}
