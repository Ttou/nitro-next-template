import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '~shared/enums'
import { SysUserEntity } from '../entities'

export class SysUserSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    em.create(SysUserEntity, { userName: 'admin', nickName: '若依', password: '$2y$10$HBHgHBCuHEvpTFfUQzjraOR4jdMjXp.yBZ0Tyr29kK/geRT9evpxW', email: '1361572192@qq.com', sex: context.sexMaleDictData.dictValue, isAvailable: YesOrNoEnum.YES, isDelete: YesOrNoEnum.NO, roles: [context.adminRole] })
  }
}
