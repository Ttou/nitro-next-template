import type { ExcelModuleOptions } from './excel.interface'

export const defaultOptions: ExcelModuleOptions = {
  defaultSheetName: 'Sheet1',
  defaultFileName: () => `${Date.now()}.xlsx`,
}
