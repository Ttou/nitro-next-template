import { writeFileSync } from 'node:fs'

import openapiTS, { astToString } from 'openapi-typescript'

import { resolve } from './util.js'

async function genTypes() {
  const file = resolve('/src/apis/schema.d.ts')
  const ast = await openapiTS('http://localhost:3000/swagger-json')
  const data = astToString(ast)

  writeFileSync(file, data, { encoding: 'utf-8' })
}
genTypes()
