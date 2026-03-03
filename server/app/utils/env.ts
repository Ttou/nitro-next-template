import { env } from 'node:process'

/**
 * 是否是开发环境
 */
export const IsDev = env.APP_ENV === 'dev'
