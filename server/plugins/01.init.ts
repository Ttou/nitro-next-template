import { definePlugin } from 'nitro'
import { closeApp, initApp } from '../app/main'

export default definePlugin(async (nitroApp) => {
  await initApp()

  nitroApp.hooks.hook('close', async () => {
    await closeApp()
  })
})
