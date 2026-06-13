import { MikroORM } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import * as entities from '../shared/database/entities'

export async function getOrm() {
  return await MikroORM.init({
    driver: MySqlDriver,
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    dbName: 'nitro_template2',
    debug: true,
    entities: Object.values(entities),
  })
}
