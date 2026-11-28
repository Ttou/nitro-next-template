import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel'
import { YesOrNoEnum } from '~shared/enums'
import { enumLabelField, lazySchema } from '~shared/utils'

/**
 * 系统字典类型导出表
 */
export const exportSystemDictTypeExcel = lazySchema(() => defineExcel({
  fileName: '系统字典类型.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    dictName: z.string().describe('字典名称'),
    dictType: z.string().describe('字典类型'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('可用状态'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
}))
