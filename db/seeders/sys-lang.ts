import type { Dictionary, EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '../../shared/enums'
import { SysLangEntity } from '../entities'

export class SysLangSeeder extends Seeder {
  run(em: EntityManager, context: Dictionary) {
    em.create(SysLangEntity, {
      langKey: 'common.button.add',
      langValue: JSON.stringify({ en_US: 'Add', zh_CN: '添加' }),
      isBuiltin: YesOrNoEnum.YES,
      isAvailable: YesOrNoEnum.YES,
    })
    em.create(SysLangEntity, {
      langKey: 'common.button.batchDelete',
      langValue: JSON.stringify({ en_US: 'Batch Delete', zh_CN: '批量删除' }),
      isBuiltin: YesOrNoEnum.YES,
      isAvailable: YesOrNoEnum.YES,
    })
    em.create(SysLangEntity, {
      langKey: 'common.button.import',
      langValue: JSON.stringify({ en_US: 'Import', zh_CN: '导入' }),
      isBuiltin: YesOrNoEnum.YES,
      isAvailable: YesOrNoEnum.YES,
    })
    em.create(SysLangEntity, {
      langKey: 'common.button.export',
      langValue: JSON.stringify({ en_US: 'Export', zh_CN: '导出' }),
      isBuiltin: YesOrNoEnum.YES,
      isAvailable: YesOrNoEnum.YES,
    })
  }
}
