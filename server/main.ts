import type { NestNodeApplication } from '@nestjs/platform-node'
import { NestFactory } from '@nestjs/core'
import { NodeAdapter } from '@nestjs/platform-node'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NativeLogger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { sharedConfig } from './configs'
import { APP_ENV, AppEnvEnum } from './constants'
import { basicAuth } from './middlewares'

async function bootstrap() {
  const adpater = new NodeAdapter()
  const app = await NestFactory.create<NestNodeApplication>(
    AppModule,
    adpater,
    {
      abortOnError: false,
      bufferLogs: true,
    },
  )

  app.enableShutdownHooks()

  const instance = app.getHttpAdapter().getInstance()

  // #region 日志配置
  const logger = app.get(NativeLogger)
  app.useLogger(logger)
  app.flushLogs()
  // #endregion

  // #region Basic Auth 保护路径
  const { user, pass } = sharedConfig.basicAuth ?? {}
  if (user && pass) {
    const auth = basicAuth({
      users: { [user]: pass },
      challenge: true,
    })
    app.use('/health', auth)
    app.use('/bull-ui', auth)
  }
  // #endregion

  if (APP_ENV === AppEnvEnum.DEV) {
    // #region Swagger 接口文档配置
    const config = new DocumentBuilder()
      .setTitle('Nitro Template')
      .setDescription('Nitro 模板接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('openapi', app, document, { swaggerUiEnabled: false })
    // #endregion
  }

  await app.init()

  return instance
}

export default await bootstrap()
