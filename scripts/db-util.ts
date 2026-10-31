import { MikroORM } from '@mikro-orm/core'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import { MySqlDriver } from '@mikro-orm/mysql'
import * as entities from '../db/entities/index.ts'

export async function getOrm() {
  return await MikroORM.init({
    driver: MySqlDriver,
    metadataProvider: ReflectMetadataProvider,
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    dbName: 'nitro_template',
    debug: true,
    entities: Object.values(entities),
  })
}
