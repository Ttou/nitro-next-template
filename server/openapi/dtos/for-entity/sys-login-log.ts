import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { SysLoginLogEntity } from '~db/entities'
import { UserAgentSerDto } from '~server/openapi'

export class SysLoginLogEntityDto implements SysLoginLogEntity {
  @ApiProperty({ description: '主键', type: String })
  id: string

  @ApiProperty({ description: 'IP地址' })
  ip: string

  @ApiProperty({ description: '位置' })
  location: string

  @ApiProperty({ description: '用户账号' })
  userName: string

  @ApiProperty({ description: '用户代理' })
  userAgent: string

  @ApiProperty({
    description: '用户代理解析',
    type: () => UserAgentSerDto,
  })
  @Transform(({ obj }) => Reflect.construct(UserAgentSerDto, [obj.userAgent]))
  userAgentParsed: UserAgentSerDto

  @ApiProperty({ description: '密钥' })
  token: string

  @ApiProperty({ description: '请求状态' })
  status: number

  @ApiProperty({ description: '错误信息' })
  errorMsg?: INullable<string>

  @ApiProperty({ description: '操作时间', type: Date })
  operateTime: Date

  @ApiProperty({ description: '耗时' })
  costTime: number
}
