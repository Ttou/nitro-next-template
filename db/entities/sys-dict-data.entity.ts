import type { IYesOrNoEnum } from '../../shared/enums/index.ts'
import { Entity, Enum, Index, Property } from '@mikro-orm/decorators/legacy'
import { YesOrNoEnumValues } from '../../shared/enums/index.ts'
import { BaseEntity } from './base.entity.ts'

@Entity({ tableName: 'sys_dict_data' })
@Index({
  properties: ['dictType', 'dictValue'],
})
export class SysDictDataEntity extends BaseEntity {
  @Property({ type: 'string' })
  dictLabel: string

  @Property({ type: 'string' })
  dictValue: string

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
