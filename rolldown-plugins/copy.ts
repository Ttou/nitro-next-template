import type { RolldownPlugin } from 'rolldown'
import { cp, lstat, mkdir, realpath } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export interface CopyPluginOptions {
  copies: Array<{
    source: string
    target: string
  }>
}

export function RolldownCopyPlugin(options: CopyPluginOptions): RolldownPlugin {
  return {
    name: 'copy-plugin',
    writeBundle: async () => {
      try {
        for (const copy of options.copies) {
          let sourcePath = resolve(__dirname, '..', copy.source)
          const targetPath = resolve(__dirname, '..', copy.target)
          const targetDir = dirname(targetPath)

          // Resolve symlink to actual directory (important for pnpm)
          const stats = await lstat(sourcePath)
          if (stats.isSymbolicLink()) {
            sourcePath = await realpath(sourcePath)
          }

          await mkdir(targetDir, { recursive: true })
          await cp(sourcePath, targetPath, { recursive: true, force: true })
        }
      }
      catch (error) {
        console.error('Failed to copy directories:', error)
      }
    },
  }
}
