import type { NestExpressApplication } from '@nestjs/platform-express'
import type { Express } from 'express'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app'
import { NestLogger } from './loggers'

export let nestApp: NestExpressApplication
export let expressApp: Express

export async function initNestApp() {
  nestApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      abortOnError: false,
      logger: new NestLogger(),
    },
  )
  expressApp = nestApp.getHttpAdapter().getInstance()

  const config = new DocumentBuilder()
    .setTitle('Nitro Template')
    .setDescription('Nitro 模板接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(nestApp, config)

  nestApp.use('/openapi', apiReference({
    content: document,
  }))

  expressApp.get('/openapi-json', (req, res) => {
    res.json(document)
  })

  await nestApp.init()
}

export async function closeNestApp() {
  await nestApp.close()
}
