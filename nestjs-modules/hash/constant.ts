import type { HashModuleOptions } from './interface'
import { getRandomValues } from 'node:crypto'

export const defaultOptions: Partial<HashModuleOptions> = {}

export function genSalt() {
  const str = new Uint8Array(16)
  return getRandomValues(str)
}
