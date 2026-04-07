import { resolve } from 'node:path'
import { defineConfig } from 'nitro'
import { RolldownCopyPlugin } from './rolldown-plugins'

export default defineConfig({
  serverDir: './server',
  serverEntry: false,
  imports: false,
  routes: {
    '/:path(api|bull-ui|database|health|openapi-(ui|json))/**': {
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
      RolldownCopyPlugin({
        copies: [
          {
            source: 'node_modules/@bull-board/ui',
            target: '.output/server/node_modules/@bull-board/ui',
          },
        ],
      }),
    ],
  },
})
