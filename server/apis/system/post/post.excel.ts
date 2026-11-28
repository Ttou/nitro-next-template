import { z } from 'zod'
import { defineExcel } from '~nestjs-modules/excel'
import { YesOrNoEnum } from '~shared/enums'
import { enumLabelField, lazySchema } from '~shared/utils'

/**
 * 系统岗位导出表
 */
export const exportSystemPostExcel = lazySchema(() => defineExcel({
  fileName: '系统岗位.xlsx',
  schema: z.object({
    id: z.string().describe('ID'),
    postKey: z.string().describe('岗位标识'),
    postName: z.string().describe('岗位名称'),
    isAvailable: enumLabelField(YesOrNoEnum).describe('是否可用'),
    remark: z.string().describe('备注'),
    createBy: z.string().describe('创建人'),
    createdAt: z.date().describe('创建时间'),
    updateBy: z.string().describe('更新人'),
    updatedAt: z.date().describe('更新时间'),
  }),
}))
