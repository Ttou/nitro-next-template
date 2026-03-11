import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IServer } from './interfaces'
import { MikroORM } from '@mikro-orm/core'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app'
import { NestLogger } from './loggers'
import { AllSeeders } from './seeders'
import { IsDev } from './utils'

// eslint-disable-next-line import/no-mutable-exports
export let nestApp: NestExpressApplication
// eslint-disable-next-line import/no-mutable-exports
export let serverApp: IServer

export async function bootstrap() {
  nestApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      abortOnError: false,
      logger: new NestLogger(),
    },
  )
  serverApp = nestApp.getHttpAdapter().getInstance()

  if (IsDev) {
    // #region Swagger 接口文档配置
    const config = new DocumentBuilder()
      .setTitle('Nitro Template')
      .setDescription('Nitro 模板接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(nestApp, config)

    nestApp.use('/openapi-ui', apiReference({
      content: document,
    }))

    serverApp.get('/openapi-json', (req, res) => {
      res.json(document)
    })
    // #endregion

    // #region 数据库初始化
    serverApp.get('/dev/dbInit', async (req, res) => {
      await nestApp.get(MikroORM).schema.refreshDatabase()
      res.send('初始化数据库结构成功')
    })

    serverApp.get('/dev/dbSeed', async (req, res) => {
      await nestApp.get(MikroORM).seeder.seed(AllSeeders)
      res.send('初始化数据库数据成功')
    })
  // #endregion
  }

  await nestApp.init()
}
bootstrap()
