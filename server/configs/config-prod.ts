import type { ConfigSchema } from './config-schema'
import { registerAs } from '@nestjs/config'

export default registerAs('', (): ConfigSchema => {
  return {}
})
