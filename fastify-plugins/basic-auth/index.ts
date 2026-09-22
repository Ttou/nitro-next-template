import type { FastifyPluginAsync } from 'fastify'
import { Buffer } from 'node:buffer'
import fp from 'fastify-plugin'

// 定义插件的选项接口
interface BasicAuthPluginOptions {
  include: string[]
  okUser: string
  okPass: string
}

// 使用 fastify-plugin 包装以跳出 Fastify 封装上下文，
// 否则插件内的 onRequest 钩子只对同一封装上下文中注册的路由生效，
// 无法拦截 BullBoard 等注册在根实例上的路由
const basicAuth: FastifyPluginAsync<BasicAuthPluginOptions> = async (fastify, opts) => {
  fastify.addHook('onRequest', (req, reply, done) => {
    const { include, okUser, okPass } = opts
    const url = req.url.split('?')[0] // 去掉 query string

    if (!include.some(item => url.startsWith(item)))
      return done()

    const auth = req.headers.authorization
    if (!auth?.startsWith('Basic ')) {
      return reply.code(401)
        .header('www-authenticate', 'Basic realm="Restricted"')
        .send({ statusCode: 401, message: 'Unauthorized' })
    }

    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8')
    const idx = decoded.indexOf(':')
    const username = decoded.slice(0, idx)
    const password = decoded.slice(idx + 1)

    if (username !== okUser || password !== okPass) {
      return reply.code(401)
        .header('www-authenticate', 'Basic realm="Restricted"')
        .send({ statusCode: 401, message: 'Unauthorized' })
    }

    done()
  })
}

export default fp(basicAuth, {
  name: 'basic-auth',
  fastify: '5.x',
})
