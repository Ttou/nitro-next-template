import { z } from 'zod'
import { pageReqSchema, pageResSchema } from '~shared/dtos/page.dto'
import { optionalText, requiredText } from '~shared/dtos/zod'
import { defineSchema, lazySchema } from '~shared/utils'

export const findMonitorCachePageReqSchema = lazySchema(() => defineSchema(pageReqSchema().extend({
  key: optionalText().describe('缓存键'),
}), { id: 'FindMonitorCachePageReqDto' }))

export type FindMonitorCachePageReqDto = z.infer<ReturnType<typeof findMonitorCachePageReqSchema>>

/**
 * 缓存分页项响应传输对象
 */
export const findMonitorCachePageItemResSchema = lazySchema(() => defineSchema(z.object({
  key: z.string().describe('缓存键'),
  ttl: z.number().describe('缓存过期时间'),
}), { id: 'FindMonitorCachePageItemResDto' }))

export type FindMonitorCachePageItemResDto = z.infer<ReturnType<typeof findMonitorCachePageItemResSchema>>

export const findMonitorCachePageResSchema = lazySchema(() => pageResSchema('FindMonitorCachePageResDto', findMonitorCachePageItemResSchema()))

export type FindMonitorCachePageResDto = z.infer<ReturnType<typeof findMonitorCachePageResSchema>>

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findMonitorCacheByKeyReqSchema = lazySchema(() => z.object({
  cacheKey: requiredText('缓存键名不能为空').describe('缓存键名'),
}))

export type FindMonitorCacheByKeyReqDto = z.infer<ReturnType<typeof findMonitorCacheByKeyReqSchema>>

export const removeMonitorCacheReqSchema = lazySchema(() => defineSchema(z.object({
  keys: z.array(
    z.string({ error: '缓存键必须是字符串' }),
    { error: '缓存键数组不能为空' },
  ).nonempty({ error: '缓存键数组不能为空' }).describe('缓存键数组'),
}), { id: 'RemoveMonitorCacheReqDto' }))

export type RemoveMonitorCacheReqDto = z.infer<ReturnType<typeof removeMonitorCacheReqSchema>>
