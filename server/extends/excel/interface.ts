import type { AddWorksheetOptions } from '@cj-tech-master/excelts'
import { Column } from '@cj-tech-master/excelts'

export interface ExcelModuleOptions {
  /**
   * 是否在导入完成后删除临时文件
   */
  cleanTempFile?: boolean
}

export interface IExcelFileOptions {
  fileName?: string
  sheetName?: string
  sheetOptions?: AddWorksheetOptions
}

export type IExcelColumnOptions = Column['defn']
