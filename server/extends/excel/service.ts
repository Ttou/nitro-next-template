import type { StreamableFileOptions } from '@nestjs/common/file-stream/interfaces'
import type { ClassConstructor } from 'class-transformer'
import type { CustomStoredFile } from '~server/storages'
import type { IExcelFileOptions } from './interface'
import { createReadStream, promises } from 'node:fs'
import { PassThrough, pipeline } from 'node:stream'
import { WorkbookReader, WorkbookWriter } from '@cj-tech-master/excelts'
import { Injectable, Logger, StreamableFile } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { EXCEL_COLUMN_EXPOSE, EXCEL_COLUMN_METADATA, EXCEL_FILE_METADATA } from './decorator'

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name)

  async importFile(cls: ClassConstructor<any>, file: CustomStoredFile) {
    const fileStream = createReadStream(file.path)
    const stream = new PassThrough()

    pipeline(fileStream, stream, (err) => {
      if (err) {
        this.logger.error('导入文件失败:', err)
      }
    })

    const workbookReader = new WorkbookReader(stream, {
      sharedStrings: 'cache',
      hyperlinks: 'ignore',
      styles: 'ignore',
    })
    const keys = this.getKeys(cls)
    const result = []
    let rowCount = 0

    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        rowCount++

        // 跳过表头
        if (rowCount === 1) {
          continue
        }

        const obj = {}

        keys.forEach((key, index) => {
          obj[key] = row.getCell(index + 1).value
        })

        result.push(instanceToPlain(Reflect.construct(cls, [obj]), { strategy: 'excludeAll', groups: [EXCEL_COLUMN_EXPOSE] }))
      }
    }

    // 处理完成后，可以删除临时文件（可选）
    await promises.unlink(file.path)

    return result
  }

  exportFile(cls: ClassConstructor<any>, data: any[]) {
    const stream = new PassThrough()
    const streamableFileOptions = this.getStreamableFileOptions(cls)

    this.createWorkbook(stream, cls, data).catch((err) => {
      this.logger.error('导出大文件失败', err)
      stream.destroy(err)
    })

    return new StreamableFile(stream, streamableFileOptions)
  }

  private async createWorkbook(stream: PassThrough, cls: ClassConstructor<any>, data: any[]) {
    const wb = new WorkbookWriter({
      stream,
      useSharedStrings: true,
      useStyles: false,
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

  private getFileOptions(cls: ClassConstructor<any>): IExcelFileOptions {
    return Reflect.getMetadata(EXCEL_FILE_METADATA, cls)
  }

  private getColumns(cls: ClassConstructor<any>) {
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

  private getRows(cls: ClassConstructor<any>, data: any[]) {
    return data.map(v =>
      instanceToPlain(Reflect.construct(cls, [v]), { strategy: 'excludeAll', groups: [EXCEL_COLUMN_EXPOSE] }),
    )
  }

  private getKeys(cls: ClassConstructor<any>) {
    const instance = instanceToPlain(Reflect.construct(cls, []), { strategy: 'excludeAll', groups: [EXCEL_COLUMN_EXPOSE] })
    return Object.keys(instance)
  }

  private getStreamableFileOptions(cls: ClassConstructor<any>): StreamableFileOptions {
    const { fileName } = this.getFileOptions(cls)
    return {
      disposition: `attachment; filename=${encodeURIComponent(fileName || 'export.xlsx')}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  }
}
