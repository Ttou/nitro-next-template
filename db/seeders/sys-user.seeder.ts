import type { Dictionary, EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { bcrypt } from 'hash-wasm'
import { genSalt } from '../../nestjs-modules/hash/hash.constant.ts'
import { YesOrNoEnum } from '../../shared/enums/index.ts'
import { SysUserEntity } from '../entities/index.ts'

export class SysUserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary) {
    // 与后端 HashService.bcryptCrypto 保持一致，按初始密码动态生成 bcrypt 密文
    const password = await bcrypt({
      password: context.initPassword,
      salt: genSalt(),
      costFactor: 10,
    })

    em.create(SysUserEntity, {
      userName: 'admin',
      nickName: '若依',
      password,
      email: '1361572192@qq.com',
      sex: context.sexMaleDictData.dictValue,
      isAvailable: YesOrNoEnum.YES,
      isDelete: YesOrNoEnum.NO,
      roles: [context.adminRole],
    })
  }
}
