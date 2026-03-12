import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsPositive, IsUUID, Min } from 'class-validator'
import { UAParser } from 'ua-parser-js'

/**
 * 分页请求传输对象
 */
export class PageReqDto {
  @ApiProperty({ description: '页码', default: 1 })
  @IsPositive({ message: '页码必须是正整数' })
  @Min(1, { message: '页码最小值为 1' })
  page: number

  @ApiProperty({ description: '页长', default: 15 })
  @IsPositive({ message: '页长必须是正整数' })
  @Min(1, { message: '页长最小值为 1' })
  pageSize: number
}

/**
 * 分页响应传输对象
 * @param {T} classRef 列表类
 */
export function PageResDto<T>(classRef: T) {
  class Page {
    @ApiProperty({ description: '页码' })
    page: number

    @ApiProperty({ description: '页长' })
    pageSize: number

    @ApiProperty({ description: '总数' })
    total: number

    @ApiProperty({ description: '列表', type: [classRef] })
    data: T[]
  }
  return Page
}

/**
 * 删除请求传输对象
 */
export class RemoveReqDto {
  @ApiProperty({
    description: '主键数组',
    type: 'array',
    items: { type: 'string' },
  })
  @ArrayNotEmpty({ message: '主键数组不能为空' })
  @IsUUID('7', { each: true, message: '主键格式不正确' })
  ids: string[]
}

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
    const result = UAParser(userAgent)
    this.browserName = result.browser.name
    this.browserVersion = result.browser.version
    this.browserMajor = result.browser.major
    this.browserType = result.browser.type
    this.cpuArchitecture = result.cpu.architecture
    this.deviceType = result.device.type
    this.deviceModel = result.device.model
    this.deviceVendor = result.device.vendor
    this.engineName = result.engine.name
    this.engineVersion = result.engine.version
    this.osName = result.os.name
    this.osVersion = result.os.version
  }
}
