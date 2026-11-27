import { z } from 'zod'
import { defineSchema } from '~shared/utils'

/**
 * 图形验证码响应传输对象
 */
export const captchaImageResSchema = defineSchema(z.object({
  captchaId: z.string().describe('验证码ID').meta({ example: '' }),
  captchaImage: z.string().describe('验证码图片').meta({ example: '' }),
}), { id: 'CaptchaImageResDto' })

export type CaptchaImageResDto = z.infer<typeof captchaImageResSchema>
