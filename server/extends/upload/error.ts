import {
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common'

export const UploadErrors = {
  notMultipart: () =>
    new BadRequestException('Request must be multipart/form-data', {
      cause: 'upload.notMultipart',
    }),
  missing: () =>
    new BadRequestException('No file found in the request', {
      cause: 'upload.file.missing',
    }),
  extNotAllowed: (ext: string, allowed: string[]) =>
    new UnsupportedMediaTypeException(
      `Extension "${ext}" is not allowed. Allowed: ${allowed.join(', ')}`,
      { cause: 'upload.ext.notAllowed' },
    ),
  mimeNotAllowed: (mime: string, allowed: string[]) =>
    new UnsupportedMediaTypeException(
      `MIME type "${mime}" is not allowed. Allowed: ${allowed.join(', ')}`,
      { cause: 'upload.mime.notAllowed' },
    ),
  tooLarge: (maxMB: number) =>
    new PayloadTooLargeException(
      `File exceeds the maximum allowed size of ${maxMB}MB`,
      { cause: 'upload.size.exceeded' },
    ),
  resizeNotImage: () =>
    new BadRequestException('Resize is only supported for image files', {
      cause: 'upload.resize.notImage',
    }),
  tooManyFiles: (max: number) =>
    new BadRequestException(`Too many files. Maximum allowed: ${max}`, {
      cause: 'upload.files.tooMany',
    }),
}
