import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import swc from 'unplugin-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nitro({
      serverDir: './server',
      serverEntry: './server/entry.ts',
      rolldownConfig: {
        output: {},
        plugins: [
          // swc.rolldown({
          //   jsc: {
          //     parser: {
          //       syntax: 'typescript',
          //       decorators: true,
          //     },
          //     transform: {
          //       decoratorMetadata: true,
          //       legacyDecorator: true,
          //     },
          //   },
          // }),
        ],
      },
    }),
  ],
})
