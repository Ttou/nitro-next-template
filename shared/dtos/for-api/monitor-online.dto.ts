import type { z } from 'zod'
import { sysUserEntityNoPasswordSchema } from '~shared/dtos/for-db'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { optionalText } from '~shared/dtos/zod'
import { defineSchema, lazySchema } from '~shared/utils'

/**
 * 分页查询在线用户请求
 */
export const findMonitorOnlinePageReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
}), { id: 'FindMonitorOnlinePageReqDto' }))

export type FindMonitorOnlinePageReqDto = z.infer<ReturnType<typeof findMonitorOnlinePageReqSchema>>

/**
 * 在线用户分页项响应传输对象
 */
export const findMonitorOnlinePageItemResSchema = lazySchema(() => defineSchema(sysUserEntityNoPasswordSchema(), { id: 'FindMonitorOnlinePageItemResDto' }))

export type FindMonitorOnlinePageItemResDto = z.infer<ReturnType<typeof findMonitorOnlinePageItemResSchema>>

export const findMonitorOnlinePageResSchema = lazySchema(() => pageResSchema('FindMonitorOnlinePageResDto', findMonitorOnlinePageItemResSchema()))

export type FindMonitorOnlinePageResDto = z.infer<ReturnType<typeof findMonitorOnlinePageResSchema>>
