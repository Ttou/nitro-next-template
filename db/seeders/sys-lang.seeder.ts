import type { EntityManager } from '@mikro-orm/core'
import type { ILangEnum } from '../../shared/enums/index.ts'
import { Seeder } from '@mikro-orm/seeder'
import { LangEnum, YesOrNoEnum } from '../../shared/enums/index.ts'
import { SysLangEntity } from '../entities/index.ts'
import { readResourceJson } from '../utils/index.ts'

/**
 * 汇总所有语言的词条，相同 langKey 合并为一条记录
 * @example collectLangValues() // Map { 'common.button.add' => { zh_CN: '添加', en_US: 'Add' } }
 */
function collectLangValues() {
  const values = new Map<string, Partial<Record<ILangEnum, string>>>()

  for (const { value: langCode } of LangEnum.items) {
    const messages = readResourceJson<Record<string, string>>(`locales/${langCode}.json`)

    for (const [langKey, langValue] of Object.entries(messages)) {
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
