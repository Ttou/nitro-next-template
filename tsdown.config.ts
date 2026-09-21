import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './server/main.ts',
  dts: false,
  unbundle: true,
  tsconfig: './tsconfig.node.json',
  outDir: './.server',
})
