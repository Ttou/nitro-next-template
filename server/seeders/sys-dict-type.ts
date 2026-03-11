import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '~shared/enums'
import { SysDictTypeEntity } from '../entities'

export class SysDictTypeSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    context.sexDictType = em.create(SysDictTypeEntity, { dictName: '性别', dictType: 'sys.user.sex', isAvailable: YesOrNoEnum.YES })
  }
}
