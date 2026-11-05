import type { NestNodeApplication } from '@nestjs/platform-node'
import { NestFactory } from '@nestjs/core'
import { NodeAdapter } from '@nestjs/platform-node'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NativeLogger } from 'nestjs-pino'
import { AppModule } from './app'
import { APP_ENV, AppEnvEnum } from './constants'

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

  if (APP_ENV === AppEnvEnum.PROD) {
    await app.listen(3000)
  }

  return instance
}

export default await bootstrap()
