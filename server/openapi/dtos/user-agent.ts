import { ApiProperty } from '@nestjs/swagger'
import { flattenObject, mapValues, toCamelCaseKeys } from 'es-toolkit'
import { isObject } from 'es-toolkit/compat'
import { UAParser } from 'ua-parser-js'

export class UserAgentSerializeDto {
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
    const obj = toCamelCaseKeys(flattenObject(mapValues(rest, value => isObject(value) ? { ...value } : value)))
    Object.assign(this, obj)
  }
}
