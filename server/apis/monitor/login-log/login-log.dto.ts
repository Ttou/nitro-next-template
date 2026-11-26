import { z } from 'zod'
import { pageReqSchema, pageResSchema, sysLoginLogEntitySchema } from '~server/dtos'
import { dateText, optionalText } from '~server/dtos/zod'
import { defineSchema } from '~shared/utils'

/**
 * 分页查询登录日志请求
 */
export const findMonitorLoginLogPageReqSchema = defineSchema(pageReqSchema.extend({
  userName: optionalText().describe('用户名'),
  nickName: optionalText().describe('昵称'),
  beginTime: dateText('开始时间格式不正确').nullish().transform(value => value ?? undefined).describe('开始时间'),
  endTime: dateText('结束时间格式不正确').nullish().transform(value => value ?? undefined).describe('结束时间'),
}), { id: 'FindMonitorLoginLogPageReqDto' })

export type FindMonitorLoginLogPageReqDto = z.infer<typeof findMonitorLoginLogPageReqSchema>

export const findMonitorLoginLogPageResSchema = pageResSchema('FindMonitorLoginLogPageResDto', sysLoginLogEntitySchema)

export type FindMonitorLoginLogPageResDto = z.infer<typeof findMonitorLoginLogPageResSchema>
