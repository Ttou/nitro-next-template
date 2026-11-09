import type { Dictionary, EntityManager } from '@mikro-orm/core'

import { Seeder } from '@mikro-orm/seeder'
import { SysConfigSeeder } from './sys-config.seeder.ts'
import { SysDeptSeeder } from './sys-dept.seeder.ts'
import { SysDictDataSeeder } from './sys-dict-data.seeder.ts'
import { SysDictTypeSeeder } from './sys-dict-type.seeder.ts'
import { SysLangSeeder } from './sys-lang.seeder.ts'
import { SysMenuSeeder } from './sys-menu.seeder.ts'
import { SysPostSeeder } from './sys-post.seeder.ts'
import { SysRoleSeeder } from './sys-role.seeder.ts'
import { SysUserSeeder } from './sys-user.seeder.ts'

export class DatabaseSeeders extends Seeder {
  async run(em: EntityManager, context: Dictionary) {
    // 有关联关系的注意顺序，先创建父表数据，再创建子表数据
    await this.call(em, [
      SysConfigSeeder,
      SysDictTypeSeeder,
      SysDictDataSeeder,
      SysMenuSeeder,
      SysPostSeeder,
      SysRoleSeeder,
      SysDeptSeeder,
      SysUserSeeder,
      SysLangSeeder,
    ])
  }
}
