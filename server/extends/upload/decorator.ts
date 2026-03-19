import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

/**
 * Extracts the single uploaded file processed by FileInterceptor
 */
export const UploadedFile = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    return req.uploadedFile
  },
)

/**
 * Extracts the multiple uploaded files processed by FilesInterceptor or AnyFilesInterceptor
 */
export const UploadedFiles = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    return req.uploadedFiles
  },
)
