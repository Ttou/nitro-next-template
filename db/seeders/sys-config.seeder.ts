import type { Dictionary, EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '../../shared/enums/index.ts'
import { SysConfigEntity } from '../entities/index.ts'

export class SysConfigSeeder extends Seeder {
  run(em: EntityManager, context: Dictionary) {
    const initPassword = '123456'
    context.initPassword = initPassword

    em.create(SysConfigEntity, {
      configName: '验证码大小写敏感',
      configKey: 'sys.captcha.caseSensitive',
      configValue: '0',
      isBuiltin: YesOrNoEnum.YES,
      isAvailable: YesOrNoEnum.YES,
      remark: '0-不敏感，1-敏感',
    })
    em.create(SysConfigEntity, {
      configName: '账号初始密码',
      configKey: 'sys.user.initPassword',
      configValue: initPassword,
      isBuiltin: YesOrNoEnum.YES,
      isAvailable: YesOrNoEnum.YES,
    })
  }
}
