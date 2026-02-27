import type { NestExpressApplication } from '@nestjs/platform-express'
import type { Express } from 'express'
import { MikroORM } from '@mikro-orm/core'
import { AllSeeders } from './seeders'

export function setupDev(nestApp: NestExpressApplication, expressApp: Express) {
  expressApp.get('/dev/dbInit', async (req, res) => {
    await nestApp.get(MikroORM).schema.refreshDatabase()
    res.send('初始化数据库结构成功')
  })

  expressApp.get('/dev/dbSeed', async (req, res) => {
    await nestApp.get(MikroORM).seeder.seed(AllSeeders)
    res.send('初始化数据库数据成功')
  })
}
