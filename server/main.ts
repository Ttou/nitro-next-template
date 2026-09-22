import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import basicAuth from '~fastify-plugins/basic-auth'
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
  // #region Basic Auth 配置
  await serverApp.register(basicAuth, {
    include: ['/bull-ui'],
    okUser: SharedConfig.basicAuth.user,
    okPass: SharedConfig.basicAuth.pass,
  })
  // #endregion

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

  await nestApp.init()

  await serverApp.ready()

  if (APP_ENV === AppEnvEnum.PROD) {
    await nestApp.listen(3000)
  }

  return serverApp.routing
}

export default await bootstrap()
