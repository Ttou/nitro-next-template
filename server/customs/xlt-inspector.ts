import { createEventBufferSink } from '@xlt-token/inspector'

export const xltEventBuffer = createEventBufferSink({ capacity: 500 })
