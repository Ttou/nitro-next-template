import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** 资源文件目录，以本文件位置为基准，不受执行目录影响 */
const RESOURCE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'resource')

/**
 * 读取 resource 目录下的 JSON 文件，供 seeder 初始化数据使用
 * @param relativePath 相对于 resource 目录的路径
 * @example readResourceJson<string[]>('menus/zh_CN.json')
 */
export function readResourceJson<T = unknown>(relativePath: string): T {
  const filePath = join(RESOURCE_DIR, relativePath)

  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T
  }
  catch (err) {
    throw new Error(`读取 JSON 文件失败：${filePath}`, { cause: err })
  }
}
