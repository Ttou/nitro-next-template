import { resolve } from 'node:path'
import { defineConfig } from 'nitro'

export default defineConfig({
  serverDir: './server',
  serverEntry: false,
  imports: false,
  routes: {
    '/:path(api|bull-ui|dev|openapi-(ui|json))/**': {
      handler: './server/main.ts',
      format: 'node',
    },
  },
  alias: {
    '~server': resolve(__dirname, 'server'),
    '~shared': resolve(__dirname, 'shared'),
  },
  rolldownConfig: {
    external: [
      'pg',
      'pg-query-stream',
      'mysql',
      'oracledb',
      'better-sqlite3',
      'sqlite3',
      'tedious',
    ],
  },
})
