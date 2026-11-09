import type { INextFunction, IRequest, IResponse } from '~server/interfaces'
import { Buffer } from 'node:buffer'
import { timingSafeEqual } from 'node:crypto'

interface BasicAuthOptions {
  users: Record<string, string>
  /** 未认证时是否返回 WWW-Authenticate 头，触发浏览器登录弹窗 */
  challenge?: boolean
  /** WWW-Authenticate 的 realm 字段 */
  realm?: string
}

/**
 * 适配 @nestjs/platform-node 的 HTTP Basic Auth 中间件。
 *
 * 全程使用 Node.js 原生 API（res.statusCode / res.setHeader / res.end），
 * 不依赖 express-basic-auth 内部的 res.status().send() 调用链，
 * 确保与 NodeResponse（继承自 http.ServerResponse）完全兼容。
 *
 * 凭证比对使用 crypto.timingSafeEqual 防止时序攻击。
 */
export function basicAuth(options: BasicAuthOptions) {
  const { users, challenge = true, realm } = options

  return (req: IRequest, res: IResponse, next: INextFunction) => {
    const credentials = parseCredentials(req.headers.authorization)

    if (credentials) {
      const expected = users[credentials.name]
      if (expected && safeEqual(credentials.pass, expected)) {
        req.auth = { user: credentials.name, password: credentials.pass }
        next()
        return
      }
    }

    if (challenge) {
      const value = realm
        ? `Basic realm="${realm}"`
        : 'Basic'
      res.setHeader('WWW-Authenticate', value)
    }

    res.statusCode = 401
    res.end('Unauthorized')
  }
}

function parseCredentials(
  authorization: string | undefined,
): { name: string, pass: string } | null {
  if (!authorization) {
    return null
  }

  const spaceIndex = authorization.indexOf(' ')
  if (spaceIndex === -1) {
    return null
  }

  const scheme = authorization.slice(0, spaceIndex).toLowerCase()
  if (scheme !== 'basic') {
    return null
  }

  const decoded = Buffer.from(authorization.slice(spaceIndex + 1), 'base64').toString('utf-8')
  const colonIndex = decoded.indexOf(':')
  if (colonIndex === -1) {
    return null
  }

  return {
    name: decoded.slice(0, colonIndex),
    pass: decoded.slice(colonIndex + 1),
  }
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return timingSafeEqual(aBuffer, bBuffer)
}
