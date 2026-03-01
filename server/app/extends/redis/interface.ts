import type { Redis, RedisOptions } from 'ioredis'

export interface RedisModuleOptions extends RedisOptions {}
export interface RedisClient extends Redis {}
