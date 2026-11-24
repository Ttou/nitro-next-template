import { z } from 'zod'
import { sysUserEntityNoPasswordSchema } from '~db/dtos'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { optionalText } from '~server/dtos/zod'

/**
 * 分页查询在线用户请求
 */
export const findMonitorOnlinePageReqSchema = pageReqSchema.extend({
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
}).meta({ id: 'FindMonitorOnlinePageReqDto' })

export type FindMonitorOnlinePageReqDto = z.infer<typeof findMonitorOnlinePageReqSchema>

/**
 * 在线用户分页项响应传输对象
 */
export const findMonitorOnlinePageItemResSchema = sysUserEntityNoPasswordSchema.meta({ id: 'FindMonitorOnlinePageItemResDto' })

export type FindMonitorOnlinePageItemResDto = z.infer<typeof findMonitorOnlinePageItemResSchema>

export const findMonitorOnlinePageResSchema = pageResSchema('FindMonitorOnlinePageResDto', findMonitorOnlinePageItemResSchema)

export type FindMonitorOnlinePageResDto = z.infer<typeof findMonitorOnlinePageResSchema>
