import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '~shared/enums'
import { SysPostEntity } from '../entities'

export class SysPostSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    em.create(SysPostEntity, { postKey: 'ceo', postName: '董事长', isAvailable: YesOrNoEnum.YES })
    em.create(SysPostEntity, { postKey: 'se', postName: '项目经理', isAvailable: YesOrNoEnum.YES })
    em.create(SysPostEntity, { postKey: 'hr', postName: '人力资源', isAvailable: YesOrNoEnum.YES })
    em.create(SysPostEntity, { postKey: 'user', postName: '普通员工', isAvailable: YesOrNoEnum.YES })
  }
}
