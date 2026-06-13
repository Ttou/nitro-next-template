import type { ConfigSchema } from '~server/configs'

export function getRedisUrl(options: ConfigSchema['redisShared']) {
  return `redis://${options.host}:${options.port}/${options.db}`
}
