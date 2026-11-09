import type { SysLoginLogEntity } from '../entities'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { UAParser } from 'ua-parser-js'

export class UserAgentSerDto {
  @ApiProperty({ description: '浏览器名称' })
  browserName?: string

  @ApiProperty({ description: '浏览器版本' })
  browserVersion?: string

  @ApiProperty({ description: '浏览器主版本号' })
  browserMajor?: string

  @ApiProperty({ description: '浏览器类型' })
  browserType?: string

  @ApiProperty({ description: 'CPU 架构' })
  cpuArchitecture?: string

  @ApiProperty({ description: '设备类型' })
  deviceType?: string

  @ApiProperty({ description: '设备型号' })
  deviceModel?: string

  @ApiProperty({ description: '设备供应商' })
  deviceVendor?: string

  @ApiProperty({ description: '浏览器引擎名称' })
  engineName?: string

  @ApiProperty({ description: '浏览器引擎版本' })
  engineVersion?: string

  @ApiProperty({ description: '操作系统名称' })
  osName?: string

  @ApiProperty({ description: '操作系统版本' })
  osVersion?: string

  constructor(userAgent: string) {
    const { ua, ...rest } = UAParser(userAgent)
    // @ts-ignore
    const obj = toCamelCaseKeys(flattenObject(mapValues(rest, value => isObject(value)
      ? { ...value }
      : value)))
    Object.assign(this, obj)
  }
}

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
