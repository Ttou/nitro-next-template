import type { ISharedConfig } from '~server/configs'

export function getRedisUrl(options: ISharedConfig['redis']) {
  return `redis://${options.host}:${options.port}/${options.db}`
}
