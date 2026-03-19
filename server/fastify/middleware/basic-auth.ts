import type { IRequest, IResponse } from '~server/interfaces'
import { Buffer } from 'node:buffer'

export interface BasicAuthOptions {
  username: string
  password: string
  realm?: string
}

export function basicAuth(options: BasicAuthOptions) {
  const { username, password, realm = 'Restricted Area' } = options

  return (req: IRequest['raw'], res: IResponse['raw'], next: () => void) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
      res.end('Authentication required')
      return
    }

    try {
      const base64Credentials = authHeader.split(' ')[1]
      if (!base64Credentials) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
        res.end('Invalid credentials')
        return
      }
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
      const [reqUsername, reqPassword] = credentials.split(':')

      if (reqUsername !== username || reqPassword !== password) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
        res.end('Invalid credentials')
        return
      }

      next()
    }
    catch {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
      res.end('Authentication failed')
    }
  }
}
