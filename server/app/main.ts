import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IServer } from './interfaces'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { AppModule } from './app'
import { NestLogger } from './loggers'
import { setupDev } from './setup-dev'
import { IsDev } from './utils'

export let nestApp: NestExpressApplication
export let serverApp: IServer

export async function initNestApp() {
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
    setupDev(nestApp, serverApp)
  }

  await nestApp.init()
}

export async function closeNestApp() {
  await nestApp.close()
}
