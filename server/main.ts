import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import multipart from '@fastify/multipart'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { Logger } from 'nestjs-pino'
import { generateId } from '~shared/utils'
import { AppModule } from './app'
import { IsDev } from './utils'

async function bootstrap() {
  const nestApp = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId(req) {
        return req.id ?? generateId()
      },
    }),
    {
      abortOnError: false,
      bufferLogs: true,
    },
  )

  nestApp.enableShutdownHooks()

  const serverApp = nestApp.getHttpAdapter().getInstance()
  await serverApp.register(multipart)

  // #region 日志配置
  const logger = nestApp.get(Logger)
  nestApp.useLogger(logger)
  nestApp.flushLogs()
  // #endregion

  if (IsDev) {
    // #region Swagger 接口文档配置
    const config = new DocumentBuilder()
      .setTitle('Nitro Template')
      .setDescription('Nitro 模板接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(nestApp, config)
    SwaggerModule.setup('openapi', nestApp, document, { swaggerUiEnabled: false })

    nestApp.use('/openapi-ui', apiReference({
      withFastify: true,
      withDefaultFonts: false,
      url: '/openapi-json',
      cdn: 'https://registry.npmmirror.com/@scalar/api-reference/1.49.5/files/dist/browser/standalone.js',
    }))
    // #endregion
  }

  await nestApp.init()

  await serverApp.ready()

  return serverApp.routing
}

export default await bootstrap()
