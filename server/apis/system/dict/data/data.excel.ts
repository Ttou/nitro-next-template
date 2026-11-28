import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel'
import { YesOrNoEnum } from '~shared/enums'
import { enumLabelField, lazySchema } from '~shared/utils'

/**
 * 系统字典数据导出表
 */
export const exportSystemDictDataExcel = lazySchema(() => defineExcel({
  fileName: '系统字典数据.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    dictLabel: z.string().describe('字典标签'),
    dictValue: z.string().describe('字典值'),
    dictType: z.string().describe('字典类型'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
}))
