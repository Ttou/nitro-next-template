import { copyFile } from 'node:fs/promises'
import { resolve } from './util'

const FILES = ['.env.deploy', 'package.json']

async function run() {
  for (const file of FILES) {
    await copyFile(resolve(`deploy/${file}`), resolve(`.server/${file}`))
  }

  console.log(`Copied ${FILES.join(', ')} to .server`)
}

run()
