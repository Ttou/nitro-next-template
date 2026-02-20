import type { components } from './schema'

export type RemoveReqDto = components['schemas']['RemoveReqDto']

export type RealRes<T> = T['data']
