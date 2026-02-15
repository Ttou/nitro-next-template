import type { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app'

export let app: NestExpressApplication

export async function initApp() {
  app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { abortOnError: false },
  )

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('openapi', app, documentFactory)

  await app.init()
}

export async function closeApp() {
  await app.close()
}
