import type { IExcelColumnOptions, IExcelFileOptions } from './interface'

export const EXCEL_FILE_METADATA = 'excel:file'

export function ExcelFile(options?: IExcelFileOptions) {
  return function (target: any) {
    Reflect.defineMetadata(EXCEL_FILE_METADATA, options, target)
  }
}

export const EXCEL_COLUMN_METADATA = 'excel:column'

export function ExcelColumn(options?: IExcelColumnOptions) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(EXCEL_COLUMN_METADATA, options, target, propertyKey)
  }
}
