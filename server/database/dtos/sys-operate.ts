import type { SysOperateEntity } from '../entities'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { UserAgentSerializeDto } from '~server/openapi'
import { SysUserEntityDto } from './sys-user'

export class SysOperateEntityDto implements SysOperateEntity {
  @ApiProperty({ description: '主键', type: String })
  id: string

  @ApiProperty({ description: '操作摘要' })
  summary: string

  @ApiProperty({ description: '控制器名称' })
  controllerName: string

  @ApiProperty({ description: '处理器名称' })
  handlerName: string

  @ApiProperty({ description: '请求方法' })
  requestMethod: string

  @ApiProperty({ description: '请求链接' })
  requestUrl: string

  @ApiProperty({ description: '请求参数' })
  requestParams?: string

  @ApiProperty({ description: '请求结果' })
  requestResult?: string

  @ApiProperty({ description: 'IP地址' })
  ip: string

  @ApiProperty({ description: '位置' })
  location: string

  @ApiProperty({ description: '用户代理' })
  userAgent: string

  @ApiProperty({ description: '用户代理解析', type: () => UserAgentSerializeDto })
  userAgentParsed: UserAgentSerializeDto

  @ApiProperty({ description: '请求状态' })
  status: number

  @ApiProperty({ description: '错误信息' })
  errorMsg?: string

  @ApiProperty({ description: '操作时间', type: Date })
  operateTime: Date

  @ApiProperty({ description: '耗时' })
  costTime: number

  @ApiProperty({ description: '用户', type: () => SysUserEntityDto })
  user: SysUserEntityDto
}

export class SysOperateEntityNoRelations extends OmitType(SysOperateEntityDto, ['user'] as const) {}
