import type { IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Entity, Enum, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'

@Entity({ tableName: 'sys_dict_type' })
export class SysDictTypeEntity extends BaseEntity {
  @Property({ type: 'string' })
  dictName: string

  @Property({ type: 'string' })
  dictType: string

  @Enum({
    items: () => YesOrNoEnumValues,
    type: 'string',
  })
  isAvailable: IYesOrNoEnum

  @Property({ type: 'string', nullable: true })
  remark?: INullable<string>
}
