import { defineHandler } from 'nitro'
import { basicAuth } from 'nitro/h3'

export default defineHandler({
  middleware: [basicAuth({ username: 'admin', password: '123456', realm: 'Admin Area' })],
})
