import type { Dictionary, EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '../../shared/enums/index.ts'
import { SysDictTypeEntity } from '../entities/index.ts'

export class SysDictTypeSeeder extends Seeder {
  run(em: EntityManager, context: Dictionary) {
    context.sexDictType = em.create(SysDictTypeEntity, {
      dictName: '性别',
      dictType: 'sys.user.sex',
      isAvailable: YesOrNoEnum.YES,
    })
  }
}
