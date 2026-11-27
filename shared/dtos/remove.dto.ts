import { z } from 'zod'
import { defineSchema, lazySchema } from '~shared/utils'
import { uuidArray } from './zod'

/**
 * 删除请求传输对象
 */
export const removeReqSchema = lazySchema(() => defineSchema(z.object({
  ids: uuidArray('主键格式不正确', '主键数组不能为空').describe('主键数组'),
}), { id: 'RemoveReqDto' }))

export type RemoveReqDto = z.infer<ReturnType<typeof removeReqSchema>>
