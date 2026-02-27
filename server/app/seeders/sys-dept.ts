import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '~shared/enums'
import { SysDeptEntity } from '../entities'

class FirstLevelSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    context.ryDept = em.create(SysDeptEntity, { deptKey: 'ry', deptName: '若依科技', isAvailable: YesOrNoEnum.YES })
  }
}

class SecondLevelSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    const { ryDept } = context
    context.rySzDept = em.create(SysDeptEntity, { deptKey: 'ry.sz', deptName: '深圳分公司', parentId: ryDept.id, isAvailable: YesOrNoEnum.YES })
  }
}

class ThirdLevelSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    const { rySzDept } = context
    em.create(SysDeptEntity, { deptKey: 'ry.sz.develop', deptName: '研发部门', parentId: rySzDept.id, isAvailable: YesOrNoEnum.YES })
    em.create(SysDeptEntity, { deptKey: 'ry.sz.market', deptName: '市场部门', parentId: rySzDept.id, isAvailable: YesOrNoEnum.YES })
    em.create(SysDeptEntity, { deptKey: 'ry.sz.test', deptName: '测试部门', parentId: rySzDept.id, isAvailable: YesOrNoEnum.YES })
    em.create(SysDeptEntity, { deptKey: 'ry.sz.finance', deptName: '财务部门', parentId: rySzDept.id, isAvailable: YesOrNoEnum.YES })
    em.create(SysDeptEntity, { deptKey: 'ry.sz.operation', deptName: '运维部门', parentId: rySzDept.id, isAvailable: YesOrNoEnum.YES })
  }
}

export class SysDeptSeeder extends Seeder {
  async run(em: EntityManager, context?: Dictionary) {
    await this.call(em, [FirstLevelSeeder, SecondLevelSeeder, ThirdLevelSeeder], context)
  }
}
