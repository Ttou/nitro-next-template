import { z } from 'zod'

/**
 * 分页请求传输对象
 */
export const pageReqSchema = z.object({
  page: z.coerce
    .number({ error: '页码必须是正整数' })
    .int({ error: '页码必须是正整数' })
    .min(1, { error: '页码必须是正整数' })
    .describe('页码')
    .meta({ default: 1 }),
  pageSize: z.coerce
    .number({ error: '页长必须是正整数' })
    .int({ error: '页长必须是正整数' })
    .min(1, { error: '页长必须是正整数' })
    .describe('页长')
    .meta({ default: 20 }),
})

export type PageReqDto = z.infer<typeof pageReqSchema>

/**
 * 分页响应 schema
 *
 * 每个分页接口单独占一个组件，组件名即接口名，所以 id 由调用方传入
 *
 * @param id 组件名，与接口响应类型名保持一致
 * @param item 分页数据项 schema
 */
export function pageResSchema<Item extends z.ZodType>(id: string, item: Item) {
  return z.object({
    page: z.number().describe('页码'),
    pageSize: z.number().describe('页长'),
    total: z.number().describe('总数'),
    data: z.array(item).describe('分页数据'),
  }).meta({ id })
}
