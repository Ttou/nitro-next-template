import { z } from 'zod'
import { requiredText } from '~shared/dtos/zod'
import { defineSchema, lazySchema } from '~shared/utils'

/**
 * 登录请求传输对象
 */
export const loginReqSchema = lazySchema(() => defineSchema(z.object({
  userName: requiredText('账号不能为空').describe('账号'),
  password: requiredText('密码不能为空').describe('密码（RSA-OAEP 加密后的 Base64 密文）'),
  captchaId: requiredText('验证码编号不能为空').describe('验证码编号'),
  captchaValue: requiredText('验证码值不能为空').describe('验证码值'),
}), { id: 'LoginReqDto' }))

export type LoginReqDto = z.infer<ReturnType<typeof loginReqSchema>>

/**
 * 登录公钥响应传输对象
 */
export const authPublicKeyResSchema = lazySchema(() => defineSchema(z.object({
  algorithm: z.string().describe('加密算法').meta({ example: 'RSA-OAEP-256' }),
  publicKey: z.string().describe('公钥（SPKI DER 的 Base64）').meta({ example: '' }),
}), { id: 'AuthPublicKeyResDto' }))

export type AuthPublicKeyResDto = z.infer<ReturnType<typeof authPublicKeyResSchema>>
