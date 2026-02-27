import type { StringValue } from 'ms'
import dayjs from 'dayjs'
import ms from 'ms'

/**
 * 解析 vercel/ms 时间
 * @param type
 * @param value
 */
export function parseMs(type: 'milliseconds' | 'seconds', value: StringValue) {
  if (type === 'seconds') {
    return ms(value) / 1000
  }
  return ms(value)
}

/**
 * 获取 Unix 时间戳
 * @param type
 * @param value
 */
export function getUnixTimestamp(type: 'milliseconds' | 'seconds', value: dayjs.ConfigType = new Date()) {
  if (type === 'seconds') {
    return dayjs(value).unix()
  }
  return dayjs(value).valueOf()
}

/**
 * 日期格式化
 * @param date 日期
 * @param template 格式
 */
export function formatTime(date: dayjs.ConfigType, template = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(template)
}

/**
 * 延迟执行
 * @param ms 毫秒
 */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
