import type { Dictionary, EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '../../enums'
import { SysRoleEntity } from '../entities'

export class SysRoleSeeder extends Seeder {
  run(em: EntityManager, context: Dictionary) {
    context.adminRole = em.create(SysRoleEntity, {
      roleKey: 'sys.role.admin',
      roleName: '管理员',
      isAvailable: YesOrNoEnum.YES,
      remark: '系统管理员，拥有所有菜单权限',
      menus: context.menus,
    })
  }
}
