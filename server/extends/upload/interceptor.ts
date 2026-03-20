import type { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common'
import type { UploadModuleOptions } from './interface'
import { BadRequestException, Inject, Injectable, mixin } from '@nestjs/common'
import { defaultOptions } from './constant'
import { UPLOAD_MODULE_OPTIONS } from './module-define'
import { uploadMultiple, uploadSingle } from './util'

export function FileInterceptor(
  fieldName: string,
  options?: UploadModuleOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinFileInterceptor implements NestInterceptor {
    constructor(
      @Inject(UPLOAD_MODULE_OPTIONS) private moduleOptions: UploadModuleOptions,
    ) {}

    private get mergedOptions() {
      return Object.assign({}, defaultOptions, this.moduleOptions, options)
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ) {
      const req = context.switchToHttp().getRequest()

      if (!req.isMultipart || !req.isMultipart()) {
        throw new BadRequestException('Request must be multipart/form-data')
      }

      const file = await uploadSingle(req, fieldName, this.mergedOptions)
      req.uploadedFile = file

      return next.handle()
    }
  }

  return mixin(MixinFileInterceptor)
}

export function FilesInterceptor(
  fieldName: string,
  options?: UploadModuleOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinFilesInterceptor implements NestInterceptor {
    constructor(
      @Inject(UPLOAD_MODULE_OPTIONS) private moduleOptions: UploadModuleOptions,
    ) {}

    private get mergedOptions() {
      return Object.assign({}, defaultOptions, this.moduleOptions, options)
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ) {
      const req = context.switchToHttp().getRequest()

      if (!req.isMultipart || !req.isMultipart()) {
        throw new BadRequestException('Request must be multipart/form-data')
      }

      const files = await uploadMultiple(req, fieldName, this.mergedOptions)
      req.uploadedFiles = files

      return next.handle()
    }
  }

  return mixin(MixinFilesInterceptor)
}

export function AnyFilesInterceptor(
  options?: UploadModuleOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinAnyFilesInterceptor implements NestInterceptor {
    constructor(
      @Inject(UPLOAD_MODULE_OPTIONS) private moduleOptions: UploadModuleOptions,
    ) {}

    private get mergedOptions() {
      return Object.assign({}, defaultOptions, this.moduleOptions, options)
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ) {
      const req = context.switchToHttp().getRequest()

      if (!req.isMultipart || !req.isMultipart()) {
        throw new BadRequestException('Request must be multipart/form-data')
      }

      const files = await uploadMultiple(req, undefined, this.mergedOptions)
      req.uploadedFiles = files

      return next.handle()
    }
  }

  return mixin(MixinAnyFilesInterceptor)
}
