import { resolve } from 'node:path'
import { defineConfig } from 'nitro'
import { RolldownArchivePlugin, RolldownCopyPlugin } from './plugins'

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
  routeRules: {
    '/bull-ui/**': { basicAuth: { username: 'bull', password: '123456' } },
    '/health/**': { basicAuth: { username: 'health', password: '123456' } },
  },
  alias: {
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
      RolldownArchivePlugin({
        projectRoot: __dirname,
        archives: [
          {
            sources: ['.output', '.env.deploy', 'package.json'],
            target: './dist',
            format: 'tgz',
          },
        ],
      }),
    ],
  },
})
