import { IsDev } from '../utils'
import dev from './config-dev'
import prod from './config-prod'

export * from './config-schema'

export const configuration = IsDev ? dev : prod
