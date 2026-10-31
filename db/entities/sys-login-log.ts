import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'
import { generateId } from '../../shared/utils/index.ts'

@Entity({ tableName: 'sys_login_log' })
export class SysLoginLogEntity {
  @PrimaryKey({
    type: 'uuid',
    onCreate: () => generateId(),
  })
  id: string

  @Property({ type: 'string' })
  ip: string

  @Property({ type: 'string' })
  location: string

  @Property({ type: 'string' })
  userName: string

  @Property({ type: 'text' })
  userAgent: string

  @Property({ type: 'string', nullable: true })
  token?: INullable<string>

  @Property({ type: 'integer' })
  status: number

  @Property({ type: 'text', nullable: true })
  errorMsg?: INullable<string>

  @Property({ type: 'datetime' })
  operateTime: Date

  @Property({ type: 'integer' })
  costTime: number
}
