import { flattenObject, toCamelCaseKeys } from 'es-toolkit'
import { UAParser } from 'ua-parser-js'
import { z } from 'zod'
import { dateTimeField } from '~shared/utils'

/**
 * 用户代理解析结果
 */
export const userAgentSerSchema = z.object({
  browserName: z.string().optional().describe('浏览器名称'),
  browserVersion: z.string().optional().describe('浏览器版本'),
  browserMajor: z.string().optional().describe('浏览器主版本号'),
  browserType: z.string().optional().describe('浏览器类型'),
  cpuArchitecture: z.string().optional().describe('CPU 架构'),
  deviceType: z.string().optional().describe('设备类型'),
  deviceModel: z.string().optional().describe('设备型号'),
  deviceVendor: z.string().optional().describe('设备供应商'),
  engineName: z.string().optional().describe('浏览器引擎名称'),
  engineVersion: z.string().optional().describe('浏览器引擎版本'),
  osName: z.string().optional().describe('操作系统名称'),
  osVersion: z.string().optional().describe('操作系统版本'),
}).meta({ id: 'UserAgentSerDto' })

export type UserAgentSerDto = z.infer<typeof userAgentSerSchema>

/**
 * 解析用户代理
 */
export function parseUserAgent(userAgent: string): UserAgentSerDto {
  // ua 是原始字符串，不需要展开
  const { ua, ...rest } = UAParser(userAgent)
  return toCamelCaseKeys(flattenObject(rest as Record<string, unknown>)) as UserAgentSerDto
}

/**
 * 系统登录日志
 */
export const sysLoginLogEntitySchema = z.object({
  id: z.string().describe('主键'),
  ip: z.string().describe('IP地址'),
  location: z.string().describe('位置'),
  userName: z.string().describe('用户账号'),
  userAgent: z.string().describe('用户代理'),
  userAgentParsed: userAgentSerSchema.describe('用户代理解析'),
  token: z.string().describe('密钥'),
  status: z.number().describe('请求状态'),
  errorMsg: z.string().nullish().describe('错误信息'),
  operateTime: dateTimeField('操作时间'),
  costTime: z.number().describe('耗时'),
}).meta({ id: 'SysLoginLogEntityDto' })

export type SysLoginLogEntityDto = z.infer<typeof sysLoginLogEntitySchema>
