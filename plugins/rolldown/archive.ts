import type { RolldownPlugin } from 'rolldown'
import { createWriteStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import compressing from 'compressing'

export interface ArchivePluginOptions {
  archives: Array<{
    sources: string[]
    target: string
    format: 'zip' | 'tar' | 'gzip' | 'tgz'
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
          else if ((archive.format === 'tar' || archive.format === 'tgz') && !target.endsWith('.tar') && !target.endsWith('.tgz')) {
            if (archive.format === 'tar') {
              target += '.tar'
            }
            else {
              target += '.tgz'
            }
          }
          else if (archive.format === 'gzip' && !target.endsWith('.gz')) {
            target += '.gz'
          }
          const targetPath = resolve(projectRoot, target)
          const targetDir = dirname(targetPath)

          // Create target directory if it doesn't exist
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true })
          }

          // Create archive
          if (archive.format === 'zip') {
            const zipStream = new compressing.zip.Stream()
            await addFilesToStream(zipStream, archive.sources, projectRoot)
            const output = createWriteStream(targetPath)
            await new Promise((resolve, reject) => {
              zipStream.pipe(output)
                .on('finish', resolve)
                .on('error', reject)
            })
          }
          else if (archive.format === 'tar') {
            const tarStream = new compressing.tar.Stream()
            await addFilesToStream(tarStream, archive.sources, projectRoot)
            const output = createWriteStream(targetPath)
            await new Promise((resolve, reject) => {
              tarStream.pipe(output)
                .on('finish', resolve)
                .on('error', reject)
            })
          }
          else if (archive.format === 'gzip') {
            // Gzip only supports single file
            if (archive.sources.length > 1) {
              console.warn('Gzip format only supports single file, only the first file will be compressed')
            }

            const source = archive.sources[0]
            if (source) {
              const sourcePath = resolve(projectRoot, source)

              if (existsSync(sourcePath)) {
                const stats = statSync(sourcePath)

                if (stats.isFile()) {
                  // Compress single file with gzip
                  await compressing.gzip.compressFile(sourcePath, targetPath)
                }
                else {
                  console.warn('Gzip format only supports files, directories are not supported')
                }
              }
            }
          }
          else if (archive.format === 'tgz') {
            const tarStream = new compressing.tar.Stream()
            await addFilesToStream(tarStream, archive.sources, projectRoot)
            const gzipStream = new compressing.gzip.FileStream()
            const output = createWriteStream(targetPath)
            await new Promise((resolve, reject) => {
              tarStream.pipe(gzipStream).pipe(output).on('finish', resolve).on('error', reject)
            })
          }

          console.log(`Archive created: ${targetPath}`)
        }
      }
      catch (error) {
        console.error('Failed to create archives:', error)
      }
    },
  }
}

interface StreamWithAddEntry {
  addEntry: (path: string, options: { relativePath: string }) => void
}

async function addFilesToStream(stream: StreamWithAddEntry, sources: string[], projectRoot: string) {
  for (const source of sources) {
    const sourcePath = resolve(projectRoot, source)

    if (existsSync(sourcePath)) {
      const stats = statSync(sourcePath)

      if (stats.isDirectory()) {
        // Add directory recursively with its name as base path
        const dirName = source.split('/').pop() || source
        await addDirectoryToStream(stream, sourcePath, dirName)
      }
      else if (stats.isFile()) {
        // Add single file with its name
        const fileName = source.split('/').pop() || source
        stream.addEntry(sourcePath, { relativePath: fileName })
      }
    }
  }
}

async function addDirectoryToStream(stream: StreamWithAddEntry, directoryPath: string, basePath: string) {
  const files = readdirSync(directoryPath)

  for (const file of files) {
    const filePath = resolve(directoryPath, file)
    const stats = statSync(filePath)

    if (stats.isDirectory()) {
      await addDirectoryToStream(stream, filePath, join(basePath, file))
    }
    else if (stats.isFile()) {
      stream.addEntry(filePath, { relativePath: join(basePath, file) })
    }
  }
}
