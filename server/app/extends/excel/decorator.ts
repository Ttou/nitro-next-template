import type { IExcelColumnOptions, IExcelFileOptions } from './interface'
import { Expose } from 'class-transformer'

/**
 * 表格文件装饰器标识
 */
export const EXCEL_FILE_METADATA = 'excel:file'

export function ExcelFile(options?: IExcelFileOptions) {
  return function (target: any) {
    Reflect.defineMetadata(EXCEL_FILE_METADATA, options, target)
  }
}

/**
 * 表格列装饰器标识
 */
export const EXCEL_COLUMN_METADATA = 'excel:column'
/**
 * 表格列序列化群组名
 */
export const EXCEL_COLUMN_EXPOSE = 'excel:column:expose'

export function ExcelColumn(options?: IExcelColumnOptions) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(EXCEL_COLUMN_METADATA, options, target, propertyKey)
    Expose({ groups: [EXCEL_COLUMN_EXPOSE] })
  }
}
