import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'nitro'

export default defineConfig({
  serverDir: './server',
  serverEntry: false,
  imports: false,
  routes: {
    '/:path(api|bull-ui|dev|health|openapi-(ui|json))/**': {
      handler: './server/main.ts',
      format: 'node',
    },
  },
  alias: {
    '~server': resolve(__dirname, 'server'),
    '~shared': resolve(__dirname, 'shared'),
  },
  rolldownConfig: {
    plugins: [
      {
        name: 'copy-bull-board-ui',
        writeBundle: async () => {
          try {
            const sourcePath = resolve(__dirname, 'node_modules/@bull-board/ui')
            const targetDir = resolve(__dirname, '.output/server/node_modules/@bull-board')
            const targetPath = resolve(targetDir, 'ui')

            await mkdir(targetDir, { recursive: true })
            await cp(sourcePath, targetPath, { recursive: true, force: true })
          }
          catch (error) {
            console.error('Failed to copy @bull-board/ui:', error)
          }
        },
      },
    ],
  },
})
