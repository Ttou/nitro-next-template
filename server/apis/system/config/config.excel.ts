import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel'
import { YesOrNoEnum } from '~shared/enums'
import { enumLabelField, lazySchema } from '~shared/utils'

/**
 * 系统配置导出表
 */
export const exportSystemConfigExcel = lazySchema(() => defineExcel({
  fileName: '系统配置.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    configName: z.string().describe('参数名称'),
    configKey: z.string().describe('参数标识'),
    configValue: z.string().describe('参数键值'),
    isBuiltin: enumLabelField(YesOrNoEnum).describe('是否内置参数'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
}))
