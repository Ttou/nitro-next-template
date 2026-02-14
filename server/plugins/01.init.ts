import { definePlugin } from 'nitro'
import { initCtx } from '../context/main'

export default definePlugin(async (nitroApp) => {
  await initCtx()
})
