import type { IExcelFileOptions } from './interface'
import { PassThrough } from 'node:stream'
import { Workbook } from '@cj-tech-master/excelts'
import { Injectable, StreamableFile } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { EXCEL_COLUMN_METADATA, EXCEL_FILE_METADATA } from './decorator'

@Injectable()
export class ExcelService {
  async exportBuffer(cls: any, data: any[]) {
    const wb = this.createWorkbook(cls, data)
    const { fileName } = this.getFileOptions(cls)

    const buffer = await wb.xlsx.writeBuffer()

    return new StreamableFile(buffer, {
      disposition: `attachment; filename=${encodeURIComponent(fileName || 'export.xlsx')}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  }

  exportStream(cls: any, data: any[]) {
    const wb = this.createWorkbook(cls, data)
    const stream = new PassThrough()
    const { fileName } = this.getFileOptions(cls)

    wb.xlsx.write(stream)

    return new StreamableFile(stream, {
      disposition: `attachment; filename=${encodeURIComponent(fileName || 'export.xlsx')}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  }

  createWorkbook(cls: any, data: any[]) {
    const wb = new Workbook()
    const { sheetName, sheetOptions } = this.getFileOptions(cls)
    const ws = wb.addWorksheet(sheetName || 'Sheet1', sheetOptions)
    const columns = this.getColumns(cls)
    const rows = this.getRows(cls, data)

    ws.columns = columns
    ws.addRows(rows)

    return wb
  }

  private getFileOptions(cls: any): IExcelFileOptions {
    return Reflect.getMetadata(EXCEL_FILE_METADATA, cls)
  }

  private getColumns(cls: any) {
    const columns = []
    const instance = Reflect.construct(cls, [])
    const keys = Object.keys(instance)

    for (const key of keys) {
      const item = Reflect.getMetadata(
        EXCEL_COLUMN_METADATA,
        cls.prototype,
        key,
      )

      if (item) {
        columns.push({ key, ...item })
      }
    }

    return columns
  }

  private getRows(cls: any, data: any[]) {
    const { transformOptions } = this.getFileOptions(cls)

    return data.map(v =>
      instanceToPlain(Reflect.construct(cls, [v]), transformOptions),
    )
  }
}
