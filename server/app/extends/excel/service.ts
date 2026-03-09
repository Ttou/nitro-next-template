import type { StreamableFileOptions } from '@nestjs/common/file-stream/interfaces'
import type { IExcelFileOptions } from './interface'
import { PassThrough } from 'node:stream'
import { Workbook, WorkbookWriter } from '@cj-tech-master/excelts'
import { Injectable, Logger, StreamableFile } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { pick } from 'es-toolkit'
import { EXCEL_COLUMN_EXPOSE, EXCEL_COLUMN_METADATA, EXCEL_FILE_METADATA } from './decorator'

@Injectable()
export class ExcelService {
  private logger = new Logger(ExcelService.name)

  exportStream(cls: any, data: any[]) {
    const stream = new PassThrough()
    const streamableFileOptions = this.getStreamableFileOptions(cls)

    this.createWorkbook(stream, cls, data).catch((err) => {
      this.logger.error('导出文件失败', err)
      stream.destroy(err)
    })

    return new StreamableFile(stream, streamableFileOptions)
  }

  exportLargeStream(cls: any, data: any[]) {
    const stream = new PassThrough()
    const streamableFileOptions = this.getStreamableFileOptions(cls)

    this.createLargeWorkbook(stream, cls, data).catch((err) => {
      this.logger.error('导出大文件失败', err)
      stream.destroy(err)
    })

    return new StreamableFile(stream, streamableFileOptions)
  }

  private async createWorkbook(stream: PassThrough, cls: any, data: any[]) {
    const wb = new Workbook()
    const { fileName, sheetName, sheetOptions } = this.getFileOptions(cls)
    const ws = wb.addWorksheet(sheetName || 'Sheet1', sheetOptions)
    const columns = this.getColumns(cls)
    const rows = this.getRows(cls, data)

    ws.columns = columns
    ws.addRows(rows)

    this.logger.debug(`${fileName} 开始写入小文件流`)

    return wb.xlsx.write(stream)
  }

  private async createLargeWorkbook(stream: PassThrough, cls: any, data: any[]) {
    const wb = new WorkbookWriter({
      stream,
    })
    const { fileName, sheetName, sheetOptions } = this.getFileOptions(cls)
    const ws = wb.addWorksheet(sheetName || 'Sheet1', sheetOptions)
    const columns = this.getColumns(cls)
    const rows = this.getRows(cls, data)

    ws.columns = columns

    const BATCH_SIZE = 1000
    const TOTAL_ROWS = rows.length

    this.logger.debug(`${fileName} 开始写入大文件流`)

    for (let i = 0; i <= TOTAL_ROWS; i++) {
      ws.addRow(rows[i]).commit() // 立即提交该行

      // 每批数据处理后让出事件循环
      if (i % BATCH_SIZE === 0) {
        await new Promise(resolve => setImmediate(resolve))
      }
    }

    // 完成写入
    ws.commit()
    await wb.commit()
  }

  private getFileOptions(cls: any): IExcelFileOptions {
    return Reflect.getMetadata(EXCEL_FILE_METADATA, cls)
  }

  private getColumns(cls: any) {
    const columns = []
    const keys = this.getKeys(cls)

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
    const keys = this.getKeys(cls)

    return data.map(v =>
      instanceToPlain(Reflect.construct(cls, [pick(v, keys)]), transformOptions),
    )
  }

  private getKeys(cls: any) {
    const instance = instanceToPlain(Reflect.construct(cls, []), { groups: [EXCEL_COLUMN_EXPOSE] })
    return Object.keys(instance)
  }

  private getStreamableFileOptions(cls: any): StreamableFileOptions {
    const { fileName } = this.getFileOptions(cls)
    return {
      disposition: `attachment; filename=${encodeURIComponent(fileName || 'export.xlsx')}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  }
}
