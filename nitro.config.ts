import { resolve } from 'node:path'
import { defineConfig } from 'nitro'
import { RolldownCopyPlugin } from './plugins/index.ts'

export default defineConfig({
  serverDir: './server',
  serverEntry: false,
  routes: {
    '/:path(api|bull-ui|openapi-json)/**': {
      handler: './server/main.ts',
      format: 'node',
    },
  },
  handlers: [
    {
      route: '/bull-ui/**',
      handler: './handlers/bull-ui.ts',
      middleware: true,
    },
  ],
  alias: {
    '~db': resolve(__dirname, 'db'),
    '~server': resolve(__dirname, 'server'),
    '~shared': resolve(__dirname, 'shared'),
  },
  rolldownConfig: {
    plugins: [
      RolldownCopyPlugin({
        projectRoot: __dirname,
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
