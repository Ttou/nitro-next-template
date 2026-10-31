import type { Dictionary, EntityManager } from '@mikro-orm/core'

import { Seeder } from '@mikro-orm/seeder'
import { SysConfigSeeder } from './sys-config.ts'
import { SysDeptSeeder } from './sys-dept.ts'
import { SysDictDataSeeder } from './sys-dict-data.ts'
import { SysDictTypeSeeder } from './sys-dict-type.ts'
import { SysLangSeeder } from './sys-lang.ts'
import { SysMenuSeeder } from './sys-menu.ts'
import { SysPostSeeder } from './sys-post.ts'
import { SysRoleSeeder } from './sys-role.ts'
import { SysUserSeeder } from './sys-user.ts'

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
