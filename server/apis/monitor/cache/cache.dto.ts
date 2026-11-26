import { z } from 'zod'
import { pageReqSchema, pageResSchema } from '~server/dtos'
import { optionalText, requiredText } from '~server/dtos/zod'
import { defineSchema } from '~shared/utils'

export const findMonitorCachePageReqSchema = defineSchema(pageReqSchema.extend({
  key: optionalText().describe('缓存键'),
}), { id: 'FindMonitorCachePageReqDto' })

export type FindMonitorCachePageReqDto = z.infer<typeof findMonitorCachePageReqSchema>

/**
 * 缓存分页项响应传输对象
 */
export const findMonitorCachePageItemResSchema = defineSchema(z.object({
  key: z.string().describe('缓存键'),
  ttl: z.number().describe('缓存过期时间'),
}), { id: 'FindMonitorCachePageItemResDto' })

export type FindMonitorCachePageItemResDto = z.infer<typeof findMonitorCachePageItemResSchema>

export const findMonitorCachePageResSchema = pageResSchema('FindMonitorCachePageResDto', findMonitorCachePageItemResSchema)

export type FindMonitorCachePageResDto = z.infer<typeof findMonitorCachePageResSchema>

// 查询参数需要内联的 object schema 才能被展开成逐个 query 参数，因此不设 id
export const findMonitorCacheByKeyReqSchema = z.object({
  cacheKey: requiredText('缓存键名不能为空').describe('缓存键名'),
})

export type FindMonitorCacheByKeyReqDto = z.infer<typeof findMonitorCacheByKeyReqSchema>

export const removeMonitorCacheReqSchema = defineSchema(z.object({
  keys: z.array(
    z.string({ error: '缓存键必须是字符串' }),
    { error: '缓存键数组不能为空' },
  ).nonempty({ error: '缓存键数组不能为空' }).describe('缓存键数组'),
}), { id: 'RemoveMonitorCacheReqDto' })

export type RemoveMonitorCacheReqDto = z.infer<typeof removeMonitorCacheReqSchema>
