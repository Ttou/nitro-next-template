import { writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { ensureDirectoryExists, resolve } from './util'

const CONFIG = {
  // 翻译 API 地址 (请替换为实际地址)
  TRANSLATE_API_URL: 'http://localhost:3000/api/system/lang/findAll',
  // 语言编码与目标文件
  TARGETS: [
    { langCode: 'zh_CN', file: 'resource/locales/zh_CN.json' },
    { langCode: 'en_US', file: 'resource/locales/en.json' },
  ],
}

async function run() {
  for (const { langCode, file } of CONFIG.TARGETS) {
    const res = await fetch(`${CONFIG.TRANSLATE_API_URL}?langCode=${langCode}`)

    const lang = await res.json()
    const content = JSON.stringify(lang, null, 2)
    const targetFile = resolve(file)

    ensureDirectoryExists(dirname(targetFile))

    writeFileSync(targetFile, content, 'utf-8')
  }
}
run()
