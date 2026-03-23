import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '~shared/enums'
import { SysDictDataEntity } from '../entities'

export class SysDictDataSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    context.sexMaleDictData = em.create(SysDictDataEntity, { dictLabel: '男', dictValue: '1', dictType: context.sexDictType.dictType, isAvailable: YesOrNoEnum.YES })
    em.create(SysDictDataEntity, { dictLabel: '女', dictValue: '2', dictType: context.sexDictType.dictType, isAvailable: YesOrNoEnum.YES })
    em.create(SysDictDataEntity, { dictLabel: '未知', dictValue: '3', dictType: context.sexDictType.dictType, isAvailable: YesOrNoEnum.YES })
  }
}
