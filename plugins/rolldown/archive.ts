import type { RolldownPlugin } from 'rolldown'
import { createWriteStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import archiver from 'archiver'

export interface ArchivePluginOptions {
  archives: Array<{
    sources: string[]
    target: string
    format: 'zip' | 'tar.gz'
  }>
  projectRoot?: string
}

export function RolldownArchivePlugin(options: ArchivePluginOptions): RolldownPlugin {
  const projectRoot = options.projectRoot || cwd()

  return {
    name: 'archive-plugin',
    writeBundle: async () => {
      try {
        for (const archive of options.archives) {
          // Add file extension based on format if not already present
          let target = archive.target
          if (archive.format === 'zip' && !target.endsWith('.zip')) {
            target += '.zip'
          }
          else if (archive.format === 'tar.gz' && !target.endsWith('.tar.gz')) {
            target += '.tar.gz'
          }
          const targetPath = resolve(projectRoot, target)
          const targetDir = dirname(targetPath)

          // Create target directory if it doesn't exist
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true })
          }

          // Create write stream
          const output = createWriteStream(targetPath)

          // Create archiver
          const format = archive.format === 'zip' ? 'zip' : 'tar'
          const archiverInstance = archiver(format, {
            gzip: archive.format === 'tar.gz',
            gzipOptions: {
              level: 9,
            },
          })

          // Pipe output
          archiverInstance.pipe(output)

          // Add files and directories
          for (const source of archive.sources) {
            const sourcePath = resolve(projectRoot, source)

            if (existsSync(sourcePath)) {
              const stats = statSync(sourcePath)

              if (stats.isDirectory()) {
                // Add directory recursively with its name as base path
                const dirName = source.split('/').pop() || source
                addDirectory(archiverInstance, sourcePath, dirName)
              }
              else if (stats.isFile()) {
                // Add single file with its name
                const fileName = source.split('/').pop() || source
                archiverInstance.file(sourcePath, {
                  name: fileName,
                })
              }
            }
          }

          // Finalize archive
          await archiverInstance.finalize()

          console.log(`Archive created: ${targetPath}`)
        }
      }
      catch (error) {
        console.error('Failed to create archives:', error)
      }
    },
  }
}

function addDirectory(archiverInstance: archiver.Archiver, directoryPath: string, basePath: string) {
  const files = readdirSync(directoryPath)

  for (const file of files) {
    const filePath = resolve(directoryPath, file)
    const stats = statSync(filePath)

    if (stats.isDirectory()) {
      addDirectory(archiverInstance, filePath, join(basePath, file))
    }
    else if (stats.isFile()) {
      archiverInstance.file(filePath, {
        name: join(basePath, file),
      })
    }
  }
}
