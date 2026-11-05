import type { BullBoardModuleOptions } from '@bull-board/nestjs'
import type { ConfigType } from '@nestjs/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ExpressAdapter } from '@bull-board/express'
import { registerAs } from '@nestjs/config'
import basicAuth from 'express-basic-auth'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { SharedConfig } from './shared'

export const BullBoardConfig = registerAs('bull-board', () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  return match(APP_ENV)
    .returnType<BullBoardModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      route: '/bull-ui',
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: {
          [SharedConfig.basicAuth.user]: SharedConfig.basicAuth.pass,
        },
      }),
      boardOptions: {
        uiBasePath: dirname(resolve(__dirname, '../../node_modules/@bull-board/ui/package.json')),
      },
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IBullBoardConfig = ConfigType<typeof BullBoardConfig>
