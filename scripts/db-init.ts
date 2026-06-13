import { exit } from 'node:process'
import { getOrm } from './db-util'

async function run() {
  const orm = await getOrm()

  await orm.schema.refresh({
    dropDb: true,
    createSchema: true,
  })
  await orm.close(true)

  console.log('初始化数据库结构成功')
  exit(0)
}
run()
