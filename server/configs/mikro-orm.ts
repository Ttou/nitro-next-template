import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import type { ConfigType } from '@nestjs/config'
import { MySqlDriver } from '@mikro-orm/mysql'
import { registerAs } from '@nestjs/config'
import { match } from 'ts-pattern'
import { APP_ENV, AppEnvEnum } from '~server/constants'
import { CustomOrmLogger } from '~server/customs'
import * as entities from '~shared/db/entities'

export const MikroOrmConfig = registerAs('mikro-orm', () => {
  return match(APP_ENV)
    .returnType<MikroOrmModuleOptions>()
    .with(AppEnvEnum.DEV, () => ({
      driver: MySqlDriver,
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root',
      dbName: 'nitro_template',
      debug: true,
      entities: Object.values(entities),
      loggerFactory: options => new CustomOrmLogger(options),
    }))
    .with(AppEnvEnum.PROD, () => ({}))
    .run()
})

export type IMikroOrmConfig = ConfigType<typeof MikroOrmConfig>
