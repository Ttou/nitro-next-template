import type { MultipartFile } from '@fastify/multipart'
import type { FastifyRequest } from 'fastify'
import type { MergedUploadOptions, UploadFileResult } from './interface'
import { createHash } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { mkdir, unlink } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { PassThrough } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { UploadErrors } from './error'

async function processFile(
  data: MultipartFile,
  options: MergedUploadOptions,
): Promise<UploadFileResult> {
  const { dest, fileName, maxFileSize, mbDivisor, allowedExtensions, allowedMimeTypes } = options
  const ext = extname(data.filename).toLowerCase()
  const mime = data.mimetype

  if (allowedExtensions?.length && !allowedExtensions.includes(ext)) {
    throw UploadErrors.extNotAllowed(ext, allowedExtensions)
  }

  if (allowedMimeTypes?.length && !allowedMimeTypes.includes(mime)) {
    throw UploadErrors.mimeNotAllowed(mime, allowedMimeTypes)
  }

  await mkdir(dest, { recursive: true })

  const finalName = fileName(data)
  const filePath = join(dest, finalName)

  let finalSize = 0
  let finalChecksum = ''

  try {
    // High-performance direct-to-disk streaming processing without holding the file into RAM
    const writeStream = createWriteStream(filePath)
    const hashStream = createHash('sha256')
    const passThrough = new PassThrough()

    passThrough.on('data', (chunk) => {
      finalSize += chunk.length
      if (finalSize > maxFileSize) {
        passThrough.destroy(UploadErrors.tooLarge(maxFileSize / mbDivisor))
      }
      else {
        hashStream.update(chunk)
      }
    })

    await pipeline(data.file, passThrough, writeStream)

    // Verify multipart payload size constraint reached via truncation limits or chunk measurement
    if (data.file.truncated || finalSize > maxFileSize) {
      throw UploadErrors.tooLarge(maxFileSize / mbDivisor)
    }

    finalChecksum = hashStream.digest('hex')

    return {
      name: finalName,
      path: filePath,
      ext,
      size: finalSize,
      checksum: finalChecksum,
    }
  }
  catch (error) {
    // Graceful error handling: Clean up any partial artifacts to avoid space leakage
    await unlink(filePath).catch(() => {})
    throw error
  }
}

export async function uploadSingle(
  req: FastifyRequest,
  expectedField: string,
  options: MergedUploadOptions,
): Promise<UploadFileResult> {
  const data = await req.file({
    limits: { fileSize: options.maxFileSize },
  })

  if (!data)
    throw UploadErrors.missing()
  if (expectedField && data.fieldname !== expectedField)
    throw UploadErrors.missing()

  return processFile(data, options)
}

export async function uploadMultiple(
  req: FastifyRequest,
  expectedField: string | undefined,
  options: MergedUploadOptions,
): Promise<UploadFileResult[]> {
  const max = options?.maxFiles ?? 10
  const results: UploadFileResult[] = []

  const files = req.files({
    limits: { fileSize: options.maxFileSize },
  })

  for await (const data of files) {
    if (expectedField && data.fieldname !== expectedField)
      continue
    if (results.length >= max)
      throw UploadErrors.tooManyFiles(max)
    results.push(await processFile(data, options))
  }

  if (!results.length)
    throw UploadErrors.missing()

  return results
}
