import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Buffer } from 'node:buffer'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { generateId } from '~shared/utils'
import { AppModule } from './app'
import { SharedConfig } from './configs'
import { APP_ENV, AppEnvEnum } from './constants'

async function bootstrap() {
  const adpater = new FastifyAdapter({
    genReqId: (req: any) => req.id ?? generateId(),
  })
  const nestApp = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adpater,
    {
      abortOnError: false,
      bufferLogs: true,
    },
  )

  nestApp.enableShutdownHooks()

  const serverApp = nestApp.getHttpAdapter().getInstance()
  await serverApp.register(cookie)
  await serverApp.register(multipart)

  // #region 日志配置
  const logger = nestApp.get(Logger)
  nestApp.useLogger(logger)
  nestApp.flushLogs()
  // #endregion

  if (APP_ENV === AppEnvEnum.DEV) {
    // #region Swagger 接口文档配置
    const config = new DocumentBuilder()
      .setTitle('Nitro Template')
      .setDescription('Nitro 模板接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(nestApp, config)
    SwaggerModule.setup('openapi', nestApp, document, { swaggerUiEnabled: false })
    // #endregion
  }

  // #region Basic Auth 配置
  serverApp.addHook('onRequest', (req, reply, done) => {
    const include = ['/bull-ui']
    const url = req.url.split('?')[0] // 去掉 query string

    if (!include.some(item => url.startsWith(item)))
      return

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

    const okUser = SharedConfig.basicAuth.user
    const okPass = SharedConfig.basicAuth.pass

    if (username !== okUser || password !== okPass) {
      return reply.code(401)
        .header('www-authenticate', 'Basic realm="Restricted"')
        .send({ statusCode: 401, message: 'Unauthorized' })
    }

    done()
  })
  // #endregion

  await nestApp.init()

  await serverApp.ready()

  if (APP_ENV === AppEnvEnum.PROD) {
    await nestApp.listen(3000)
  }

  return serverApp.routing
}

export default await bootstrap()
