import type { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app'
import { NestLogger } from './loggers'

export let app: NestExpressApplication

export async function initApp() {
  app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      abortOnError: false,
      logger: new NestLogger(),
    },
  )

  const config = new DocumentBuilder()
    .setTitle('Nitro Template')
    .setDescription('Nitro 模板接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)

  app.use('/openapi', apiReference({
    content: documentFactory(),
  }))

  await app.init()
}

export async function closeApp() {
  await app.close()
}
