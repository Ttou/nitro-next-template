import type { EntityManager } from '@mikro-orm/core'
import type { ILangEnum } from '../../shared/enums/index.ts'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Seeder } from '@mikro-orm/seeder'
import { LangEnum, YesOrNoEnum } from '../../shared/enums/index.ts'
import { SysLangEntity } from '../entities/index.ts'

/** 词条文件目录，以本文件位置为基准，不受执行目录影响 */
const LOCALES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'resource', 'locales')

/** 读取单个语言文件，返回 { langKey: 翻译文本 } */
function readLocaleMessages(langCode: ILangEnum) {
  const filePath = join(LOCALES_DIR, `${langCode}.json`)

  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, string>
  }
  catch (err) {
    throw new Error(`读取语言文件失败：${filePath}`, { cause: err })
  }
}

/**
 * 汇总所有语言的词条，相同 langKey 合并为一条记录
 * @example collectLangValues() // Map { 'common.button.add' => { zh_CN: '添加', en_US: 'Add' } }
 */
function collectLangValues() {
  const values = new Map<string, Partial<Record<ILangEnum, string>>>()

  for (const { value: langCode } of LangEnum.items) {
    for (const [langKey, langValue] of Object.entries(readLocaleMessages(langCode))) {
      if (typeof langValue !== 'string') {
        throw new TypeError(`语言文件 ${langCode}.json 中 ${langKey} 的值不是字符串`)
      }

      const record = values.get(langKey) ?? {}
      record[langCode] = langValue
      values.set(langKey, record)
    }
  }

  return values
}

export class SysLangSeeder extends Seeder {
  run(em: EntityManager) {
    for (const [langKey, langValue] of collectLangValues()) {
      em.create(SysLangEntity, {
        langKey,
        // 允许某个语言缺少该词条，取出时为空
        langValue: langValue as Record<ILangEnum, string>,
        isBuiltin: YesOrNoEnum.YES,
        isAvailable: YesOrNoEnum.YES,
      })
    }
  }
}
