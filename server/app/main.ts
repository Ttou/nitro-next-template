import type { NestExpressApplication } from '@nestjs/platform-express'
import type { Express } from 'express'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import basicAuth from 'express-basic-auth'
import { AppModule } from './app'
import { setupDev } from './dev'
import { NestLogger } from './loggers'
import { IsDev } from './utils'

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

  expressApp.use('/openapi-ui', basicAuth({
    challenge: true,
    users: {
      openapi: '123456',
    },
  }))
  nestApp.use('/openapi-ui', apiReference({
    content: document,
  }))

  expressApp.get('/openapi-json', (req, res) => {
    res.json(document)
  })

  if (IsDev) {
    setupDev(nestApp, expressApp)
  }

  await nestApp.init()
}

export async function closeNestApp() {
  await nestApp.close()
}
