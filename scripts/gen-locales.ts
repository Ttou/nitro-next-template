import { writeFileSync } from 'node:fs'
import { ensureDirectoryExists, resolve } from './util'

const CONFIG = {
  // 翻译 API 地址 (请替换为实际地址)
  TRANSLATE_API_URL: 'http://localhost:3000/api/system/lang/findAll?langCode=zh_CN',
  // 目标文件路径
  TARGET_FILE: resolve('.vscode/locales/zh_CN.json'),
}

async function run() {
  const res = await fetch(CONFIG.TRANSLATE_API_URL)

  const lang = await res.json()
  const content = JSON.stringify(lang, null, 2)

  ensureDirectoryExists(CONFIG.TARGET_FILE)

  writeFileSync(CONFIG.TARGET_FILE, content, 'utf-8')
}
run()
