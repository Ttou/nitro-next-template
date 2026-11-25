import type { StreamableFileOptions } from '@nestjs/common/file-stream/interfaces/index.js'
import type { Readable } from 'node:stream'
import type { z } from 'zod'
import type { ExcelModuleOptions, IExcelDefinition } from './excel.interface'
import { PassThrough } from 'node:stream'
import { WorkbookReader, WorkbookWriter } from '@cj-tech-master/excelts'
import { Inject, Injectable, Logger, StreamableFile } from '@nestjs/common'
import { isFunction } from 'es-toolkit'
import { defaultOptions } from './excel.constant'
import { MODULE_OPTIONS_TOKEN } from './excel.module-define'

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name)
  private options: ExcelModuleOptions

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private moduleOptions: ExcelModuleOptions,
  ) {
    this.options = Object.assign({}, defaultOptions, this.moduleOptions)
  }

  /**
   * 导入表格
   *
   * 按 schema 的字段顺序读取列，只取原始单元格值，不做校验与转换：
   * 空单元格同样要能落到对象上，缺失值与业务规则交由调用方判断
   */
  async importFile<S extends z.ZodObject>(definition: IExcelDefinition<S>, fileStream: Readable): Promise<z.infer<S>[]> {
    const workbookReader = new WorkbookReader(fileStream, {
      sharedStrings: 'cache',
      hyperlinks: 'ignore',
      styles: 'ignore',
    })
    const keys = this.getKeys(definition)
    const result: z.infer<S>[] = []
    let rowCount = 0

    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        rowCount++

        // 跳过表头
        if (rowCount === 1) {
          continue
        }

        const obj: Record<string, any> = {}

        keys.forEach((key, index) => {
          obj[key] = row.getCell(index + 1).value
        })

        result.push(obj as z.infer<S>)
      }
    }

    return result
  }

  exportFile(definition: IExcelDefinition, data: any[]) {
    const stream = new PassThrough()
    const streamableFileOptions = this.getStreamableFileOptions(definition)

    this.createWorkbook(stream, definition, data).catch((err) => {
      this.logger.error('导出大文件失败', err)
      stream.destroy(err)
    })

    return new StreamableFile(stream, streamableFileOptions)
  }

  private async createWorkbook(stream: PassThrough, definition: IExcelDefinition, data: any[]) {
    const wb = new WorkbookWriter({
      stream,
      useSharedStrings: true,
      useStyles: false,
    })
    const { fileName, sheetName, sheetOptions } = definition
    const ws = wb.addWorksheet(sheetName || this.defaultSheetName!, sheetOptions)
    const columns = this.getColumns(definition)
    const rows = this.getRows(definition, data)

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

  /**
   * 列配置：表头取字段说明，其余列属性取附加配置
   */
  private getColumns(definition: IExcelDefinition) {
    const shape = definition.schema.shape
    const columns: Record<string, any>[] = []

    for (const key of this.getKeys(definition)) {
      columns.push({
        key,
        header: shape[key]?.description ?? key,
        ...definition.columns?.[key],
      })
    }

    return columns
  }

  /**
   * 行数据：字段顺序与 schema 一致，每格都过一遍字段 schema
   */
  private getRows(definition: IExcelDefinition, data: any[]) {
    const shape = definition.schema.shape
    const keys = this.getKeys(definition)

    return data.map(row => Object.fromEntries(
      keys.map(key => [
        key,
        this.getCellValue(shape[key], row?.[key]),
      ]),
    ))
  }

  /**
   * 单元格取值
   *
   * 走字段 schema 的解析以应用 `transform`（如枚举值转标签）；
   * 解析失败时回落成原始值，避免个别空值/脏数据让整张表导出失败
   */
  private getCellValue(field: z.ZodType, value: unknown): unknown {
    const result = field.safeParse(value)
    return result.success ? result.data : value
  }

  private getKeys(definition: IExcelDefinition) {
    return Object.keys(definition.schema.shape)
  }

  private getStreamableFileOptions(definition: IExcelDefinition): StreamableFileOptions {
    const { fileName } = definition
    return {
      disposition: `attachment; filename=${encodeURIComponent(fileName || this.defaultFileName!)}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  }

  private get defaultSheetName() {
    return isFunction(this.options.defaultSheetName)
      ? this.options.defaultSheetName()
      : this.options.defaultSheetName
  }

  private get defaultFileName() {
    return isFunction(this.options.defaultFileName)
      ? this.options.defaultFileName()
      : this.options.defaultFileName
  }
}
