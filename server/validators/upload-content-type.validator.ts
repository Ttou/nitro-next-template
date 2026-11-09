/**
 * 上传文件类型检测，供 uploadToDisk 的 contentTypes/detectContentType 使用。
 * 内置签名检测仅覆盖图片与 PDF，其他文件类型的检测函数统一放在这里。
 */
import type { Buffer } from 'node:buffer'

export type ContentTypeDetector = (bytes: Buffer) => string | undefined

/**
 * 组合多个类型检测器：按顺序调用，返回第一个命中的类型，全部未命中返回 undefined。
 * detectContentType 只接受单个回调，contentTypes 含多种类型时用它组合各类型检测器
 */
export function composeContentTypeDetectors(...detectors: ContentTypeDetector[]): ContentTypeDetector {
  return (bytes) => {
    for (const detect of detectors) {
      const contentType = detect(bytes)
      if (contentType) {
        return contentType
      }
    }
    return undefined
  }
}

export const XLSX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

/**
 * 检测 xlsx：xlsx 是 ZIP 容器格式，无独立魔数，
 * 校验 PK 头且前缀包含 [Content_Types].xml 或 xl/workbook 条目
 */
export function detectXlsxContentType(bytes: Buffer) {
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04
  if (!isZip) {
    return undefined
  }
  const head = bytes.toString('latin1')
  return head.includes('[Content_Types].xml') || head.includes('xl/workbook')
    ? XLSX_CONTENT_TYPE
    : undefined
}
