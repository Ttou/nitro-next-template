import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { SysConfigSeeder } from './sys-config'
import { SysDeptSeeder } from './sys-dept'
import { SysDictDataSeeder } from './sys-dict-data'
import { SysDictTypeSeeder } from './sys-dict-type'
import { SysLangSeeder } from './sys-lang'
import { SysMenuSeeder } from './sys-menu'
import { SysPostSeeder } from './sys-post'
import { SysRoleSeeder } from './sys-role'
import { SysUserSeeder } from './sys-user'

export class AllSeeders extends Seeder {
  async run(em: EntityManager, context?: Dictionary) {
    await this.call(em, [
      SysConfigSeeder,
      SysDictTypeSeeder,
      SysDictDataSeeder,
      SysLangSeeder,
      SysMenuSeeder,
      SysPostSeeder,
      SysRoleSeeder,
      SysDeptSeeder,
      SysUserSeeder,
    ])
  }
}
