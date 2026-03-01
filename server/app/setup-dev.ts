import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IServer } from './interfaces'
import { MikroORM } from '@mikro-orm/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AllSeeders } from './seeders'

export function setupDev(nestApp: NestExpressApplication, serverApp: IServer) {
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
