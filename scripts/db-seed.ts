import { exit } from 'node:process'
import { DatabaseSeeders } from '../shared/database/seeders'
import { getOrm } from './db-util'

async function run() {
  const orm = await getOrm()

  await orm.seeder.seed(DatabaseSeeders)
  await orm.close(true)

  console.log('初始化数据库数据成功')
  exit(0)
}
run()
