import { Inject } from '@nestjs/common'
import { ALOVA_INSTANCE } from './alova.constant'

export function InjectAlova(): ReturnType<typeof Inject> {
  return Inject(ALOVA_INSTANCE)
}
