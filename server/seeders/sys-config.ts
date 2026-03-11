import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { YesOrNoEnum } from '~shared/enums'
import { SysConfigEntity } from '../entities'

export class SysConfigSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary) {
    em.create(SysConfigEntity, { configName: '验证码大小写敏感', configKey: 'sys.captcha.caseSensitive', configValue: '0', isBuiltin: YesOrNoEnum.YES, isAvailable: YesOrNoEnum.YES, remark: '0-不敏感，1-敏感' })
    em.create(SysConfigEntity, { configName: '账号初始密码', configKey: 'sys.user.initPassword', configValue: '123456', isBuiltin: YesOrNoEnum.YES, isAvailable: YesOrNoEnum.YES })
    em.create(SysConfigEntity, { configName: '账号单机在线', configKey: 'sys.user.singleOnline', configValue: '1', isBuiltin: YesOrNoEnum.YES, isAvailable: YesOrNoEnum.YES, remark: '0-多机在线，1-单机在线' })
  }
}
